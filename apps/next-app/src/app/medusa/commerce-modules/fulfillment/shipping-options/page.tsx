import { cookies } from "next/headers";
import { CookieKey } from "@/app/medusa/cookie-keys";
import { Content } from "./Content";

const Page = async () => {
  const cookieStore = await cookies();
  const regionId = cookieStore.get(CookieKey.REGION)?.value;
  const salesChannelId = cookieStore.get(CookieKey.SALES_CHANNEL)?.value;
  const customerId = cookieStore.get(CookieKey.CUSTOMER)?.value;

  return (
    <Content
      regionId={regionId as string}
      salesChannelId={salesChannelId as string}
      customerId={customerId as string}
    />
  );
};

export default Page;
