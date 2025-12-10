import { animated, useTransition } from "@react-spring/web";
import { useRef } from "react";

/**
 * @deprecated
 */
const T2 = () => {
  /**
   * Ref will not work!
   */
  const dataRef = useRef<"A" | "B" | "C">("A");
  const transition = useTransition(dataRef.current, {
    from: { opacity: 0 },
    enter: { opacity: 1 },
    leave: { opacity: 0 },
    exitBeforeEnter: true,
    config: {
      duration: 300,
    },
  });

  return (
    <div className="flex flex-col items-center gap-2">
      <h1>Ref will not work</h1>
      {/* {transition((style, i) => {
				return (
					<animated.div style={style} className="text-5xl">
						{i}
					</animated.div>
				);
			})} */}
      <div className="flex items-center gap-2">
        {["A", "B", "C"].map((item: any) => {
          return (
            <button
              key={item}
              className="px-2 py-1
							text-white
							bg-blue-500
							rounded-md"
              onClick={() => {
                dataRef.current = item;
                console.log(dataRef.current);
              }}
            >
              {item}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default T2;
