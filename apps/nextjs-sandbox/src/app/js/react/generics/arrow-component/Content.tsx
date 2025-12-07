/**
 * this is how you define a generic component using arrow function
 * add a comma after the generic type to make it work
 */
export const Content = <T,>(props: { p1: T }) => {
	const { p1 } = props;
	return <div>Check out both the Content.tsx and page.tsx code files</div>;
};
