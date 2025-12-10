"use client";

import { useEffect, useRef, useState } from "react";

const Content = () => {
  const [show, setShow] = useState<boolean>(false);
  const [pos, setPos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setShow(false);
      }
    };
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="p-10">
      <div
        className="relative w-fit"
        onContextMenu={(e) => {
          e.preventDefault();
          setShow(true);
          setPos({ x: e.clientX, y: e.clientY });
        }}
      >
        {show && (
          <div
            ref={ref}
            className="fixed bg-gray-200/80 rounded-md shadow-lg"
            style={{
              top: pos.y,
              left: pos.x,
            }}
          >
            <div className="p-2">Copy</div>
            <div className="p-2">Paste</div>
            <div className="p-2">Cut</div>
          </div>
        )}
        <div
          className="p-2 bg-black/30 hover:bg-black/40
				rounded-md shadow-lg cursor-pointer"
        >
          Right click this Context Menu.
        </div>
        <div>
          x:{pos.x}, y:{pos.y}
        </div>
        <h2 className="text-gray-500">
          Right click will trigger the `onContextMenu` listener.
        </h2>
      </div>
    </div>
  );
};

export default Content;
