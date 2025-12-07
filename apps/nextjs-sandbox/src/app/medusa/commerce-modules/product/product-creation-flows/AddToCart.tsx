import { useMutation } from "@tanstack/react-query";
import { CartQK, updateCart } from "../../cart/api";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";

type AddToCartProps = {
	variantId: string;
	cartId: string | string[] | null;
	regionId: string | undefined;
	salesChannelId: string | undefined;
	customerId: string | undefined;
};

export const AddToCart = (props: AddToCartProps) => {
	const { variantId, cartId, regionId, salesChannelId, customerId } = props;

	const updateCartMutation = useMutation({
		mutationFn: async (data) => {
			const res = await updateCart(cartId as string, {
				items: [{ variant_id: variantId, quantity: 1 }],
			});
			return res;
		},
		onSuccess: (data) => {
			queryClient.invalidateQueries({
				queryKey: [
					CartQK.GET_CART_BY_REGION_ID_AND_SALES_CHANNEL_ID_AND_CUSTOMER_ID,
					regionId,
					salesChannelId,
					customerId,
				],
			});
		},
	});

	return (
		<button
			className="underline decoration-dotted cursor-pointer"
			onClick={() => {
				updateCartMutation.mutate();
			}}
		>
			Add to Cart
		</button>
	);
};
