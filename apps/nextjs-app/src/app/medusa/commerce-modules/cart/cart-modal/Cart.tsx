import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { createPortal } from "react-dom";
import { CustomerQK, getCustomerById } from "../../customer/api";
import { CartQK, getCartByRegionIdSalesChannelIdCustomerId } from "../api";
import { CartBasicInfo } from "./CartBasicInfo";
import { CartFooter } from "./CartFooter";
import { CartItems } from "./CartItems";

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
        customerId as string,
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
        type="button"
        className="absolute right-0 cursor-pointer underline decoration-dotted"
        onClick={openModal}
      >
        Cart
      </button>

      {/* Modal */}
      {isModalOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 bg-opacity-50"
            onClick={closeModal}
          >
            <div
              className="bg-white rounded-lg p-6 max-w-6xl w-full mx-4 max-h-[700px] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-semibold text-xl">Shopping Cart</h2>
                <button
                  type="button"
                  onClick={closeModal}
                  className="font-bold text-gray-500 text-xl hover:text-gray-700"
                >
                  ×
                </button>
              </div>
              {/* Modal Content */}
              {data && (
                <CartBasicInfo
                  cart={data}
                  customerAddresses={customerQuery.data.addresses}
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
              {data && <CartFooter cart={data} closeModal={closeModal} />}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
};
