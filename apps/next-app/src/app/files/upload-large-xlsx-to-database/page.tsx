import { GenerateXlsx } from "./GenerateXlsx";
import { TanStackWrapper } from "./TanStackWrapper";
import { Tasks } from "./tasks/Tasks";
import { UploadFile } from "./UploadFile";

const Page = () => {
  return (
    <TanStackWrapper>
      <div className="space-y-6">
        <GenerateXlsx />
        <UploadFile />
        <Tasks />
      </div>
    </TanStackWrapper>
  );
};

export default Page;
