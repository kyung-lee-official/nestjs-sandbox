import Content from "./Content";
import { SharpImage } from "./Sharp/SharpImage";

const Page = async () => {
  const url =
    "https://fastly.picsum.photos/id/671/1080/1080.jpg?hmac=UlKfg33r4oKddxrYFJ9qD8KPTrgBjv0jvsSEHmgqVEA";

  return (
    <div className="p-5">
      <h1 className="mb-4 font-bold text-3xl">Sharp Image Processing Demo</h1>
      <section className="mb-10">
        <div className="flex flex-col items-start gap-5">
          <div>
            <h2 className="mb-2 font-semibold text-xl">Original HTML Image</h2>
            {/** biome-ignore lint/performance/noImgElement: <explanation> */}
            <img
              src={url}
              alt="original html img tag"
              className="border border-gray-300"
            />
          </div>
          <div className="w-50">
            <h2 className="mb-2 text-xl">Server Side (Page)</h2>
            <SharpImage
              src={url}
              alt="sharp processed image"
              width={300}
              quality={40}
            />
          </div>
          <Content url={url} />
        </div>
      </section>
    </div>
  );
};

export default Page;
