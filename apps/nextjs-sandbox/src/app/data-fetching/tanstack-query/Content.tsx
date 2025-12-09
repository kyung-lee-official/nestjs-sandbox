"use client";

import BlockA from "./BlockA";
import BlockB from "./BlockB";

const Content = () => {
	return (
		<div
			className="flex flex-col w-full min-h-svh p-20 gap-4
			bg-neutral-100"
		>
			<div className="max-w-[510px]">
				* TanStack Query allows you to use multiple
				`QueryClientProvider`s across multiple components as long as the
				same `queryClient` is used, this way, providers share the same
				cache.
			</div>
			<div className="max-w-[510px]">
				* In the following two blocks, we use the `useQuery` hook with
				the same query key, TanStack Query thereby treat them as the
				same query and only fetch the data once (check the network tab
				in the devtools) regardless of we passed different parameter to
				the API function `fetchTodo`. However, if you change the
				query key, TanStack Query will treat it as a different query and
				fetch the data separately.
			</div>
			<div className="flex gap-6">
				<BlockA />
				<BlockB />
			</div>
		</div>
	);
};

export default Content;
