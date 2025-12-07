import { useSearchParams, useRouter, usePathname } from "next/navigation";

export const usePagination = () => {
	const searchParams = useSearchParams();
	const router = useRouter();
	const pathname = usePathname();

	/* Get current page from URL, default to 1 */
	const currentPage = parseInt(searchParams.get("page") || "1", 10);

	/* Update URL with new page */
	const updatePage = (page: number) => {
		const params = new URLSearchParams(searchParams.toString());
		params.set("page", page.toString());
		router.push(`${pathname}?${params.toString()}`);
	};

	/* Get other query parameters (excluding page) */
	const getOtherParams = () => {
		const params = new URLSearchParams(searchParams.toString());
		params.delete("page");
		return params;
	};

	/* Update URL with new page while preserving other params */
	const setPage = (page: number) => {
		const otherParams = getOtherParams();
		otherParams.set("page", page.toString());
		router.push(`${pathname}?${otherParams.toString()}`);
	};

	return {
		currentPage,
		updatePage,
		setPage,
		searchParams,
		router,
		pathname,
	};
};
