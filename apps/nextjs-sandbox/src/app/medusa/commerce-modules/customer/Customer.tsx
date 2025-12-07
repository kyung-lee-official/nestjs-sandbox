import { useQuery } from "@tanstack/react-query";
import { useState, useTransition } from "react";
import { CustomerQK, getCustomerList } from "./api";
import { setCustomerCookie } from "../../actions";
import { Dropdown } from "@/app/styles/dropdown/universal-dropdown/dropdown/Dropdown";

type CustomerProps = {
	customerId: string | undefined;
};

export const Customer = (props: CustomerProps) => {
	const { customerId } = props;
	const [selectedCustomerId, setSelectedCustomerId] = useState<
		string | string[] | null
	>(customerId || null);
	const [isPending, startTransition] = useTransition();

	const customerQuery = useQuery({
		queryKey: [CustomerQK.GET_CUSTOMER_LIST],
		queryFn: async () => {
			const res = await getCustomerList();
			return res;
		},
	});

	const handleCustomerChange = (
		newCustomer:
			| string
			| string[]
			| null
			| ((
					prevState: string | string[] | null
			  ) => string | string[] | null)
	) => {
		const customerValue =
			typeof newCustomer === "function"
				? newCustomer(selectedCustomerId)
				: newCustomer;
		setSelectedCustomerId(customerValue);

		if (typeof customerValue === "string") {
			startTransition(async () => {
				try {
					await setCustomerCookie(customerValue);
					/* optionally refresh the page to reflect the new customer */
					window.location.reload();
				} catch (error) {
					console.error("Failed to set customer cookie:", error);
				}
			});
		}
	};

	if (customerQuery.isLoading) {
		return <div>Loading Customers...</div>;
	}

	if (customerQuery.isError) {
		return <div>Error loading Customers</div>;
	}

	return (
		<Dropdown
			mode="regular"
			options={customerQuery.data.map((customer: any) => customer.id)}
			selected={selectedCustomerId}
			setSelected={handleCustomerChange}
			placeholder="Select a customer"
			getLabel={(option: string) => {
				const label = customerQuery.data.find(
					(customer: any) => customer.id === option
				)?.email;
				return label || option;
			}}
			optionWrapperClassName={(option, { selected, hovered }) => {
				return `px-2 py-1
						${hovered ? "bg-neutral-700" : ""}}
						cursor-pointer truncate`;
			}}
			renderOption={(option: string, state) => {
				const label = customerQuery.data.find(
					(customer: any) => customer.id === option
				)?.email;
				return (
					<div
						className={`px-3 py-2 cursor-pointer ${
							state.hovered ? "bg-neutral-400" : ""
						} ${state.selected ? "bg-neutral-500" : ""}`}
					>
						{label}
					</div>
				);
			}}
			selectedItemClassName={(option) => "text-white truncate"}
			controlClassName="flex items-center flex-wrap min-h-8 px-2 py-1 gap-2
			bg-neutral-800
			border-1 border-neutral-700 rounded-md cursor-pointer"
			placeholderClassName="text-neutral-400 truncate"
			menuClassName="absolute z-10 w-full mt-1
			text-white/60
			bg-neutral-800
			border border-neutral-700 rounded-md overflow-auto"
		/>
	);
};
