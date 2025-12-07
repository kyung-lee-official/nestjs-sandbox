import CreateRestaurant from "./CreateRestaurant";
import DisplayRestaurants from "./DisplayRestaurants";

const Page = () => {
	return (
		<main className="m-6 space-y-2">
			<h1>Restaurant Delivery</h1>
			<p>
				This is an example of a restaurant delivery application built
				with Medusa.
			</p>
			<CreateRestaurant />
			<DisplayRestaurants />
		</main>
	);
};

export default Page;
