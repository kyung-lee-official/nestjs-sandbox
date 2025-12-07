const Page = () => {
	return (
		<div className="w-full min-h-screen p-4">
			<h1 className="text-2xl">Flexbox Overflow</h1>
			<h2 className="mb-4">squeeze screen x to see overflow</h2>
			<h2>Children of flexbox are set to `min-w-0`</h2>
			<div
				className="flex justify-between w-full h-16 gap-2
				text-neutral-300
				bg-neutral-800"
			>
				<div
					className="min-w-0
					bg-red-600/40"
				>
					Loremipsumdolorsitametconsectetur
				</div>
				<div
					className="min-w-0
					bg-red-600/40"
				>
					Loremipsumdolorsitametconsectetur
				</div>
			</div>
			<h2>Children of flexbox are set to `min-w-0` with overflow-x-auto</h2>
			<div
				className="flex justify-between w-full h-16 gap-2
				text-neutral-300
				bg-neutral-800
				overflow-x-auto"
			>
				<div
					className="min-w-0
					bg-green-600/40"
				>
					Loremipsumdolorsitametconsectetur
				</div>
				<div
					className="min-w-0
					bg-green-600/40"
				>
					Loremipsumdolorsitametconsectetur
				</div>
			</div>
			<h2>Children of flexbox use default width (`min-w-[auto]`)</h2>
			<div
				className="flex justify-between w-full h-16 gap-2
				text-neutral-300
				bg-neutral-800"
			>
				<div className="bg-cyan-600/40">
					Loremipsumdolorsitametconsectetur
				</div>
				<div className="bg-cyan-600/40">
					Loremipsumdolorsitametconsectetur
				</div>
			</div>
		</div>
	);
};

export default Page;
