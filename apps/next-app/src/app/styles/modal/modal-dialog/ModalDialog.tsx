import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useRef,
} from "react";

export const ModalDialog = (props: {
  setShow: Dispatch<SetStateAction<boolean>>;
}) => {
  const { setShow } = props;

  const modalRef = useRef<HTMLDivElement>(null);

  const handleClick = useCallback((e: any) => {
    if (modalRef.current) {
      if (
        e.target === modalRef.current ||
        modalRef.current.contains(e.target)
      ) {
        /* Do nothing in this case */
      } else {
        quit();
      }
    }
  }, []);
  useEffect(() => {
    document.addEventListener("click", handleClick);
    return () => {
      document.removeEventListener("click", handleClick);
    };
  }, []);

  function quit() {
    /**
     * here you can add complex logics to determine if user can close the modal,
     * for example, prompt another confirmation if the user has unsaved changes.
     * another benefit of this approach is you don't need to setShow everywere, just call quit()
     */
    window.alert("Closing modal");
    setShow(false);
  }

  return (
    <div
      className="fixed top-0 right-0 bottom-0 left-0
			bg-black/50 flex justify-center items-center
			z-30"
    >
      <div
        ref={modalRef}
        className="w-96 h-60 p-4
				bg-neutral-50"
      >
        <h1 className="flex justify-between text-xl">
          <div>Modal Dialog</div>
          <button onClick={() => quit()}>X</button>
        </h1>
        <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam,
          quidem. Quam, voluptate. Quo, quos! Quisquam, quidem. Quam, voluptate.
          Quo, quos!
        </p>
        <button
          className="bg-black/10 hover:bg-black/20 px-2 py-1 rounded-md"
          onClick={() => quit()}
        >
          Close
        </button>
      </div>
    </div>
  );
};
