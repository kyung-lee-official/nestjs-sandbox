"use client";

import { Suspense } from "react";
import { Pagination } from "./Pagination";
import { usePagination } from "./usePagination";

interface SuspensePaginationProps {
	hasNextPage?: boolean;
	hasPreviousPage?: boolean;
	totalItems?: number;
	itemsPerPage?: number;
}

const PaginationContent = ({
	hasNextPage,
	hasPreviousPage,
	totalItems,
	itemsPerPage,
}: SuspensePaginationProps) => {
	const { currentPage, updatePage } = usePagination();

	return (
		<Pagination
			currentPage={currentPage}
			onPageChange={updatePage}
			hasNextPage={hasNextPage}
			hasPreviousPage={hasPreviousPage}
			totalItems={totalItems}
			itemsPerPage={itemsPerPage}
		/>
	);
};

export const SuspensePagination = (props: SuspensePaginationProps) => {
	return (
		<Suspense fallback={<div className="h-8 bg-gray-200 animate-pulse rounded"></div>}>
			<PaginationContent {...props} />
		</Suspense>
	);
};
