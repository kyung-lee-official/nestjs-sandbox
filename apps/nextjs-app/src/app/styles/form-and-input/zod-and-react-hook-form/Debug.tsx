import type { FormState } from "react-hook-form";
import type { FormInput } from "./Form";

export const Debug = (props: {
  data: FormInput;
  isPasswordMatch: boolean;
  formState: FormState<FormInput>;
  isConfirmPasswordBlur: boolean;
}) => {
  const { data, isPasswordMatch, isConfirmPasswordBlur, formState } = props;
  const { email, password, confirmPassword } = data;

  return (
    <div
      className="min-h-20 p-1
			text-white
			bg-black/50"
    >
      <div>email: {email}</div>
      <div>password: {password}</div>
      <div>confirmPassword: {confirmPassword}</div>
      <div>isPasswordMatch: {isPasswordMatch + ""}</div>
      <div>isConfirmPasswordBlur: {isConfirmPasswordBlur + ""}</div>
      <div>formState.errors.email: {formState.errors.email?.message}</div>
      <div>formState.errors.password: {formState.errors.password?.message}</div>
      <div>
        formState.errors.confirmPassword:{" "}
        {formState.errors.confirmPassword?.message}
      </div>
    </div>
  );
};
