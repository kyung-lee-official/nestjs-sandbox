import { cookies } from "next/headers";
import { Content } from "./Content";

const Page = async () => {
  const cookieStore = await cookies();
  const regionId = cookieStore.get("medusaRegion")?.value;
  const salesChannelId = cookieStore.get("medusaSalesChannel")?.value;
  const customerId = cookieStore.get("medusaCustomer")?.value;

  return (
    <Content
      regionId={regionId as string}
      salesChannelId={salesChannelId as string}
      customerId={customerId as string}
    />
  );
};

export default Page;
