import Content from "./Content";
import { Suspense } from "react";

const Page = async () => {
	return (
		<div className="flex flex-col p-10 gap-4">
			<h1>Pokemon List (Server side suspense)</h1>
			<p>
				Open the devtools network tab to see the requests, you will
				notice that no request is made on the client sidem, because the
				data is fetched on the server side. If you click the
				&quot;suspense&quot; doc, you will see the suspense loading.
			</p>
			<div
				className="w-96
				bg-neutral-100"
			>
				<Suspense fallback={<div>Loading...</div>}>
					<Content />
				</Suspense>
			</div>
		</div>
	);
};

export default Page;
