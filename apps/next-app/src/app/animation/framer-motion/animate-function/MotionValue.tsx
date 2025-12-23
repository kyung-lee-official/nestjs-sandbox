"use client";

import { animate, motion, motionValue, useTransform } from "motion/react";
import { useEffect } from "react";

const MotionValue = () => {
  const x = motionValue(0);
  const mappedX = useTransform(
    x,
    /* Map x from these values: */
    [0, 100],
    /* Into these values: */
    ["0%", "100%"],
  );
  useEffect(() => {
    animate(x, 100, { duration: 4 });
  }, []);

  return (
    <div className="flex flex-col gap-2">
      <a
        href="https://www.framer.com/motion/animate-function/##animate-a-motionvalue"
        className="underline"
      >
        https://www.framer.com/motion/animate-function/##animate-a-motionvalue
      </a>
      <p>
        Motion Value is also imperative, not a state, so it cannot be used
        directly in components. It can only be used in the motion
        components&apos; properties.
      </p>
      <ul className="pl-8">
        <li className="list-disc">useTransform</li>
      </ul>
      <motion.div
        className="h-4 
				bg-lime-500
				origin-left"
        style={{
          width: x,
        }}
      ></motion.div>
      <motion.div
        className="h-4 
				bg-lime-500
				origin-left"
        style={{
          width: mappedX,
        }}
      ></motion.div>
    </div>
  );
};

export default MotionValue;
