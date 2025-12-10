import React from "react";
import { Content } from "./Content";

type PageProps = {
  params: Promise<{ customerId: string }>;
};

const Page = async (props: PageProps) => {
  const { customerId } = await props.params;
  return <Content customerId={customerId} />;
};

export default Page;
