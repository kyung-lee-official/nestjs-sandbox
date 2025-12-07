import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CartQK, getCartByRegionIdSalesChannelIdCustomerId } from "../api";
import { CustomerQK, getCustomerById } from "../../customer/api";
import { CartBasicInfo } from "./CartBasicInfo";
import { CartItems } from "./CartItems";
import { CartFooter } from "./CartFooter";

type CartProps = {
	regionId: string | undefined;
	salesChannelId: string | undefined;
	customerId: string | undefined;
};

export const Cart = (props: CartProps) => {
	const { regionId, salesChannelId, customerId } = props;

	const [isModalOpen, setIsModalOpen] = useState(false);

	const getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery = useQuery({
		queryKey: [
			CartQK.GET_CART_BY_REGION_ID_AND_SALES_CHANNEL_ID_AND_CUSTOMER_ID,
			regionId,
			salesChannelId,
			customerId,
		],
		queryFn: async () => {
			const res = await getCartByRegionIdSalesChannelIdCustomerId(
				regionId as string,
				salesChannelId as string,
				customerId as string
			);
			return res;
		},
		enabled: !!regionId && !!salesChannelId && !!customerId,
	});

	const customerQuery = useQuery({
		queryKey: [CustomerQK.GET_CUSTOMER_BY_ID, customerId],
		queryFn: async () => {
			const res = await getCustomerById(customerId as string);
			return res;
		},
		enabled: !!customerId,
	});

	if (getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.isLoading) {
		return <div>Loading cart...</div>;
	}

	if (getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.isError) {
		return <div>Error loading cart</div>;
	}

	const openModal = () => setIsModalOpen(true);
	const closeModal = () => setIsModalOpen(false);

	const { data } = getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery;

	return (
		<div className="relative h-4">
			<button
				className="absolute right-0
				underline decoration-dotted cursor-pointer"
				onClick={openModal}
			>
				Cart
			</button>

			{/* Modal */}
			{isModalOpen &&
				createPortal(
					<div
						className="fixed inset-0 flex items-center justify-center z-50
						bg-black/80 bg-opacity-50"
						onClick={closeModal}
					>
						<div
							className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[700px] overflow-y-auto"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Modal Header */}
							<div className="flex justify-between items-center mb-4">
								<h2 className="text-xl font-semibold">
									Shopping Cart
								</h2>
								<button
									onClick={closeModal}
									className="text-gray-500 hover:text-gray-700 text-xl font-bold"
								>
									×
								</button>
							</div>
							{/* Modal Content */}
							{data && (
								<CartBasicInfo
									cart={data}
									customerAddresses={
										customerQuery.data.addresses
									}
									regionId={regionId as string}
									salesChannelId={salesChannelId as string}
									customerId={customerId as string}
								/>
							)}
							{/* Cart Items */}
							<div className="space-y-4">
								<CartItems items={data.items} />
							</div>
							{/* Modal Footer */}
							{data && (
								<CartFooter
									cart={data}
									closeModal={closeModal}
								/>
							)}
						</div>
					</div>,
					document.body
				)}
		</div>
	);
};
