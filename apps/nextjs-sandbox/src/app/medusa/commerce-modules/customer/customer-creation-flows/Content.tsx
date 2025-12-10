"use client";

import { useMutation } from "@tanstack/react-query";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { getRegistrationAuthenticationToken } from "../../auth/basic-authentication-flow/api";
import { CustomerQK, registerCustomer } from "../api";
import { CustomerList } from "./CustomerList";
import { TestLoginToken } from "./TestLoginToken";

type RegistrationForm = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  avatar_url?: string;
};

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegistrationForm>();

  const registrationMutation = useMutation({
    mutationFn: async (data: RegistrationForm) => {
      const tokenRes = await getRegistrationAuthenticationToken(
        data.email,
        data.password,
        "customer",
      );

      const regRes = await registerCustomer(
        tokenRes.token,
        data.firstName,
        data.lastName,
        data.email,
        data.avatar_url,
      );

      return regRes;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: [CustomerQK.GET_CUSTOMER_LIST],
      });
    },
    onError: (error) => {
      console.error("Registration failed:", error);
    },
  });

  return (
    <div className="m-6 space-y-4">
      <Link
        href={
          "https://docs.medusajs.com/resources/references/medusa-workflows/createCustomerAccountWorkflow"
        }
        className="underline decoration-dotted"
      >
        Customer Creation Flow
      </Link>
      <h3>Register</h3>
      <form
        onSubmit={handleSubmit((data) => registrationMutation.mutate(data))}
        className="flex flex-col gap-4 max-w-sm"
      >
        <div>
          <label>Email:</label>
          <input
            {...register("email", {
              required: "Email is required",
            })}
            type="email"
            defaultValue="customer1@example.com"
            className="block w-full px-3 py-2 border rounded"
          />
          {errors.email && (
            <span className="text-red-500">{errors.email.message}</span>
          )}
        </div>
        <div>
          <label>Password:</label>
          <input
            {...register("password", {
              required: "Password is required",
            })}
            type="password"
            defaultValue="supersecret"
            className="block w-full px-3 py-2 border rounded"
          />
          {errors.password && (
            <span className="text-red-500">{errors.password.message}</span>
          )}
        </div>

        <div>
          <label>First Name:</label>
          <input
            {...register("firstName", {
              required: "First name is required",
            })}
            type="text"
            defaultValue="Customer1"
            className="block w-full px-3 py-2 border rounded"
          />
          {errors.firstName && (
            <span className="text-red-500">{errors.firstName.message}</span>
          )}
        </div>
        <div>
          <label>Last Name:</label>
          <input
            {...register("lastName", {
              required: "Last name is required",
            })}
            type="text"
            defaultValue="Lee"
            className="block w-full px-3 py-2 border rounded"
          />
          {errors.lastName && (
            <span className="text-red-500">{errors.lastName.message}</span>
          )}
        </div>

        <div>
          <label>Avatar URL (optional):</label>
          <input
            {...register("avatar_url", {
              /* Transform empty strings to undefined */
              setValueAs: (value) => value?.trim() || undefined,
            })}
            type="url"
            className="block w-full px-3 py-2 border rounded"
          />
        </div>

        <button
          type="submit"
          disabled={registrationMutation.isPending}
          className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
        >
          {registrationMutation.isPending ? "Registering..." : "Register"}
        </button>
      </form>
      <TestLoginToken />
      <CustomerList />
    </div>
  );
};
