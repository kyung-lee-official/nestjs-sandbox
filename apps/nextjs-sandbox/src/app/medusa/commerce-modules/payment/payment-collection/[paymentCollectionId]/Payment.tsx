import { useQuery } from "@tanstack/react-query";
import { getPaymentById, PaymentQK } from "../../../payment/api";

type PaymentProps = {
	paymentId: string;
};

export const Payment = (props: PaymentProps) => {
	const { paymentId } = props;

	const getPaymentByIdQuery = useQuery({
		queryKey: [PaymentQK.GET_PAYMENT_BY_ID, paymentId],
		queryFn: async () => {
			const res = await getPaymentById(paymentId);
			return res;
		},
	});

	if (getPaymentByIdQuery.isLoading) {
		return <div>Loading Payment...</div>;
	}

	if (getPaymentByIdQuery.error) {
		return <div>Error loading payment</div>;
	}

	if (paymentId) {
		return (
			<div
				className="p-3
				border border-neutral-700 border-dashed rounded"
			>
				<h1>Payment</h1>
				<div>ID: {paymentId}</div>
				<div>Currency: {getPaymentByIdQuery.data?.currency_code}</div>
				<div>Provider ID: {getPaymentByIdQuery.data?.provider_id}</div>
				<div>
					Payment Session ID:{" "}
					{getPaymentByIdQuery.data?.payment_session_id}
				</div>
			</div>
		);
	} else {
		return <div>No Payment ID provided</div>;
	}
};
