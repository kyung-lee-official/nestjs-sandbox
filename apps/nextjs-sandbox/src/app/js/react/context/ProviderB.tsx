import CompB from "./CompB";
import { TestContext } from "./Context";

const ProviderB = (prop: any) => {
	const { num, setNum } = prop;
	return (
		<TestContext.Provider value={num}>
			<CompB setNum={setNum} />
		</TestContext.Provider>
	);
};

export default ProviderB;
