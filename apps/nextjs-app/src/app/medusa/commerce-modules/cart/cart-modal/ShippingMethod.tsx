"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState, useTransition } from "react";
import { Dropdown } from "@/app/styles/dropdown/universal-dropdown/dropdown/Dropdown";
import {
  FulfillmentQK,
  getShippingOptionsByCartId,
} from "../../fulfillment/api";
import { CartQK, getCartById, linkShippingMethodToCart } from "../api";

type ShippingMethodProps = {
  cartId: string;
  regionId: string;
  salesChannelId: string;
  customerId: string;
};

export const ShippingMethod = (props: ShippingMethodProps) => {
  const { cartId, regionId, salesChannelId, customerId } = props;
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  // Query cart data to get current shipping method and check if shipping address exists
  const cartQuery = useQuery({
    queryKey: [CartQK.GET_CART_BY_ID, cartId],
    queryFn: async () => {
      const res = await getCartById(cartId);
      return res;
    },
    enabled: !!cartId,
  });

  const cartData = cartQuery.data;
  const hasShippingAddress = !!cartData?.shipping_address;
  const currentShippingMethod = cartData?.shipping_methods?.[0] || null;

  // Query shipping options - only when shipping address exists
  const shippingOptionsQuery = useQuery({
    queryKey: [FulfillmentQK.GET_SHIPPING_OPTIONS_BY_CART_ID, cartId],
    queryFn: async () => {
      const res = await getShippingOptionsByCartId(cartId);
      return res;
    },
    enabled: !!cartId && hasShippingAddress, // Only fetch when cart has shipping address
  });

  /* Initialize dropdown selection state */
  const [selectedMethodId, setSelectedMethodId] = useState<
    string | string[] | null
  >(null);

  /* Sync selectedMethodId with cart's current shipping method using shipping_option_id */
  useEffect(() => {
    if (currentShippingMethod?.shipping_option_id) {
      setSelectedMethodId(currentShippingMethod.shipping_option_id);
    } else {
      setSelectedMethodId(null);
    }
  }, [currentShippingMethod?.shipping_option_id]);

  const linkMethodMutation = useMutation({
    mutationFn: async (shippingOptionId: string) => {
      const res = await linkShippingMethodToCart(cartId, shippingOptionId);
      return res;
    },
    onSuccess: (data) => {
      /* Invalidate cart query to refresh the data */
      queryClient.invalidateQueries({
        queryKey: [CartQK.GET_CART_BY_ID, cartId],
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
      console.error("Error linking shipping method:", error);
      /* Revert to current shipping method on error */
      setSelectedMethodId(currentShippingMethod?.shipping_option_id || null);
    },
  });

  const handleMethodSelected = async (
    newMethodId:
      | string
      | string[]
      | null
      | ((prevState: string | string[] | null) => string | string[] | null),
  ) => {
    const methodValue =
      typeof newMethodId === "function"
        ? newMethodId(selectedMethodId)
        : newMethodId;

    /* Update local state immediately for UI feedback */
    setSelectedMethodId(methodValue);

    /* Only proceed if we have a valid string method ID */
    if (typeof methodValue === "string") {
      startTransition(async () => {
        try {
          await linkMethodMutation.mutateAsync(methodValue);
        } catch (error) {
          /* Error handling is already done in the mutation */
        }
      });
    }
  };

  /* Don't render if no shipping address is selected */
  if (!hasShippingAddress) {
    return (
      <div className="text-sm text-gray-400">
        Please select a shipping address first
      </div>
    );
  }

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

  /* Show loading state while shipping options are loading */
  if (shippingOptionsQuery.isLoading) {
    return (
      <div className="text-sm text-gray-400">Loading shipping options...</div>
    );
  }

  /* Show error state if shipping options query fails */
  if (shippingOptionsQuery.isError) {
    return (
      <div className="text-sm text-red-400">
        Failed to load shipping options. Please try again.
      </div>
    );
  }

  const shippingOptions = shippingOptionsQuery.data || [];

  /* Show message if no shipping options available */
  if (shippingOptions.length === 0) {
    return (
      <div className="text-sm text-yellow-400">
        No shipping options available for this address
      </div>
    );
  }

  return (
    <div>
      {/* Loading indicator for method update */}
      {(isPending || linkMethodMutation.isPending) && (
        <div className="text-sm text-blue-400 mb-2">
          Updating shipping method...
        </div>
      )}

      {/* Error display for method update */}
      {linkMethodMutation.isError && (
        <div className="text-sm text-red-400 mb-2">
          Failed to update shipping method. Please try again.
        </div>
      )}

      <Dropdown
        mode="regular"
        options={shippingOptions.map((option: any) => option.id)}
        selected={selectedMethodId}
        setSelected={handleMethodSelected}
        placeholder="Select a shipping option"
        getLabel={(option: string) => {
          const found = shippingOptions.find((opt: any) => opt.id === option);
          if (!found) {
            return <div className="text-white">Method not found</div>;
          }
          return (
            <div className="text-white">
              {found.name} - ${(found.price_incl_tax / 100).toFixed(2)}
            </div>
          );
        }}
        optionWrapperClassName={(option, { selected, hovered }) => {
          return `px-2 py-1 
						${hovered ? "bg-neutral-700" : ""}
						cursor-pointer truncate`;
        }}
        renderOption={(option: string, { selected, hovered }) => {
          const found = shippingOptions.find((opt: any) => opt.id === option);
          return (
            <div
              className={`flex items-center justify-between px-2 gap-2 ${
                selected ? "text-blue-500" : ""
              } ${hovered ? "bg-neutral-700" : ""}
								rounded truncate`}
            >
              <span className="flex-1">{found?.name || option}</span>
              <span className="text-sm">
                ${found ? (found.price_incl_tax / 100).toFixed(2) : "N/A"}
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
