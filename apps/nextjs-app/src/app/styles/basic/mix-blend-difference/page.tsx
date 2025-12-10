const Page = () => {
  return (
    <div className="relative flex justify-center items-center w-full h-screen">
      <div className="flex-1 bg-black h-full"></div>
      <div className="flex-1 bg-pink-500 h-full"></div>
      <div
        className="absolute
				text-pink-500
				text-6xl font-bold mix-blend-difference"
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </div>
    </div>
  );
};

export default Page;
