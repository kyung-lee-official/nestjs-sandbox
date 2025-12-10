"use client";

import dynamic from "next/dynamic";

const DynamicImage = dynamic(() => import("./DynamicImage"), { ssr: false });

const Content = () => {
  return (
    <div className="flex flex-col w-96 m-8 gap-8">
      <h1 className="text-xl">Image onLoad, check out the console</h1>
      <span>
        In NextJS, to enforce `onLoad` to be fired, we need to set `ssr: false`
        in the dynamic import, otherwise the `onLoad` event will not be fired.
        This is because NextJS will prerender the image on the server side.
      </span>
      <DynamicImage
        src={`/images/styles/image/horizontal.jpg`}
        onLoad={() => {
          console.log("onLoad static image from public folder");
        }}
      />
      <DynamicImage
        src="https://fastly.picsum.photos/id/933/200/200.jpg?hmac=OW5v0bUFqC97kOeYWLjXhU-5mkb6atERs7CrqdPlRfs"
        onLoad={() => {
          console.log("onLoad an image from picsum");
        }}
      />
    </div>
  );
};

export default Content;
