import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { Dropdown } from "@/app/styles/dropdown/universal-dropdown/dropdown/Dropdown";
import { FulfillmentQK } from "../../fulfillment/api";
import { CartQK, getCartById, linkShippingAddressToCart } from "../api";

type ShippingAddressProps = {
  cartId: string;
  customerAddresses: any[];
  regionId: string;
  salesChannelId: string;
  customerId: string;
};

export const ShippingAddress = (props: ShippingAddressProps) => {
  const { cartId, customerAddresses, regionId, salesChannelId, customerId } =
    props;
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  const cartQuery = useQuery({
    queryKey: [CartQK.GET_CART_BY_ID, cartId],
    queryFn: async () => {
      const res = await getCartById(cartId);
      return res;
    },
    enabled: !!cartId,
  });

  const cartShippingAddress = cartQuery.data?.shipping_address || null;

  /* Initialize dropdown selection state */
  const [selectedAddrId, setSelectedAddrId] = useState<
    string | string[] | null
  >(null);

  /* Sync selectedAddrId with cart shipping address when cart data changes */
  useEffect(() => {
    if (cartShippingAddress?.metadata?.customer_address_id) {
      setSelectedAddrId(cartShippingAddress.metadata.customer_address_id);
    } else {
      setSelectedAddrId(null);
    }
  }, [cartShippingAddress?.metadata?.customer_address_id]);

  const linkAddressMutation = useMutation({
    mutationFn: async (addressId: string) => {
      const res = await linkShippingAddressToCart(cartId, addressId);
      return res;
    },
    onSuccess: (data) => {
      /* Invalidate cart query to refresh cart data */
      queryClient.invalidateQueries({
        queryKey: [CartQK.GET_CART_BY_ID, cartId],
      });
      /* Invalidate shipping options since they may change with new address */
      queryClient.invalidateQueries({
        queryKey: [FulfillmentQK.GET_SHIPPING_OPTIONS_BY_CART_ID, cartId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          CartQK.GET_CART_BY_REGION_ID_AND_SALES_CHANNEL_ID_AND_CUSTOMER_ID,
          regionId,
          salesChannelId,
          customerId,
        ],
      });
    },
    onError: (error) => {
      console.error("Error linking shipping address:", error);
      /* Revert to no selection on error */
      setSelectedAddrId(null);
    },
  });

  const handleAddressSelected = async (
    newAddressId:
      | string
      | string[]
      | null
      | ((prevState: string | string[] | null) => string | string[] | null),
  ) => {
    const addressValue =
      typeof newAddressId === "function"
        ? newAddressId(selectedAddrId)
        : newAddressId;

    /* Update local state immediately for ui feedback */
    setSelectedAddrId(addressValue);

    /* Only proceed if we have a valid string address ID */
    if (typeof addressValue === "string") {
      startTransition(async () => {
        try {
          await linkAddressMutation.mutateAsync(addressValue);
        } catch (error) {
          /* Error handling is already done in the mutation */
        }
      });
    }
  };

  /* Show loading state while cart is loading */
  if (cartQuery.isLoading) {
    return (
      <div className="text-sm text-gray-400">Loading cart information...</div>
    );
  }

  /* Show error state if cart query fails */
  if (cartQuery.isError) {
    return (
      <div className="text-sm text-red-400">
        Failed to load cart information. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Loading indicator for address update */}
      {(isPending || linkAddressMutation.isPending) && (
        <div className="text-sm text-blue-400 mb-2">
          Updating shipping address...
        </div>
      )}

      {/* Error display for address update */}
      {linkAddressMutation.isError && (
        <div className="text-sm text-red-400 mb-2">
          Failed to update shipping address. Please try again.
        </div>
      )}

      <Dropdown
        mode="regular"
        options={customerAddresses.map((addr) => addr.id)}
        selected={selectedAddrId}
        setSelected={handleAddressSelected}
        placeholder="Select a shipping address"
        getLabel={(selected) => {
          const found = customerAddresses.find((ca: any) => ca.id === selected);

          if (!found) {
            return <div className="text-white">Address not found</div>;
          }
          return (
            <div className="text-white">
              {found?.first_name} {found?.last_name}, {found?.address_1},{" "}
              {found?.city}
            </div>
          );
        }}
        optionWrapperClassName={(option, { selected, hovered }) => {
          return `px-2 py-1 
						${hovered ? "bg-neutral-700" : ""}}
						cursor-pointer truncate`;
        }}
        renderOption={(option, { selected, hovered }) => {
          const found = customerAddresses.find((addr) => addr.id === option);
          return (
            <div
              className={`flex items-center px-2 gap-2 ${
                selected ? "text-blue-500" : ""
              } ${hovered ? "bg-neutral-700" : ""}
								rounded truncate`}
            >
              <span>
                {found?.first_name} {found?.last_name}, {found?.address_1},{" "}
                {found?.city}
              </span>
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
    </div>
  );
};
