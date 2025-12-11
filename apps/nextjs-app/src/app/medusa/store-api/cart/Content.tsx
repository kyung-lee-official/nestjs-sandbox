"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { getCart } from "./api";

type FormData = {
  cartId: string;
};

export const Content = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      cartId: "",
    },
  });

  const getCartMutation = useMutation({
    mutationFn: async (cartId: string) => {
      return await getCart(cartId);
    },
    onSuccess: async (data) => {
      console.log("Cart data:", data);
    },
    onError: (error) => {
      console.error("Failed to get cart:", error);
    },
  });

  const onSubmit = (data: FormData) => {
    getCartMutation.mutate(data.cartId);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div>
          <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
            Get Cart by ID
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="cartId" className="sr-only">
              Cart ID
            </label>
            <input
              {...register("cartId", {
                required: "Cart ID is required",
              })}
              type="text"
              className="relative block w-full appearance-none rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter Cart ID"
            />
            {errors.cartId && (
              <p className="mt-1 text-red-600 text-sm">
                {errors.cartId.message}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={getCartMutation.isPending}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {getCartMutation.isPending ? "Loading..." : "Get Cart"}
            </button>
          </div>

          {getCartMutation.isError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="font-medium text-red-800 text-sm">
                    Failed to get cart
                  </h3>
                  <div className="mt-2 text-red-700 text-sm">
                    <p>
                      {getCartMutation.error instanceof Error
                        ? getCartMutation.error.message
                        : "An error occurred while fetching the cart"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {getCartMutation.isSuccess && (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="font-medium text-green-800 text-sm">
                    Cart retrieved successfully!
                  </h3>
                  <div className="mt-2 text-green-700 text-sm">
                    <p>Cart data has been fetched successfully.</p>
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
