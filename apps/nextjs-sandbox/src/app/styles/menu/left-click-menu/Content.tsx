"use client";

import Link from "next/link";
import { Menu } from "./Menu";

const Content = () => {
	return (
		<div className="flex flex-col p-10 gap-3">
			<h2>
				This is similar to{" "}
				<Link
					href={"/styles/dropdown/header-dropdown"}
					className="underline"
				>
					/styles/dropdown/header-dropdown
				</Link>
			</h2>
			<div className="w-96">
				you should avoid passing a ref or a state to a child component
				to control its visibility. this could cause issues when you have
				multiple instances of the same component -- you neither want to
				share the same ref/states, nor create a ton of refs/states
				manually.
			</div>
			<div className="flex gap-3">
				{new Array(3).fill("_").map((m, i) => {
					return <Menu key={i} />;
				})}
			</div>
		</div>
	);
};

export default Content;
