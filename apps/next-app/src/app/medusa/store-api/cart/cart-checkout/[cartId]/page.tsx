import PaymentCollection from "./PaymentCollection";

type Props = {
  params: Promise<{ cartId: string }>;
};

const Page = async (props: Props) => {
  const { cartId } = await props.params;
  return <PaymentCollection cartId={cartId} />;
};

export default Page;
