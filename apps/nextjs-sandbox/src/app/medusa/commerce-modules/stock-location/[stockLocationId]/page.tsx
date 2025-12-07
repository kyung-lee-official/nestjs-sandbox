import { Content } from "./Content";

type PageProps = {
	params: Promise<{ stockLocationId: string }>;
};

export default async function Page(props: PageProps) {
	const { stockLocationId } = await props.params;
	return <Content stockLocationId={stockLocationId} />;
}
