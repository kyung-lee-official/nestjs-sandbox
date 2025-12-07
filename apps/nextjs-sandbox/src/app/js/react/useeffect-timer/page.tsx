import Link from "next/link";
import { Content } from "./Content";

const Page = async () => {
	return (
		<div className="flex flex-col p-10 gap-4">
			<h1>useEffect Timer</h1>
			<Link
				href={"https://stackoverflow.com/a/57137212/3803682"}
				className="underline"
			>
				Implementing a countdown timer in React with Hooks
			</Link>
			<Content />
		</div>
	);
};

export default Page;
