import { cookies } from "next/headers";
import type { ReactNode } from "react";
import { CookieKey } from "./cookie-keys";
import { MedusaWrapper } from "./MedusaWrapper";

type LayoutProps = {
  children: ReactNode;
};

const layout = async (props: LayoutProps) => {
  const { children } = props;

  /* read cookies - access any cookie by name */
  const cookieStore = await cookies();
  /* default to "us" if undefined */
  const regionId = cookieStore.get(CookieKey.REGION)?.value;
  const salesChannelId = cookieStore.get(CookieKey.SALES_CHANNEL)?.value;
  const customerId = cookieStore.get(CookieKey.CUSTOMER)?.value;

  /* you can also get all cookies */
  // const allCookies = cookieStore.getAll();

  return (
    <MedusaWrapper
      regionId={regionId}
      salesChannelId={salesChannelId}
      customerId={customerId}
    >
      {children}
    </MedusaWrapper>
  );
};

export default layout;
