import Chain1 from "./Chain1";
import Chain2 from "./Chain2";

const Page = () => {
  return (
    <div className="flex flex-col items-center min-h-svh p-4 gap-8">
      <Chain1 />
      <Chain2 />
    </div>
  );
};

export default Page;
