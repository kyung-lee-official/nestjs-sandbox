import axios from "axios";
import { useEffect, useState } from "react";

export const Title = (props: { id: number }) => {
  const { id } = props;
  const loading = "Loading...";
  const [title, setTitle] = useState<string>(loading);

  useEffect(() => {
    async function mock() {
      const res = await axios.get(
        `https://jsonplaceholder.typicode.com/posts/${id}`,
      );
      if (res.status === 200) {
        setTitle(res.data.title);
      } else {
        setTitle("Error fetching data");
      }
    }
    mock();
  }, []);

  return (
    <div className={`${title === loading && "bg-amber-300"}`}>{title}</div>
  );
};
