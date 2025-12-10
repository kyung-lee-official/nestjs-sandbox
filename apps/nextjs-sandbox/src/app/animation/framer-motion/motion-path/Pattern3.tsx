"use client";

import { animate, motion, motionValue, useMotionValue } from "motion/react";
import { useCallback, useEffect, useRef } from "react";

const Pattern3 = () => {
  let pathLength = 1;
  const motionStrokeDashOffset = useMotionValue(0);
  const motionPointX = useMotionValue(0);
  const motionPointY = useMotionValue(0);
  const motionPointXtoCenterOffset = 20;
  const motionPointYtoCenterOffset = 15;
  const motionAngle = useMotionValue(0);

  const segmentLength = 50;
  const pathRef = useRef<SVGPathElement>(null);

  function r2d(number: number) {
    return number * (180 / Math.PI);
  }

  /**
   * Get the angle in radians at a certain length along the path.
   */
  const getAngleAtLength = useCallback(
    (path: SVGPathElement, length: number, sampleSegmentLength: number) => {
      const p1 = path.getPointAtLength(length);
      const p2 = path.getPointAtLength(
        (length + sampleSegmentLength) % pathLength, // pathLength cannot be 0
      );
      return Math.atan2(p2.y - p1.y, p2.x - p1.x);
    },
    [pathRef],
  );

  useEffect(() => {
    const path = pathRef.current;
    if (!path) return;
    pathLength = path.getTotalLength();
    path.style.strokeDasharray = `${segmentLength} ${
      pathLength - segmentLength
    }`;
    if (pathLength) {
      motionStrokeDashOffset.set(pathLength);
      animate(motionStrokeDashOffset, 0, {
        duration: 2.5,
        ease: "linear",
        repeat: Infinity,
        onUpdate(latest) {
          const iconLength = (pathLength - latest + segmentLength) % pathLength;
          motionPointX.set(
            path.getPointAtLength(iconLength).x - motionPointXtoCenterOffset,
          );
          motionPointY.set(
            path.getPointAtLength(iconLength).y - motionPointYtoCenterOffset,
          );
          motionAngle.set(r2d(getAngleAtLength(path, iconLength, 1)));
        },
      });
    }
  }, [pathRef]);

  return (
    <div>
      <motion.svg width={400} viewBox="0 0 256 112">
        <motion.path
          ref={pathRef}
          strokeDasharray={`${segmentLength} ${pathLength - segmentLength}`}
          style={{
            strokeDashoffset: motionStrokeDashOffset,
          }}
          className="stroke-red-400"
          strokeWidth={1}
          fill="none"
          d="M8,56 C8,33.90861 25.90861,16 48,16 C70.09139,16 88,33.90861 88,56 C88,78.09139 105.90861,92 128,92 C150.09139,92 160,72 160,56 C160,40 148,24 128,24 C108,24 96,40 96,56 C96,72 105.90861,92 128,92 C154,93 168,78 168,56 C168,33.90861 185.90861,16 208,16 C230.09139,16 248,33.90861 248,56 C248,78.09139 230.09139,96 208,96 L48,96 C25.90861,96 8,78.09139 8,56 Z"
        ></motion.path>
        <motion.path
          className={"fill-red-500/40"}
          style={{
            x: motionPointX,
            y: motionPointY,
            rotate: motionAngle,
          }}
          d="M39 15L0.999999 29L9 15L1 0.999998L39 15Z"
          stroke="black"
          strokeWidth={1}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    </div>
  );
};

export default Pattern3;
