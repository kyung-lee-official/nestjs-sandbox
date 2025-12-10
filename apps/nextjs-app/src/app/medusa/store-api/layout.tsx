import { cookies } from "next/headers";
import { ReactNode } from "react";
import { CookieKey } from "../actions";

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
  const customerId = cookieStore.get(CookieKey.CUSTOMER_FP_TOKEN)?.value;

  /* you can also get all cookies */
  // const allCookies = cookieStore.getAll();

  return <div>{children}</div>;
};

export default layout;
