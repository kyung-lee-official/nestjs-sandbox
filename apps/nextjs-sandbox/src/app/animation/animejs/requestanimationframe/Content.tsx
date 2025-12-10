"use client";

import { useState } from "react";

const Content = () => {
  const [timeStamp, setTimeStamp] = useState<number>(0);
  function callback(timestamp: number) {
    setTimeStamp(timestamp);
    requestAnimationFrame(callback);
  }

  function show() {
    requestAnimationFrame(callback);
  }

  return (
    <>
      <div>Time Stamp: {timeStamp}</div>
      <button onClick={show}>Show</button>
    </>
  );
};

export default Content;
