"use client";

import Tooltip from "./tooltip/Tooltip";

export const Content = () => {
	return (
		<div className="flex flex-col m-8 gap-3">
			<Tooltip text="This is a tooltip!">
				<button className="bg-neutral-600 text-neutral-200 p-2 rounded-md">
					Hover me
				</button>
			</Tooltip>
				<Tooltip text="This is a tooltip with very long text: Lorem ipsum, dolor sit amet consectetur adipisicing elit. Quod incidunt non magni enim cumque magnam ab, error veritatis natus fuga voluptas consequatur dolorem assumenda eligendi provident, delectus molestias animi optio!">
				<button className="bg-neutral-600 text-neutral-200 p-2 rounded-md">
					Hover me
				</button>
			</Tooltip>
		</div>
	);
};
