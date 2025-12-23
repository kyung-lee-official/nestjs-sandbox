const Content = async () => {
  const res = await fetch("https://jsonplaceholder.typicode.com/todos/");
  const result = await res.json();

  if (result) {
    return (
      <div>
        {result.map((todo: any) => (
          <div key={todo.id}>{todo.title}</div>
        ))}
      </div>
    );
  }
};

export default Content;
