import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { fetchPokemon } from "./api";

const Pokemon = () => {
	const { isPending, data, error } = useQuery({
		queryKey: ["pokemon"],
		queryFn: async () => {
			return fetchPokemon(2);
		},
	});

	if (isPending) {
		return <div>Loading...</div>;
	}

	if (error) {
		return <div>Error: {error.message}</div>;
	}

	return (
		<div
			className="flex flex-col w-fit p-4 gap-2
			bg-white"
		>
			<div>ID: {data.id}</div>
			<div>Pokemon: {data.pokemon}</div>
		</div>
	);
};

const BlockB = () => {
	return (
		<QueryClientProvider client={queryClient}>
			<Pokemon />
		</QueryClientProvider>
	);
};

export default BlockB;
