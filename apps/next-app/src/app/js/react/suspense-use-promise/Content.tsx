import { use } from "react";

type Props = {
  promise: Promise<any>;
};

export const Content = ({ promise }: Props) => {
  const { data } = use(promise);
  return (
    <div>
      {data.map((todo: any) => (
        <div key={todo.id}>{todo.title}</div>
      ))}
    </div>
  );
};
