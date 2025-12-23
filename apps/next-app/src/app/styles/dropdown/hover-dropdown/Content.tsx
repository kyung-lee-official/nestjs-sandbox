"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const Content = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleMouseMove = useCallback((e: any) => {
    if (btnRef.current) {
      if (e.target === btnRef.current || btnRef.current.contains(e.target)) {
        setShowDropdown(true);
      } else {
        setShowDropdown(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div>
      <div
        className="flex justify-center p-4
				text-white bg-black"
      >
        <div>
          We use &quot;mousemove&quot; listener and &quot;contains&quot; to
          check if the mouse is inside the hover area.
          <br />
          To keep the dropdown open when the mouse is moving from the header to
          the dropdown,
          <br /> we use two nested divs in the dropdown area, the outer div
          <br /> should NOT have a gap with the header(or can even collides with
          the header),
          <br />
          but it can have a <b>padding top</b> so the inner div
          <br /> can be visually separated from the header.
          <br />
          <br />
          The outer div is highlighted with a transparent red so you can see the
          area.
        </div>
      </div>
      <div
        className="relative w-full h-20
				bg-neutral-100
				border-b border-neutral-200"
      >
        <div className="flex justify-center items-center h-full px-10 gap-8">
          <div
            ref={btnRef}
            className="flex justify-center items-center h-full
						cursor-pointer"
          >
            <div>Item 1</div>
            {showDropdown && (
              <div
                className="absolute top-[79px] left-20 right-20 pt-4
								bg-red-400/20"
              >
                <div
                  className="flex justify-center items-center h-60 gap-10
									text-5xl
									bg-neutral-100
									rounded-lg shadow-md"
                >
                  <div>Sub-item 1</div>
                  <div>Sub-item 2</div>
                </div>
              </div>
            )}
          </div>
          <div className="text-neutral-400">item2</div>
        </div>
      </div>
    </div>
  );
};

export default Content;
