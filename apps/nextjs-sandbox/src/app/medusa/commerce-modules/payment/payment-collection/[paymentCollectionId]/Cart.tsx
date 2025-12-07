import { useQuery } from "@tanstack/react-query";
import { Dispatch, SetStateAction, useEffect } from "react";
import { CartQK, getCartByPaymentCollectionId } from "../../../cart/api";

type CartProps = {
	paymentCollectionId: string;
	setCartRegionId: Dispatch<SetStateAction<string | null>>;
};

export const Cart = (props: CartProps) => {
	const { paymentCollectionId, setCartRegionId } = props;

	const getCartByPaymentCollectionIdQuery = useQuery({
		queryKey: [
			CartQK.GET_CART_BY_PAYMENT_COLLECTION_ID,
			paymentCollectionId,
		],
		queryFn: async () => {
			const res = await getCartByPaymentCollectionId(paymentCollectionId);
			return res;
		},
	});

	useEffect(() => {
		if (getCartByPaymentCollectionIdQuery.data) {
			setCartRegionId(
				getCartByPaymentCollectionIdQuery.data.cart.region.id
			);
		}
	}, [getCartByPaymentCollectionIdQuery.data]);

	if (getCartByPaymentCollectionIdQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (getCartByPaymentCollectionIdQuery.error) {
		return <div>Error loading cart</div>;
	}

	const { cart } = getCartByPaymentCollectionIdQuery.data;

	return (
		<div
			className="p-3
			bg-neutral-100"
		>
			<h1>Cart</h1>
			<div>ID: {cart.id}</div>
			<div>
				Customer: {cart.email} ({cart.customer_id})
			</div>
			<div>
				Region: {cart.region.name} ({cart.region.id})
			</div>
			<div>Currency: {cart.region.currency_code}</div>
			<div>
				Sales Channel: {cart.sales_channel.name} (
				{cart.sales_channel_id})
			</div>
			{cart.completed_at ? (
				<div>Completed At: {cart.completed_at}</div>
			) : (
				<div className="text-red-500">Cart is not completed</div>
			)}
		</div>
	);
};
