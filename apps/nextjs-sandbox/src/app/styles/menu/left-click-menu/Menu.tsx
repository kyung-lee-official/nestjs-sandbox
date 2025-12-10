import { useCallback, useEffect, useRef, useState } from "react";

export const Menu = () => {
  const [show, setShow] = useState<boolean>(false);

  const entryRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: any) => {
    if (entryRef.current) {
      if (
        e.target === entryRef.current ||
        entryRef.current.contains(e.target)
      ) {
        /* entry clicked */
        setShow((state) => {
          return !state;
        });
      } else {
        if (menuRef.current) {
          /* menu clicked */
          if (
            e.target === menuRef.current ||
            menuRef.current.contains(e.target)
          ) {
            /* do nothing or hide menu, up to you */
            // setShow(false);
          } else {
            /* outside clicked */
            setShow(false);
          }
        }
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
    <div className="relative w-fit">
      <button
        ref={entryRef}
        className="p-2 bg-black/30 hover:bg-black/40
				rounded-md shadow-lg cursor-pointer"
      >
        Left click this Menu.
      </button>
      {/* note that menu is not a child of entry */}
      {show && (
        <div
          ref={menuRef}
          className="absolute top-12
					flex flex-col
					bg-gray-200/80 rounded-md shadow-lg"
        >
          <button
            className="p-2"
            onClick={() => {
              /* do nothing */
            }}
          >
            Keep
          </button>
          <button
            className="p-2"
            onClick={() => {
              setShow(false);
            }}
          >
            Hide
          </button>
        </div>
      )}
    </div>
  );
};
