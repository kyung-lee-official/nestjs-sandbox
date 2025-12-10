"use client";

import { useEffect, useRef, useState } from "react";

const EventListenerPage = () => {
  const [state, setState] = useState<number>(0);
  const _setState = (data: any) => {
    stateRef.current = data;
    setState(data);
  };

  const stateRef = useRef(state);

  const handleClick = (e: any) => {
    console.log("state", state);
    console.log("stateRef", stateRef.current);
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full p-4 gap-2">
      <h1>Press F12 to watch console</h1>
      <h2 className="text-gray-400">
        Note that we defined `_setState` function here
      </h2>
      <a
        href="https://medium.com/geographit/accessing-react-state-in-event-listeners-with-usestate-and-useref-hooks-8cceee73c559"
        className="text-sm text-blue-300"
      >
        Accessing React State in Event Listeners with useState and useRef hooks
      </a>
      <div>{state}</div>
      <button
        className="w-10 px-2 py-1
				text-white
				bg-blue-500 rounded"
        onClick={() => {
          _setState(state + 1);
        }}
      >
        + 1
      </button>
    </div>
  );
};

export default EventListenerPage;
