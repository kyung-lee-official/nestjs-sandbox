const Page = () => {
  return (
    <div>
      <h1
        className="m-auto p-4
				text-lg"
      >
        Single line Ellipsis
      </h1>
      <div className="flex flex-col p-10 gap-6">
        `w-full` is required for responsive design. <br />
        `max-w-[400px]` is required for the ellipsis to work, in case
        `max-w-[fixed-value]` is not proper for your scenario, you can use
        `calc`, for example, `max-w-[calc(100%-2rem)]`.
        <br />
        `truncate` cannot work with flex directly.
        <div
          className="w-full max-w-[400px] h-28 m-auto
					bg-gray-200 p-4
					rounded-md shadow-md
					truncate"
        >
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque
          dicta, rem obcaecati eligendi quod ipsam illo, ab incidunt quam,
          blanditiis iure dolor eveniet atque ut.
        </div>
        <hr />
        <a
          className="m-auto"
          href="https://stackoverflow.com/a/41137262/3803682"
        >
          <u>Multiline Ellipsis (webkit only)</u>
        </a>
        <h2 className="m-auto">
          Note: DO NOT use padding for the text container, you can add a pading
          on the container&apos;s parent
        </h2>
        <div className="max-w-[600px] p-6 m-auto bg-slate-200 rounded-md shadow-md">
          <div
            className="[display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:4] max-w-[400px] m-auto
						bg-gray-200
						rounded-md shadow-md
						overflow-hidden"
          >
            Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque
            dicta, rem obcaecati eligendi quod ipsam illo, ab incidunt quam,
            blanditiis iure dolor eveniet atque ut. Accusantium dolor eius eos
            temporibus. Lorem ipsum dolor sit amet consectetur, adipisicing
            elit. Cumque dicta, rem obcaecati eligendi quod ipsam illo, ab
            incidunt quam, blanditiis iure dolor eveniet atque ut. Accusantium
            dolor eius eos temporibus.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
