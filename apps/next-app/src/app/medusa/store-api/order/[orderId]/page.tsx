import Content from "./Content";

type Props = {
  params: Promise<{ orderId: string }>;
};

const Page = async (props: Props) => {
  const { orderId } = await props.params;
  return <Content orderId={orderId} />;
};

export default Page;
