const BasicMask = () => {
  return (
    <div className="flex gap-8">
      <div className="flex flex-col items-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M100 0H0V100H100V0Z" className="fill-red-500" />
        </svg>
        svg
      </div>
      <div className="flex flex-col items-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path fill="url(#linear_gradient)" d="M100 0H0V100H100V0Z" />
          <defs>
            <linearGradient
              id="linear_gradient"
              x1="50%"
              y1="0%"
              x2="50%"
              y2="100%"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="white" offset={0} />
              <stop stopColor="black" offset={1} />
            </linearGradient>
          </defs>
        </svg>
        mask
      </div>
      <div className="flex flex-col items-center">
        <svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask
            id="svg_mask"
            maskUnits="userSpaceOnUse"
            x="0"
            y="0"
            width="100"
            height="100"
          >
            <path d="M100 0H0V100H100V0Z" fill="url(#linear_gradient)" />
          </mask>
          <g mask="url(#svg_mask)">
            <path d="M100 0H0V100H100V0Z" className="fill-red-500" />
          </g>
        </svg>
        result
      </div>
    </div>
  );
};

export default BasicMask;
