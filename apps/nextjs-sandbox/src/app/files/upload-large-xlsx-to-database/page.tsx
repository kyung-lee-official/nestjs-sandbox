import { GenerateXlsx } from "./GenerateXlsx";
import { Tasks } from "./tasks/Tasks";
import { TanStackWrapper } from "./TanStackWrapper";
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
