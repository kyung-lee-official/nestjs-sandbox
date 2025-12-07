"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { ModalDialog } from "./ModalDialog";

const Content = () => {
	const [show, setShow] = useState(false);

	return (
		<div className="flex flex-col justify-center items-center gap-6 p-10">
			<button
				className="bg-black/10 hover:bg-black/20 px-2 py-1 rounded-md"
				onClick={() => setShow(!show)}
			>
				Open Modal
			</button>
			{show &&
				createPortal(<ModalDialog setShow={setShow} />, document.body)}
			{[...Array(15)].map((_, i) => {
				return (
					<div key={i}>
						Lorem ipsum, dolor sit amet consectetur adipisicing
						elit. Consequatur perferendis libero quidem ducimus
						placeat corrupti, sed saepe repudiandae accusamus, ipsa
						beatae sequi? Eos, dignissimos aliquid incidunt officiis
						obcaecati quisquam explicabo.
					</div>
				);
			})}
		</div>
	);
};

export default Content;
