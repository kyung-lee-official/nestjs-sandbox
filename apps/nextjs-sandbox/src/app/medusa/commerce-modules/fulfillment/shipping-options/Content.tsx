"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { FulfillmentQK, getShippingOptionsByCartId } from "../api";
import {
	CartQK,
	getCartByRegionIdSalesChannelIdCustomerId,
} from "../../cart/api";
import { Table, Tbody, Thead } from "@/app/styles/basic/table/table/Table";

type ContentProps = {
	regionId: string;
	salesChannelId: string;
	customerId: string;
};

export const Content = (props: ContentProps) => {
	const { regionId, salesChannelId, customerId } = props;

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

	const cartId =
		getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.data?.id;

	const getAvailableShippingOptionsQuery = useQuery({
		queryKey: [FulfillmentQK.GET_SHIPPING_OPTIONS_BY_CART_ID, cartId],
		queryFn: async () => {
			if (!cartId) {
				throw new Error("Cart ID is required");
			}
			const res = await getShippingOptionsByCartId(cartId);
			return res;
		},
		enabled: !!cartId,
	});

	if (getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.isError) {
		return <div>Error loading cart data</div>;
	}

	if (getAvailableShippingOptionsQuery.isLoading) {
		return <div>Loading...</div>;
	}

	if (getAvailableShippingOptionsQuery.isError) {
		return <div>Error loading shipping options</div>;
	}

	return (
		<div className="flex flex-col m-6">
			<h1>
				Shipping Options for cart{" "}
				{getCartByRegionIdAndSalesChannelIdAndCustomerIdQuery.data?.id}
			</h1>
			<div className="bg-neutral-500">
				<Table>
					<Thead>
						<tr>
							<th>ID</th>
							<th>Name</th>
							<th>Provider</th>
						</tr>
					</Thead>
					<Tbody>
						{getAvailableShippingOptionsQuery.data?.map(
							(sm: any) => (
								<tr key={sm.id}>
									<td>
										<Link
											href={`/medusa/commerce-modules/fulfillment/shipping-options/${sm.id}`}
											className="underline decoration-dotted cursor-pointer"
										>
											{sm.id}
										</Link>
									</td>
									<td>{sm.name}</td>
									<td>{sm.provider.id}</td>
								</tr>
							)
						)}
					</Tbody>
				</Table>
			</div>
		</div>
	);
};
