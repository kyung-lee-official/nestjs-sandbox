import { Dispatch, ReactNode, SetStateAction } from "react";

export const Modal = (props: {
	show: boolean;
	setShow: Dispatch<SetStateAction<boolean>>;
	children: ReactNode;
}) => {
	const { show, setShow, children } = props;
	if (!show) return null;

	return (
		<div
			className="absolute top-0 left-0 right-0 bottom-0 z-10
			bg-neutral-900/50"
			onClick={(e) => {
				setShow(false);
			}}
		>
			<div
				className="absolute top-20 left-20 right-20 bottom-20
				p-8
				bg-neutral-900"
				onClick={(e) => {
					e.stopPropagation(); // Prevent the click event from bubbling up to the parent div
				}}
			>
				{children}
			</div>
		</div>
	);
};
