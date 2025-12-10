"use client";

import Lottie from "lottie-react";

// import data from "../../../../../public/lottie/basic/data.json";

const BasicPage = () => {
  return (
    <div className="w-full bg-slate-800">
      this will report an error during building, Read more:
      https://nextjs.org/docs/messages/prerender-error ReferenceError: document
      is not defined
      {/* <Lottie animationData={data} loop={true} autoplay /> */}
    </div>
  );
};

export default BasicPage;
