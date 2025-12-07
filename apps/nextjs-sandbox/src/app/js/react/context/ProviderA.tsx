import CompA from "./CompA";
import { TestContext } from "./Context";

const ProviderA = (prop: any) => {
	const { num, setNum } = prop;
	return (
		<TestContext.Provider value={num}>
			<CompA setNum={setNum} />
		</TestContext.Provider>
	);
};

export default ProviderA;
