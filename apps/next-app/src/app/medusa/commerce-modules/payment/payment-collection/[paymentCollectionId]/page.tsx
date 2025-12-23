import Content from "./Content";

type PageProps = {
  params: Promise<{ paymentCollectionId: string }>;
};

export default async function PaymentCollectionPage(props: PageProps) {
  const { paymentCollectionId } = await props.params;

  return <Content paymentCollectionId={paymentCollectionId} />;
}
