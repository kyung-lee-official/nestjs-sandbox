"use client";

import { ZoomableImage } from "./ZoomableImage";

const Content = () => {
	return (
		<div className="flex flex-col w-full min-h-svh p-10 gap-20">
			<h1 className="text-4xl">Zoomable Image</h1>
			<ZoomableImage
				src={"/images/styles/image/2000x300.jpg"}
				alt="horizontal"
				width={300}
			/>
			<ZoomableImage
				src={"/images/styles/image/300x2000.jpg"}
				alt="vertical"
				width={100}
			/>
		</div>
	);
};

export default Content;
