import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { type AxiosError } from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "./Input";

const signIn = async (body: { email: string }): Promise<any> => {
  const res = await axios.post("/api/form-and-input", body, {});
  return res.data;
};

const schema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
type FormInput = z.infer<typeof schema>;

export const Form = () => {
  const [oldData, setOldData] = useState<FormInput>({
    email: "",
  });
  const [newData, setNewData] = useState<FormInput>(oldData);
  const [email, setEmail] = useState(oldData.email);

  useEffect(() => {
    setNewData({ email });
  }, [email]);

  const { register, handleSubmit, formState, control } = useForm<FormInput>({
    mode: "onSubmit",
    resolver: zodResolver(schema) as any,
  });

  async function onSubmit() {
    console.log("submit");
  }

  async function onError() {
    console.log("error");
  }

  const mutation = useMutation<any, AxiosError, FormInput>({
    mutationFn: (data: FormInput) => {
      return signIn(data);
    },
  });

  return (
    <div>
      <h1
        className="text-2xl
				mb-8"
      >
        Sign Up
      </h1>
      <form className="flex flex-col gap-4 w-full">
        <Input
          title={"Email"}
          isError={!!formState.errors.email}
          isRequired={true}
          disabled={mutation.isPending}
          errorMessage={formState.errors.email?.message}
          {...register("email", {
            onChange: (e) => {
              setEmail(e.target.value);
            },
          })}
        />
        <button
          className="p-1
					text-sm text-white
					bg-blue-500"
          onClick={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit, onError)();
          }}
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
