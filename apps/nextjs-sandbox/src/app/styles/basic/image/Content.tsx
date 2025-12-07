"use client";

import { Image } from "antd";

const Card = (props: any) => {
	const { src } = props;
	return (
		<div className="flex gap-4 bg-slate-400">
			<div className="w-1/3 max-w-[300px]">
				<img className="w-full" src={src} alt="" />
			</div>
			<div>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime
				placeat, voluptates consectetur non numquam quasi corporis
				temporibus aperiam quo quam iste amet provident, consequatur
				veniam optio, veritatis earum perferendis officiis!
			</div>
		</div>
	);
};

const AntCard = (props: any) => {
	const { src } = props;
	return (
		<div className="flex gap-4 bg-slate-400">
			<div className="flex justify-center items-center w-1/3 max-w-[300px]">
				<Image className="w-full" src={src} alt="" />
			</div>
			<div>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime
				placeat, voluptates consectetur non numquam quasi corporis
				temporibus aperiam quo quam iste amet provident, consequatur
				veniam optio, veritatis earum perferendis officiis!
			</div>
		</div>
	);
};

const FixedAspectRatioCard = (props: any) => {
	const { src } = props;
	return (
		<div className="flex gap-4 bg-slate-400">
			<div
				className="flex justify-center items-center w-1/3 max-w-[300px] aspect-square
				border-dashed border-blue-500 border-2"
			>
				<img className="max-h-full" src={src} alt="" />
			</div>
			<div>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime
				placeat, voluptates consectetur non numquam quasi corporis
				temporibus aperiam quo quam iste amet provident, consequatur
				veniam optio, veritatis earum perferendis officiis!
			</div>
		</div>
	);
};

const AntFixedAspectRatioCard = (props: any) => {
	const { src, error } = props;
	return (
		<div className={`flex gap-4 ${error ? "bg-red-400" : "bg-slate-400"}`}>
			<div
				className="flex justify-center items-center w-1/3 max-w-[300px] aspect-square
				border-dashed border-blue-500 border-2"
			>
				<div className="flex justify-center items-center max-h-full">
					<Image src={src} alt="" />
				</div>
			</div>
			<div>
				Lorem ipsum dolor sit amet consectetur, adipisicing elit. Maxime
				placeat, voluptates consectetur non numquam quasi corporis
				temporibus aperiam quo quam iste amet provident, consequatur
				veniam optio, veritatis earum perferendis officiis!
			</div>
		</div>
	);
};

const Content = () => {
	return (
		<div className="flex flex-col w-full min-h-screen p-10 gap-20">
			<div className="flex flex-col gap-10">
				<h1 className="text-4xl">HTML img</h1>
				<Card src={"/images/styles/image/horizontal.jpg"} />
				<Card src={"/images/styles/image/vertical.jpg"} />
				<Card src={"/images/styles/image/400x400.jpg"} />
			</div>
			<div className="flex flex-col gap-10">
				<h1 className="text-4xl">Ant Design Image</h1>
				<AntCard src={"/images/styles/image/horizontal.jpg"} />
				<AntCard src={"/images/styles/image/vertical.jpg"} />
				<AntCard src={"/images/styles/image/400x400.jpg"} />
			</div>
			<div className="flex flex-col gap-10">
				<h1 className="text-4xl">HTML img in Fixed Aspect Ratio Div</h1>
				<FixedAspectRatioCard
					src={"/images/styles/image/horizontal.jpg"}
				/>
				<FixedAspectRatioCard
					src={"/images/styles/image/vertical.jpg"}
				/>
				<FixedAspectRatioCard
					src={"/images/styles/image/400x400.jpg"}
				/>
			</div>
			<div className="flex flex-col gap-10">
				<h1 className="text-4xl">
					Ant Image in Fixed Aspect Ratio Div
				</h1>
				<AntFixedAspectRatioCard
					src={"/images/styles/image/horizontal.jpg"}
				/>
				<AntFixedAspectRatioCard
					src={"/images/styles/image/vertical.jpg"}
					error={true}
				/>
				<AntFixedAspectRatioCard
					src={"/images/styles/image/400x400.jpg"}
				/>
			</div>
		</div>
	);
};

export default Content;
