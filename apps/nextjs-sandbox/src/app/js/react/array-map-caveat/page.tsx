import { Content } from "./Content";

const Page = () => {
  return (
    <div className="m-8">
      <h1>Array Map Caveat</h1>
      <p>
        when using an editable array, DO NOT use index as key, use a unique id
        instead, this is because React uses the key to identify elements, React
        will unmount and remount the element only if the key is changed, using
        index as key will cause unexpected rendering errors.
      </p>
      <p>
        given `sort()` function will mutate the original array, when working
        with `setState` or `dispatch`, use a copy of the array `[...users]` to
        avoid unexpected behavior.
      </p>
      <Content />
    </div>
  );
};

export default Page;
