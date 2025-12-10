import { Content } from "./Content";

type PageProps = {
  params: Promise<{
    orderId: string;
  }>;
};

export default async function Page({ params }: PageProps) {
  const { orderId } = await params;

  return <Content orderId={orderId} />;
}
