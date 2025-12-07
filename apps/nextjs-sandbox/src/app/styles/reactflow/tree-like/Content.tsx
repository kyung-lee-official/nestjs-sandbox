"use client";

import dynamic from "next/dynamic";

const DynamicTreeData = dynamic(() => import("./TreeData"), { ssr: false });

export const Content = () => {
	return <DynamicTreeData />;
};
