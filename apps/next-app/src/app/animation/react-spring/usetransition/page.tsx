import Transition1 from "./Transition1";
import Transition2 from "./Transition2";
import Transition2WithFn from "./Transition2WithFn";
import Transition3 from "./Transition3/Transition3";
import Transition4 from "./Transition4/Transition4";

const Page = () => {
  return (
    <div className="flex flex-col items-center min-h-svh p-4 gap-8">
      <Transition1 />
      <Transition2 />
      <Transition2WithFn />
      <Transition3 />
      <Transition4 />
    </div>
  );
};

export default Page;
