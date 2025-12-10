"use client";

import { useEffect, useState } from "react";

export const Content = () => {
  /* initialize timeLeft with the seconds prop */
  const [timeLeft, setTimeLeft] = useState(5);

  useEffect(() => {
    /* exit early when we reach 0 */
    if (timeLeft <= 0) {
      return;
    }

    /* save intervalId to clear the interval when the */
    /* component re-renders */
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 0.01);
    }, 10);

    /* clear interval on re-render to avoid memory leaks */
    return () => clearInterval(intervalId);
    /**
     * add timeLeft as a dependency to re-rerun the effect
     * when we update it
     */
  }, [timeLeft]);

  return (
    <div className="flex items-center gap-2">
      <h1 className="w-16">
        {timeLeft < 0.0 ? (0).toFixed(2) : timeLeft.toFixed(2)}
      </h1>
      <button
        className="p-2
				bg-neutral-200
				rounded"
        onClick={() => setTimeLeft(5)}
      >
        Reset
      </button>
    </div>
  );
};
