"use client";

interface PaginationProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  totalItems?: number;
  itemsPerPage?: number;
}

export const Pagination = ({
  currentPage,
  onPageChange,
  hasNextPage = true,
  hasPreviousPage,
  totalItems,
  itemsPerPage,
}: PaginationProps) => {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (hasNextPage) {
      onPageChange(currentPage + 1);
    }
  };

  const isPreviousDisabled =
    hasPreviousPage !== undefined ? !hasPreviousPage : currentPage <= 1;
  const isNextDisabled = !hasNextPage;

  return (
    <div className="flex justify-end">
      <div className="flex items-center gap-2">
        <span className="text-sm text-gray-600">Page:</span>

        <button
          onClick={handlePrevious}
          disabled={isPreviousDisabled}
          className={`px-3 py-1 rounded transition-colors ${
            isPreviousDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Previous
        </button>

        <span className="px-3 py-1 bg-gray-100 rounded font-medium">
          {currentPage}
        </span>

        <button
          onClick={handleNext}
          disabled={isNextDisabled}
          className={`px-3 py-1 rounded transition-colors ${
            isNextDisabled
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          Next
        </button>

        {totalItems !== undefined && itemsPerPage !== undefined && (
          <span className="text-sm text-gray-500 ml-2">
            Showing {Math.min(itemsPerPage * (currentPage - 1) + 1, totalItems)}
            -{Math.min(itemsPerPage * currentPage, totalItems)} of {totalItems}
          </span>
        )}
      </div>
    </div>
  );
};
