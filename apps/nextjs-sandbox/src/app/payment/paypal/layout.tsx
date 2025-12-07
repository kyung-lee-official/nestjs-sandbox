import { PayPalWrapper } from "./PayPalWrapper";

type PayPalLayoutProps = {
	children: React.ReactNode;
};

export default async function PayPalLayout(props: PayPalLayoutProps) {
	const { children } = props;

	return <PayPalWrapper>{children}</PayPalWrapper>;
}
