import { Content } from "./Content";

type PageProps = {
  params: Promise<{ salesChannelId: string }>;
};

export default async function Page(props: PageProps) {
  const { salesChannelId } = await props.params;
  return <Content salesChannelId={salesChannelId} />;
}
