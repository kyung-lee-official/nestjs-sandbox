import { useEffect, useRef } from "react";

export const Test1 = () => {
  const entryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (entryRef.current) {
        if (
          e.target === entryRef.current ||
          entryRef.current.contains(e.target)
        ) {
          /* entry clicked */
          console.log("test 1 entry clicked");
          // setShow((state) => {
          // 	return !state;
          // });
        } else {
          /* outside clicked */
          // setShow(false);
          // console.log("outside clicked");
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div>
      <button
        ref={entryRef}
        className="px-2 py-1
				text-white/70
				bg-neutral-700
				rounded"
        onClick={(e) => {
          console.log("test 1 onClick fired");
        }}
      >
        Test1
      </button>
    </div>
  );
};

export const Test2 = () => {
  const entryRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = (e: any) => {
      if (entryRef.current) {
        if (
          e.target === entryRef.current ||
          entryRef.current.contains(e.target)
        ) {
          /* entry clicked */
          console.log("test 2 entry clicked");
          // setShow((state) => {
          // 	return !state;
          // });
        } else {
          /* outside clicked */
          // setShow(false);
          // console.log("outside clicked");
        }
      }
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, []);

  return (
    <div>
      <button
        ref={entryRef}
        className="px-2 py-1
				text-white/70
				bg-neutral-700
				rounded"
        onClick={(e) => {
          console.log("test 2 onClick fired");
        }}
      >
        Test2
      </button>
    </div>
  );
};
