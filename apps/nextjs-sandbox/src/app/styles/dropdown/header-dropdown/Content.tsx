"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const Dropdown = () => {
  const btnRef = useRef<HTMLDivElement>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleClick = useCallback((e: any) => {
    if (btnRef.current) {
      if (e.target === btnRef.current || btnRef.current.contains(e.target)) {
        setShowDropdown((showDropdown) => {
          return !showDropdown;
        });
      } else {
        setShowDropdown(false);
      }
    }
  }, []);

  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <div
        className="flex justify-center w-full
				text-white bg-black"
      >
        advertisment placeholder
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
            <div
              className={`${showDropdown && "rotate-[-180deg]"} duration-200`}
            >
              ⬇️
            </div>
            {showDropdown && (
              <div
                className="absolute top-20 left-0 right-0 h-80
								flex justify-center items-center gap-10
								text-xl
								bg-neutral-50
								shadow"
              >
                <div>Sub-item 1</div>
                <div>Sub-item 2</div>
              </div>
            )}
          </div>
          <div className="text-neutral-400">item2</div>
        </div>
      </div>
    </div>
  );
};

const Content = () => {
  return (
    <div className="flex flex-col w-full p-10 gap-6">
      <h1
        className="flex flex-col items-center gap-2
				text-xl"
      >
        Header Dropdown
      </h1>
      <Dropdown />
    </div>
  );
};

export default Content;
