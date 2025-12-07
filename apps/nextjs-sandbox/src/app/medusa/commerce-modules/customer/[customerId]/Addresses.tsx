"use client";

import { AddAddress } from "./AddAddress";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteAddressById, CustomerQK } from "../api";

type AddressProps = {
	id: string;
	address_1: string;
	city: string;
	country_code: string;
	postal_code: string;
	first_name: string;
	last_name: string;
	customerId: string;
};

const Address = (props: AddressProps) => {
	const {
		id,
		address_1,
		city,
		country_code,
		postal_code,
		first_name,
		last_name,
		customerId,
	} = props;

	const queryClient = useQueryClient();

	const deleteAddressMutation = useMutation({
		mutationFn: async (addressId: string) => {
			const res = await deleteAddressById(addressId);
			return res;
		},
		onSuccess: () => {
			// Invalidate customer data to refresh addresses list
			queryClient.invalidateQueries({
				queryKey: [CustomerQK.GET_CUSTOMER_BY_ID, customerId],
			});
		},
		onError: (error) => {
			console.error("Error deleting address:", error);
		},
	});

	const handleDeleteAddress = async () => {
		// Optional: Add confirmation dialog
		if (window.confirm("Are you sure you want to delete this address?")) {
			try {
				await deleteAddressMutation.mutateAsync(id);
			} catch (error) {
				// Error handling is done in mutation onError
			}
		}
	};

	return (
		<div className="border-t border-dotted py-2">
			<div className="flex justify-between items-center">
				<div>
					{`${first_name} ${last_name}, ${address_1}, ${city}, ${country_code}, ${postal_code}`}{" "}
					<span className="text-gray-500 text-sm">({id})</span>
				</div>
				<button
					onClick={handleDeleteAddress}
					disabled={deleteAddressMutation.isPending}
					className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
				>
					{deleteAddressMutation.isPending ? "Deleting..." : "Delete"}
				</button>
			</div>

			{/* Error display for this specific address */}
			{deleteAddressMutation.isError && (
				<div className="text-sm text-red-400 mt-2">
					Failed to delete address. Please try again.
				</div>
			)}
		</div>
	);
};

type AddressesProps = {
	customerId: string;
	addresses: Omit<AddressProps, "customerId">[];
};

export const Addresses = (props: AddressesProps) => {
	const { customerId, addresses } = props;

	return (
		<div
			className="p-2
			border border-neutral-700 border-dashed rounded"
		>
			<div className="flex justify-between items-center mb-4">
				<h2>Addresses</h2>
				<AddAddress customerId={customerId} />
			</div>

			{addresses.length === 0 ? (
				<div className="text-gray-400 text-center py-4">
					No addresses found. Add your first address above.
				</div>
			) : (
				addresses.map((address, index) => (
					<Address
						key={address.id || index}
						{...address}
						customerId={customerId}
					/>
				))
			)}
		</div>
	);
};
