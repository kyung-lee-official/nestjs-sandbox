const Row = () => {
  return (
    <div
      className="w-full min-h-24 p-1
			text-sm
			bg-white
			border"
    >
      To avoid the height of the row from affecting the height of the container,
      set the height of the row to `min-h-24`
    </div>
  );
};

const CalcFlex = () => {
  return (
    <div>
      <h2>
        <del>use CSS calc()</del> (NOT recommended)
      </h2>
      <div
        className="flex flex-col w-72 p-2
				bg-black/10
				opacity-50"
      >
        <div>This is a header</div>
        <div
          className="flex flex-col h-[calc(100svh-32px-24px-8px-24px-16px)] gap-1
					overflow-y-auto"
        >
          {new Array(12).fill(0).map((_, i) => (
            <Row key={i} />
          ))}
        </div>
      </div>
    </div>
  );
};

const AbsoluteFlex = () => {
  return (
    <div>
      <h2>use absolute positioning (recommended)</h2>
      <div
        className="absolute top-14 bottom-2 left-80 w-72 p-2
				bg-black/10"
      >
        <div className="relative h-full">
          <div
            className="absolute top-0 w-full
						bg-cyan-400"
          >
            This is a header
          </div>
          <div className="absolute top-6 bottom-6">
            <div
              className="flex flex-col h-[100%] gap-1
							overflow-y-auto"
            >
              {new Array(12).fill(0).map((_, i) => (
                <Row key={i} />
              ))}
            </div>
          </div>
          <div
            className="absolute bottom-0 w-full
						bg-cyan-400"
          >
            This is a footer
          </div>
        </div>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <div className="w-full px-4">
      <h1 className="text-2xl">Flexbox Overflow Y</h1>
      <div className="flex gap-10">
        <CalcFlex />
        <AbsoluteFlex />
      </div>
    </div>
  );
};

export default Page;
