import { ReactNode } from "react";

export function Item(props: { children: ReactNode }) {
	const { children } = props;
	return (
		<div
			className="flex-[0_0_80px] flex justify-center items-center h-full px-[10px]
			bg-green-600/40"
		>
			{children}
		</div>
	);
}

export function Placeholder() {
	return <div className="flex-[0_1_60px]"></div>;
}
