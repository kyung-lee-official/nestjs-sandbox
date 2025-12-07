import { useMutation, useQuery } from "@tanstack/react-query";
import {
	completePaymentCollection,
	deleteCart,
	forceCompleteCart,
} from "../api";
import { getPaymentCollectionByCartId, PaymentQK } from "../../payment/api";
import Link from "next/link";
import { useRouter } from "next/navigation";

type CartFooterProps = {
	cart: any;
	closeModal: () => void;
};

export const CartFooter = (props: CartFooterProps) => {
	const { cart, closeModal } = props;
	const router = useRouter();

	/* Check if cart has both shipping address and shipping method selected */
	const hasShippingAddress = !!cart.shipping_address;
	const hasShippingMethod = !!cart.shipping_methods && cart.shipping_methods.length > 0;
	const canCheckout = hasShippingAddress && hasShippingMethod;

	const getPaymentCollectionByCartIdQuery = useQuery({
		queryKey: [PaymentQK.GET_PAYMENT_COLLECTION_BY_CART_ID, cart.id],
		queryFn: async () => {
			const res = await getPaymentCollectionByCartId(cart.id);
			return res;
		},
	});

	const completePaymentCollectionMutation = useMutation({
		mutationFn: async (cartId: string) => {
			const res = await completePaymentCollection(cartId);
			return res;
		},
		onSuccess: (data) => {
			router.push(
				`/medusa/commerce-modules/payment/payment-collection/${data.completed_cart.id}`
			);
		},
	});

	const forceCompleteCartMutation = useMutation({
		mutationFn: async (cartId: string) => {
			const res = await forceCompleteCart(cartId);
			return res;
		},
		onSuccess: (data) => {
			console.log(data);
		},
	});

	const deleteCartMutation = useMutation({
		mutationFn: async (cartId: string) => {
			const res = await deleteCart(cartId);
			return res;
		},
		onSuccess: () => {},
	});

	return (
		<div
			className="mt-6 p-2 space-y-3
			bg-neutral-100 rounded"
		>
			<div className="flex justify-between items-center mb-4">
				<span className="font-semibold">
					Total: {cart.total} {cart.currency_code}
				</span>
			</div>
			<div className="flex gap-2">
				<button
					onClick={closeModal}
					className="flex-1 px-4 py-2 border border-gray-300 rounded hover:bg-gray-50"
				>
					Continue Shopping
				</button>
				{getPaymentCollectionByCartIdQuery.data &&
				getPaymentCollectionByCartIdQuery.data.payment_collection ? (
					<Link
						href={`/medusa/commerce-modules/payment/payment-collection/${getPaymentCollectionByCartIdQuery.data.payment_collection.id}`}
						className="flex-1 px-4 py-2 border border-neutral-300 border-dashed rounded"
					>
						Go to Payment Collection
					</Link>
				) : canCheckout ? (
					<button
						className="flex-1 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
						onClick={() => {
							completePaymentCollectionMutation.mutate(cart.id);
						}}
					>
						Checkout
					</button>
				) : (
					<button
						className="flex-1 px-4 py-2 bg-gray-300 text-gray-500 rounded cursor-not-allowed"
						disabled
						title="Please select shipping address and method"
					>
						{!hasShippingAddress 
							? "Select Shipping Address" 
							: !hasShippingMethod 
							? "Select Shipping Method" 
							: "Checkout"}
					</button>
				)}
			</div>
			<div className="flex gap-3">
				<button
					className="text-red-500
										underline decoration-dotted cursor-pointer"
					onClick={() => {
						forceCompleteCartMutation.mutate(cart.id);
					}}
				>
					Complete Cart Manually
				</button>
				<button
					className="text-red-500
										underline decoration-dotted cursor-pointer"
					onClick={() => {
						deleteCartMutation.mutate(cart.id);
					}}
				>
					Delete Cart Manually
				</button>
			</div>
		</div>
	);
};
