import { useEffect } from "react";

const Child = () => {
	useEffect(() => {
		console.log("Second useEffect");
	}, []);
	return (
		<div
			className="flex flex-col items-center w-fit p-4
			text-green-700
			bg-green-200"
		>
			Child
		</div>
	);
};

export default Child;
