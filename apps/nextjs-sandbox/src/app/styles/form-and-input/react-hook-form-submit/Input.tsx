import type { InputHTMLAttributes } from "react";

type InputProps = {
  title: string;
  isRequired?: boolean;
  isError: boolean;
  errorMessage?: string;
};

export const Input = (
  props: InputHTMLAttributes<HTMLInputElement> & InputProps,
) => {
  const {
    children,
    title,
    isRequired = false,
    isError,
    errorMessage,
    ...rest
  } = props;

  return (
    <div>
      <div className="flex gap-1">
        {title && <label className="text-neutral-500">{title}</label>}
        {isRequired && <span className="text-red-400">*</span>}
      </div>
      <input
        {...rest}
        className={`w-full p-1 m-[2px] 
				text-base
				${isError && "text-red-400"}
				bg-black/10
				caret-neutral-600
				${isError && "border-solid border-red-400 border-2 m-0"}
				rounded
				outline-none`}
      >
        {children}
      </input>
      {isError && <div className="ml-2 text-red-400">{errorMessage}</div>}
    </div>
  );
};
