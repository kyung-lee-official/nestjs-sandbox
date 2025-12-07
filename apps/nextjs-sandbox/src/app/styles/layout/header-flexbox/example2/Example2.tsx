import { Item, Placeholder } from "./Item";

export function Example2() {
	return (
		<div className="w-full">
			<h1 className="text-2xl">Placeholder as dynamic gaps</h1>
			<h2 className="text-xl">Squeeze screen x to see overflow</h2>
			<div>
				<div
					className="flex justify-between items-center
					bg-neutral-800"
				>
					<div
						className="flex-[0_1_600px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
					<div
						className="flex-[0_1_500px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div>flex-[0_1_600px]</div>
					<div>flex-[0_1_500px]</div>
				</div>
			</div>
			<div>
				<div
					className="flex justify-between items-center
					bg-neutral-800"
				>
					<div
						className="flex-[0_1_500px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
					<div
						className="flex-[0_1_500px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div>flex-[0_1_500px]</div>
					<div>flex-[0_1_500px]</div>
				</div>
			</div>
			<div>
				<div
					className="flex justify-between items-center
					bg-neutral-800"
				>
					<div
						className="flex-[0_1_500px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
					<div
						className="flex-[0_1_600px] flex h-16
						text-neutral-300
						bg-green-400/20"
					>
						<Item>a</Item>
						<Placeholder />
						<Item>aaaaa</Item>
						<Placeholder />
						<Item>aaaaaaaaa</Item>
					</div>
				</div>
				<div className="flex justify-evenly">
					<div>flex-[0_1_500px]</div>
					<div>flex-[0_1_600px]</div>
				</div>
			</div>
		</div>
	);
}
