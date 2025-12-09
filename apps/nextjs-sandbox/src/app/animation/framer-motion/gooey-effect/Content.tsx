"use client";

import { motion } from "motion/react";

const Content = () => {
	return (
		<div className="flex flex-col h-screen justify-center items-center gap-20">
			<a
				href="https://css-tricks.com/gooey-effect/"
				className="text-4xl underline"
			>
				The Gooey Effect
			</a>
			<div
				className="flex flex-col justify-center items-center
				text-xl gap-20"
			>
				<div className="flex flex-col justify-center items-center">
					<h1>Blur</h1>
					<div className="[filter:url(#blur)]">
						<div className="w-20 h-20 bg-blue-500"></div>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						className="h-0"
					>
						<defs>
							<filter id="blur">
								<feGaussianBlur
									in="SourceGraphic"
									stdDeviation="3"
								/>
							</filter>
						</defs>
					</svg>
				</div>

				<div className="flex flex-col justify-center items-center">
					<h1>Drop Shadow</h1>
					<div className="[filter:url(#drop-shadow)]">
						<div className="w-20 h-20 bg-blue-500"></div>
					</div>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						version="1.1"
						className="h-0"
					>
						<defs>
							<filter id="drop-shadow">
								<feGaussianBlur
									in="SourceGraphic"
									stdDeviation="7"
									result="shadow"
								/>
								<feOffset
									in="shadow"
									dx="3"
									dy="4"
									result="shadow"
								/>
								<feColorMatrix
									in="shadow"
									type="matrix"
									values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.6 0"
									result="shadow"
								/>
								<feBlend in="SourceGraphic" in2="shadow" />
							</filter>
						</defs>
					</svg>
				</div>

				<div className="flex flex-col justify-center items-center">
					<h1>Gooey</h1>
					<div>
						<div className="relative flex justify-center items-center w-full h-40 [filter:url(#goo)]">
							<div className="w-10 h-10 bg-blue-500 rounded-full"></div>
							<motion.div
								animate={{ x: [0, 240, 0] }}
								transition={{ repeat: Infinity, duration: 3 }}
								className="absolute w-16 h-16 bg-blue-500 rounded-full left-4"
							></motion.div>
						</div>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							version="1.1"
							className="h-0"
						>
							<defs>
								<filter id="goo">
									<feGaussianBlur
										in="SourceGraphic"
										stdDeviation="10"
										result="blur"
									/>
									<feColorMatrix
										in="blur"
										type="matrix"
										values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7"
										result="goo"
									/>
									<feBlend in="SourceGraphic" in2="goo" />
								</filter>
							</defs>
						</svg>
					</div>
				</div>
			</div>
			<div className="flex flex-col w-96">
				<a
					href="https://developer.mozilla.org/en-US/docs/Web/SVG/Element/feColorMatrix"
					className="flex justify-center items-center w-full bg-sky-300 text-xl underline"
				>
					&lt;feColorMatrix&gt;
				</a>
				<a
					href="https://codepen.io/nicolasjesenberger/pen/xxmbvxL"
					className="flex justify-center items-center w-full bg-sky-300 text-xl underline"
				>
					Gooey Toggle Switch
				</a>
			</div>
		</div>
	);
};

export default Content;
