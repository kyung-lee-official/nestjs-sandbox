import { cookies } from "next/headers";
import { CookieKey } from "@/app/medusa/cookie-keys";
import { Content } from "./Content";

type PageProps = {
  params: Promise<{ productId: string }>;
};

export default async function Page(props: PageProps) {
  const cookieStore = await cookies();
  const region = cookieStore.get(CookieKey.REGION)?.value;
  const salesChannel = cookieStore.get(CookieKey.SALES_CHANNEL)?.value;
  const customer = cookieStore.get(CookieKey.CUSTOMER)?.value;
  const { productId } = await props.params;
  return (
    <Content
      productId={productId}
      salesChannelId={salesChannel}
      regionId={region}
      customerId={customer}
    />
  );
}
