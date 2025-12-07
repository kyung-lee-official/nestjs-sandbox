import { Content } from "./Content";

type PageProps = {
	params: Promise<{
		shippingOptionId: string;
	}>;
};

const Page = async (props: PageProps) => {
	const { shippingOptionId } = await props.params;
	return <Content shippingOptionId={shippingOptionId} />;
};

export default Page;
