const Transition2WithFn = () => {
  return (
    <div
      className="flex flex-col items-center min-w-96 p-4 gap-2
			bg-neutral-200
			rounded-md"
    >
      <a
        href="https://www.react-spring.dev/docs/components/use-transition#with-a-function--deps"
        className="underline"
      >
        <del>useTransition with a config object & useState()</del>
      </a>
      <div>
        Do not use this crap, neither the official docs nor examples use it.
      </div>
    </div>
  );
};

export default Transition2WithFn;
