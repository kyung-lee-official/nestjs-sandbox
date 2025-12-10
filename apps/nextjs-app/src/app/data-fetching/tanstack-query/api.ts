import axios from "axios";

export async function fetchTodo(id: number) {
  const res = await axios.get(
    `https://jsonplaceholder.typicode.com/todos/${id}`,
  );
  return res.data;
}
