"use client";

import { useMutation } from "@tanstack/react-query";
import { getCustomerTokenCookie } from "../../actions";
import { getMe } from "./api";

export const Content = () => {
  const getMeMutation = useMutation({
    mutationFn: async () => {
      const token = await getCustomerTokenCookie();
      if (!token) {
        throw new Error("No customer token cookie found");
      }
      return await getMe(token);
    },
    onSuccess: async (data) => {
      console.log("Me data:", data);
    },
    onError: (error) => {
      console.error("Failed to get me:", error);
    },
  });

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      {/* Raw data for debugging */}
      <details className="mt-6 w-full">
        <summary className="cursor-pointer text-gray-600 hover:text-gray-800">
          Show Raw Data
        </summary>
        <pre className="mt-2 overflow-auto rounded bg-gray-100 p-4 text-sm">
          {JSON.stringify(getMeMutation.data, null, 2)}
        </pre>
      </details>
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <h2 className="mt-6 text-center font-extrabold text-3xl text-gray-900">
          Get Me by Token
        </h2>
        <div className="mt-4">
          <button
            type="button"
            onClick={() => getMeMutation.mutate()}
            className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 font-medium text-sm text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Get Me
          </button>
          {getMeMutation.isError && (
            <p className="mt-2 text-red-600 text-sm">
              Error: {(getMeMutation.error as Error).message}
            </p>
          )}
          {getMeMutation.isSuccess && (
            <p className="mt-2 text-green-600 text-sm">
              Profile loaded successfully!
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
