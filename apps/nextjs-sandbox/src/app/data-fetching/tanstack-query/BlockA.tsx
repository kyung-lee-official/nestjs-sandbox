import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { queryClient } from "./queryClient";
import { fetchTodo } from "./api";

const Todo = () => {
  const { isPending, data, error } = useQuery({
    queryKey: ["todo"],
    queryFn: async () => {
      return fetchTodo(1);
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
      <div>Todo: {data.title}</div>
    </div>
  );
};

const BlockA = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Todo />
    </QueryClientProvider>
  );
};

export default BlockA;
