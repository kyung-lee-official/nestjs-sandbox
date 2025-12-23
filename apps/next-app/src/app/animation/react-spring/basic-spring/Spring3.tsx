"use client";

import { animated, useSprings } from "@react-spring/web";
import Link from "next/link";

/**
 * @deprecated
 */
const Spring3 = () => {
  const [springs, api] = useSprings(
    3,
    () => ({
      from: { opacity: 0 },
      to: { opacity: 1 },
    }),
    [],
  );
  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
    >
      <Link
        href={"https://www.react-spring.dev/docs/components/use-springs"}
        className={"underline"}
      >
        Basic useSprings
      </Link>
      {/* {springs.map((props, i) => {
				return (
					<animated.a
						key={i}
						href={
							"https://www.react-spring.dev/docs/components/use-springs"
						}
						className={"underline"}
						style={props}
					>
						text
					</animated.a>
				);
			})} */}
    </div>
  );
};

export default Spring3;
