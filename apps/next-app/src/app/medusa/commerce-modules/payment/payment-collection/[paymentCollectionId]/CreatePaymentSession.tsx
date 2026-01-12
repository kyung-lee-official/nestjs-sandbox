import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPaymentSession, PaymentQK } from "../../api";

type CreatePaymentSessionProps = {
  paymentCollectionId: string;
  paymentProviderId: string;
};

export const CreatePaymentSession = (props: CreatePaymentSessionProps) => {
  const { paymentCollectionId, paymentProviderId } = props;
  const queryClient = useQueryClient();

  const createPaymentSessionMutation = useMutation({
    mutationFn: async () => {
      const res = await createPaymentSession(
        paymentCollectionId,
        paymentProviderId,
      );
      return res;
    },
    onSuccess: (data) => {
      // console.log("Payment session created:", data);
      queryClient.invalidateQueries({
        queryKey: [
          PaymentQK.GET_PAYMENT_SESSION_BY_PAYMENT_COLLECTION_ID,
          paymentCollectionId,
        ],
      });
      queryClient.invalidateQueries({
        queryKey: [PaymentQK.GET_PAYMENT_COLLECTION_BY_ID, paymentCollectionId],
      });
    },
  });

  return (
    <button
      className="cursor-pointer rounded bg-blue-500 px-4 py-2 text-white"
      onClick={() => {
        createPaymentSessionMutation.mutate();
      }}
    >
      Create Payment Session
    </button>
  );
};
