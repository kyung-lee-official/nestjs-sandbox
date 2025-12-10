"use client";

import { animated, useTransition } from "@react-spring/web";
import { useEffect, useState } from "react";

const Item = (props: any) => {
  const { id, setItems } = props;
  const pop = (prevItems: any) => {
    return prevItems.filter((item: any) => item.props.id !== id);
  };
  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(pop);
    }, 3000);
    return () => {
      clearTimeout(timer);
    };
  }, []);
  return (
    <div
      className="flex items-center px-2 py-1 gap-2
			border-[1px] border-neutral-400 
			rounded-md"
    >
      <div>Item, id: {id}</div>
      <button
        className="flex justify-center items-center
				text-neutral-400"
        onClick={() => setItems(pop)}
      >
        <svg
          viewBox="0 0 50 50"
          width={32}
          focusable="false"
          role="img"
          fill="currentColor"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m37.304 11.282 1.414 1.414-26.022 26.02-1.414-1.413z"></path>
          <path d="m12.696 11.282 26.022 26.02-1.414 1.415-26.022-26.02z"></path>
        </svg>
      </button>
    </div>
  );
};

/**
 * @deprecated
 */
const Transition4 = () => {
  const [items, setItems] = useState<any[]>([]);

  const transitions = useTransition(items, {
    keys: (item) => {
      return item.key;
    },
    from: { opacity: 0, x: 20 },
    enter: { opacity: 1, x: 0 },
    leave: { opacity: 0, x: 20 },
  });

  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
    >
      <a
        href="https://codesandbox.io/p/sandbox/notification-hub-v1i1t?file=%2Fsrc%2FApp.tsx"
        className="underline"
      >
        Notification
      </a>
      <button
        className="px-2 py-1
				text-white
				bg-blue-500
				rounded-md"
        onClick={() => {
          const id = Date.now();
          setItems([...items, <Item key={id} id={id} setItems={setItems} />]);
        }}
      >
        Push
      </button>
      {/* {transitions((style, item) => {
				return <animated.div style={style}>{item}</animated.div>;
			})} */}
    </div>
  );
};

export default Transition4;
