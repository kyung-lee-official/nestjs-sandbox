import { ReactNode } from "react";

const Block = ({ title, children }: { title: string; children: ReactNode }) => {
	return (
		<div className="flex flex-col gap-4">
			<div className="text-lg">{title}</div>
			{children}
		</div>
	);
};

const Page = () => {
	return (
		<div className="flex flex-col p-10">
			<Block title={"Pulse"}>
				<div
					className="flex flex-col w-3/5 gap-4
					animate-pulse"
				>
					<div className="grid grid-cols-3 gap-4">
						<div className="h-2 bg-slate-700/40 rounded"></div>
						<div className="h-2 bg-slate-700/40 rounded col-span-2"></div>
					</div>
					<div className="grid grid-cols-3 gap-4">
						<div className="h-2 bg-slate-700/40 rounded col-span-2"></div>
						<div className="h-2 bg-slate-700/40 rounded col-span-1"></div>
					</div>
					<div className="h-2 bg-slate-700/40 rounded"></div>
				</div>
			</Block>
		</div>
	);
};
export default Page;
