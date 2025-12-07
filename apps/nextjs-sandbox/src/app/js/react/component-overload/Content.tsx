"use client";

type TextProps = {
	text: string;
};
type ObjectProps<T> = {
	title: string;
	a: T[];
};

type U<T> = TextProps | ObjectProps<T>;

const Comp = <T,>(props: U<T>) => {
	if ("text" in props) {
		/* props: TextProps */
		const { text } = props;
		return <div className="w-fit p-1 border">{text}</div>;
	} else {
		/* props: ObjectProps<T> */
		const { title, a } = props;
		return (
			<div className="w-fit p-1 border">
				<div>{title}</div>
				{/* a: T[] */}
				{a.map((v, i) => {
					if (typeof v === "string") {
						/* v: T & string */
						return <div key={i}>{v}</div>;
					} else {
						/* v: T */
						return null;
					}
				})}
			</div>
		);
	}
};

export const Content = () => {
	return (
		<div className="p-2">
			<p>
				While React functional components don&apos;t support traditional
				function overloading like in other languages, you can achieve
				similar behavior using TypeScript and conditional props.
			</p>
			<p>Check out code for details</p>
			<Comp text={"pass in 'text'"} />
			<Comp title={"pass in 'text' and 'a'"} a={[1, 2, 3]} />
		</div>
	);
};
