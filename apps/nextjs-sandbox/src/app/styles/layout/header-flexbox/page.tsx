import { Example1 } from "./example1/Example1";
import { Example2 } from "./example2/Example2";

const Page = () => {
	return (
		<div className="flex flex-col gap-10">
			<Example1 />
			<Example2 />
		</div>
	);
};

export default Page;
