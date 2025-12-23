import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

export const List = () => {
  const parentRef = useRef(null);

  /* the virtualizer */
  const rowVirtualizer = useVirtualizer({
    count: 10000,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 35,
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-y-auto bg-neutral-400">
      <div
        className="w-full relative"
        style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
      >
        {rowVirtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            className="absolute left-0 w-full border-b border-gray-200 bg-white"
            style={{
              top: 0,
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            Row {virtualItem.index}
          </div>
        ))}
      </div>
    </div>
  );
};
