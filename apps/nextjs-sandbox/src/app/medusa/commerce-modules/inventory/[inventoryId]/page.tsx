import { Content } from "./Content";

type InventoryPageProps = {
	params: Promise<{
		inventoryId: string;
	}>;
};

export default async function Page(props: InventoryPageProps) {
	const { inventoryId } = await props.params;

	return <Content inventoryId={inventoryId} />;
}
