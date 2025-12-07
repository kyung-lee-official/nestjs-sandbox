import BasicMask from "./BasicMask";
import MaskImageFromHttp from "./MaskImageFromHttp";
import MaskImageFromLocal from "./MaskImageFromLocal";

const Block = ({ children }: any) => {
	return (
		<div
			className="flex flex-col w-fit p-4 gap-2
			bg-neutral-100
			rounded-lg"
		>
			{children}
		</div>
	);
};

const Page = () => {
	return (
		<div className="flex flex-col p-4 gap-4">
			<Block>
				<h1>Basic Mask</h1>
				<BasicMask />
			</Block>
			<Block>
				<h1>CSS: mask-image, mask image from http</h1>
				<h2 className="text-neutral-500">
					Note that black now represents &quot;display&quot;
				</h2>
				<MaskImageFromHttp />
			</Block>
			<Block>
				<h1>CSS: mask-image, mask image from local</h1>
				<MaskImageFromLocal />
			</Block>
		</div>
	);
};

export default Page;
