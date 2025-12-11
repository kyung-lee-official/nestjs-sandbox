"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { setCustomerTokenCookie } from "../../actions";
import { authenticateCustomer } from "./api";

type FormData = {
  email: string;
  password: string;
};

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      email: "customer1@example.com",
      password: "supersecret",
    },
  });

  const authenticateCustomerMutation = useMutation({
    mutationFn: async (data: FormData) => {
      return await authenticateCustomer(data.email, data.password);
    },
    onSuccess: async (data) => {
      /* set cookie */
      await setCustomerTokenCookie(data.token);
    },
    onError: (error) => {
      console.error("Authentication failed:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    authenticateCustomerMutation.mutate(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="-space-y-px rounded-md shadow-sm">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                type="email"
                className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Email address"
              />
              {errors.email && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.email.message}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                type="password"
                className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                placeholder="Password"
              />
              {errors.password && (
                <p className="mt-1 text-red-600 text-sm">
                  {errors.password.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={authenticateCustomerMutation.isPending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {authenticateCustomerMutation.isPending
                ? "Signing in..."
                : "Sign in"}
            </button>
          </div>

          {authenticateCustomerMutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="font-medium text-red-800 text-sm">
                    Sign in failed
                  </h3>
                  <div className="mt-2 text-red-700 text-sm">
                    <p>
                      {authenticateCustomerMutation.error instanceof Error
                        ? authenticateCustomerMutation.error.message
                        : "An error occurred during sign in"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {authenticateCustomerMutation.isSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="font-medium text-green-800 text-sm">
                    Sign in successful!
                  </h3>
                  <div className="mt-2 text-green-700 text-sm">
                    <p>You have been authenticated successfully.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
