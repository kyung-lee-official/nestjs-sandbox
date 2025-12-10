"use client";

import { useEffect, useState } from "react";
import { getDashboardSocket } from "../socket";

type MockData = {
  id: number;
  value: number;
};

const Content = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [mockData, setMockData] = useState<MockData[]>([]);

  useEffect(() => {
    const socket = getDashboardSocket();

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("mock-data-update", (newData: MockData[]) => {
      setMockData(newData);
    });

    /* cleanup on component unmount */
    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("mock-data-update");
    };
  }, []);

  return (
    <div
      className="flex flex-col justify-start items-start p-10 h-svh gap-8
			bg-gray-200"
    >
      <div className="flex items-center gap-3">
        <div>status:</div>
        <div
          className={`w-3 h-3 
					${isConnected ? "bg-green-500" : "bg-gray-500"}
					${isConnected ? "shadow-[0_0_10px_#00ff00]" : ""}
					rounded-full duration-700`}
        ></div>
      </div>
      <div className="flex flex-col gap-3 w-full h-full overflow-auto">
        {mockData.map((d, i) => {
          return (
            <div key={d.id} className="flex gap-2">
              <div>{d.id}: </div>
              <div>{d.value}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Content;
