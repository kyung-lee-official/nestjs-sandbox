import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  authorizePaymentSession,
  getPaymentSessionByPaymentCollectionId,
  PaymentQK,
} from "../../api";
import { Payment } from "./Payment";

type PaymentSessionProps = {
  paymentCollectionId: string;
};

export const PaymentSession = (props: PaymentSessionProps) => {
  const { paymentCollectionId } = props;
  const queryClient = useQueryClient();

  const getPaymentSessionByPaymentCollectionIdQuery = useQuery({
    queryKey: [
      PaymentQK.GET_PAYMENT_SESSION_BY_PAYMENT_COLLECTION_ID,
      paymentCollectionId,
    ],
    queryFn: async () => {
      const res =
        await getPaymentSessionByPaymentCollectionId(paymentCollectionId);
      return res;
    },
  });

  const authorizePaymentSessionMutation = useMutation({
    mutationFn: async () => {
      await authorizePaymentSession(
        getPaymentSessionByPaymentCollectionIdQuery.data.id,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [PaymentQK.GET_PAYMENT_COLLECTION_BY_ID, paymentCollectionId],
      });
      queryClient.invalidateQueries({
        queryKey: [
          PaymentQK.GET_PAYMENT_SESSION_BY_PAYMENT_COLLECTION_ID,
          paymentCollectionId,
        ],
      });
    },
  });

  if (getPaymentSessionByPaymentCollectionIdQuery.isLoading) {
    return <div>Loading Payment Sessions...</div>;
  }

  if (getPaymentSessionByPaymentCollectionIdQuery.error) {
    return <div>Error loading payment sessions</div>;
  }

  return (
    <div>
      {getPaymentSessionByPaymentCollectionIdQuery.data ? (
        <div className="space-y-2 rounded border p-2">
          <h1>Payment Session:</h1>
          <div>ID: {getPaymentSessionByPaymentCollectionIdQuery.data.id}</div>
          <div>
            Provider ID:{" "}
            {getPaymentSessionByPaymentCollectionIdQuery.data.provider_id}
          </div>
          <div>
            Payment ID:{" "}
            {getPaymentSessionByPaymentCollectionIdQuery.data.payment?.id}
          </div>
          <button
            className="cursor-pointer rounded bg-blue-500 p-2 text-white"
            onClick={() => authorizePaymentSessionMutation.mutate()}
          >
            Authorize Payment Session
          </button>
          {getPaymentSessionByPaymentCollectionIdQuery.data.payment && (
            <Payment
              paymentId={
                getPaymentSessionByPaymentCollectionIdQuery.data.payment.id
              }
            />
          )}
        </div>
      ) : (
        <div>No Payment Session Found</div>
      )}
    </div>
  );
};
