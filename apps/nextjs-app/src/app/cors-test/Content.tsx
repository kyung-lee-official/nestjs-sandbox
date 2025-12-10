import axios from "axios";

export const Content = async () => {
  const res = await axios.get(process.env.CORS_TEST as string);
  return <div>{JSON.stringify(res.data)}</div>;
};
