import { animated, useTransition } from "@react-spring/web";
import { useState } from "react";

/**
 * @deprecated
 */
const T1 = () => {
	const [data, setData] = useState<"A" | "B" | "C">("A");

	const transition = useTransition(data, {
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		// onRest: (_a, _b, item) => {
		// 	if (index === item) {
		// 		setIndex((state: any) => (state + 1) % slides1.length);
		// 	}
		// },
		exitBeforeEnter: true,
		config: {
			duration: 300,
		},
	});

	return (
		<div className="flex flex-col items-center gap-2">
			With useState
			{/* {transition((style, i) => {
				return (
					<animated.div style={style} className="text-5xl">
						{i}
					</animated.div>
				);
			})} */}
			<div className="flex items-center gap-2">
				{["A", "B", "C"].map((item) => {
					return (
						<button
							key={item}
							className="px-2 py-1
							text-white
							bg-blue-500
							rounded-md"
							onClick={() => {
								setData(item as "A" | "B" | "C");
							}}
						>
							{item}
						</button>
					);
				})}
			</div>
		</div>
	);
};

export default T1;
