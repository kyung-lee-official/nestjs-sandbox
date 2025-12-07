const Item = (props: any) => {
	const { children } = props;
	return (
		<div
			className="min-h-[150px]
			bg-neutral-300"
		>
			{children}
		</div>
	);
};

export const GridPattern1 = () => {
	return (
		<div
			className="grid justify-items-stretch
			grid-cols-1
			sm:grid-cols-2
			md:grid-cols-3
			lg:grid-cols-4
			xl:grid-cols-5
			w-full gap-10"
		>
			<Item>Lorem</Item>
			<Item>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum qui
				explicabo nam exercitationem inventore vero obcaecati,
				perferendis eligendi aspernatur fuga iusto incidunt nihil
				eveniet voluptas? Maiores, nam. Dolorem, sapiente! Cumque.
			</Item>
			<Item>Lorem</Item>
			<Item>Lorem</Item>
			<Item>Lorem</Item>
		</div>
	);
};
