"use client";

const Reticle = () => {
  return (
    <svg
      viewBox="0 0 40 40"
      width={40}
      height={40}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M797,381v23H774V381h23m1-1H773v25h25V380Z"
        transform="translate(-765 -373)"
        fill="currentColor"
      />
      <line x1="20.5" x2="20.5" y2="40" stroke="currentColor" />
      <line x1="40" y1="19.5" y2="19.5" stroke="currentColor" />
    </svg>
  );
};

const Content = () => {
  return (
    <div className="flex flex-col justify-center items-center w-full min-h-screen p-10 gap-10">
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-lg">
          Container <pre>style: width: max-content</pre>
        </h1>
        <div
          className="w-[600px] h-[400px] bg-slate-500/60
					overflow-auto"
        >
          <div className="w-max">
            {/* img width is limited by parent div width */}
            <img src="/images/vite/vite.svg" alt="" width={900} />
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <h1 className="text-lg">
          Scale image <pre>style: scale: &quot;5&quot;</pre>
        </h1>
        <h2 className="text-sm w-[600px]">
          Note:
          <ul className="list-outside list-disc translate-x-4">
            <li>The scale value must be string, can not be a number.</li>
            <li>
              Image size is not limited by parent div width when using `scale`,
              but will be limited by parent div when using `width`.
            </li>
            <li>
              The default scale origin is image center.
              <br />
              <strong>
                If the image is translated to a new position, the scale origin
                will still stay at the original position, which means if you
                scale the image, the translation will be scaled as well.
              </strong>
              <br />
              This rule also stays true for backward derivation.
              <br />
              <strong>
                If the image is scaled to a new size, the translate origin will
                still stay at the original, and if you translate the image, the
                translation will be scaled as well.
              </strong>
              <br />
              In this case, the reticles in the first line are not scaled, and
              were translated to the right at 100px and 200px. The width of a
              reticle is 40px.
              <br />
              The reticles in the second line are scaled to 1.5 times, and were
              coded to translated to the right at 100px and 200px. However, the
              translation is scaled as well, so the actual translation is 150px
              and 300px.
            </li>
          </ul>
        </h2>
        <div className="relative w-[600px] h-[200px] p-4 bg-slate-400/60">
          <div className="absolute">
            <Reticle />
          </div>
          <div className="absolute translate-x-[100px]">
            <Reticle />
          </div>
          <div className="absolute translate-x-[200px]">
            <Reticle />
          </div>
          <div className="absolute top-20" style={{ scale: "1.5" }}>
            <Reticle />
          </div>
          <div
            className="absolute top-20 translate-x-[100px]"
            style={{ scale: "1.5" }}
          >
            <Reticle />
          </div>
          <div
            className="absolute top-20 translate-x-[200px]"
            style={{ scale: "1.5" }}
          >
            <Reticle />
          </div>
        </div>
        <h2 className="text-sm w-[600px]">
          Here is another example: <br />
          The transform origin of the red reticle is is set to left and it is
          scaled to 2 times. <br />
          The transform origin of the blue reticle is is set to left, it is
          scaled to 2 times also, and translated by 50px in both x and y axis,
          but if you measure the distance between the original reticle and the
          blue reticle, you will find that the distance is 100px in both x and y
          axis, which means the <strong>translation is scaled as well</strong>.
        </h2>
        <div className="relative w-[600px] h-[200px] p-4 bg-slate-400/60">
          <div className="absolute">
            <Reticle />
          </div>
          <div
            className="absolute origin-left text-red-400"
            style={{ scale: "2" }}
          >
            <Reticle />
          </div>
          <div
            className="absolute origin-left translate-x-[50px] translate-y-[50px] text-blue-400"
            style={{ scale: "2" }}
          >
            <Reticle />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Content;
