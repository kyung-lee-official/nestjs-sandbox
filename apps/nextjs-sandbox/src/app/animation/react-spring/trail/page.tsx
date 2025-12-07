import Trail1 from "./Trail1";
import Trail2 from "./Trail2";

const Page = () => {
	return (
		<div className="flex flex-col items-center min-h-svh p-4 gap-8">
			<Trail1 />
			<Trail2 />
		</div>
	);
};

export default Page;
