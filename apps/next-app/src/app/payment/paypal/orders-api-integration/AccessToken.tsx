"use client";

import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { setPayPalAccessTokenCookie } from "./actions";
import { generatePayPalAccessToken } from "./api";

type AccessTokenProps = {
  paypalAccessToken?: string;
};

export const AccessToken = ({ paypalAccessToken }: AccessTokenProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);

  const generateTokenMutation = useMutation({
    mutationFn: async () => {
      const res = await generatePayPalAccessToken();
      return res;
    },
    onSuccess: async (data) => {
      console.log("Access token generated successfully:", data);
      setAccessToken(data.access_token);

      /* save access token to cookie using server action */
      try {
        await setPayPalAccessTokenCookie(data.access_token);
        console.log("Access token saved to cookie successfully");
      } catch (error) {
        console.error("Error saving access token to cookie:", error);
      }
    },
    onError: (error) => {
      console.error("Error generating access token:", error);
    },
  });

  return (
    <div className="space-y-4">
      <h2 className="font-semibold text-xl">Access Token Management</h2>

      {paypalAccessToken && (
        <div className="rounded border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-semibold text-blue-800">
            Existing Access Token (from cookie):
          </h3>
          <p className="break-all font-mono text-blue-700 text-sm">
            {paypalAccessToken}
          </p>
        </div>
      )}

      <button
        onClick={() => generateTokenMutation.mutate()}
        disabled={generateTokenMutation.isPending}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
      >
        {generateTokenMutation.isPending
          ? "Generating Token..."
          : "Generate PayPal Access Token"}
      </button>

      {generateTokenMutation.isError && (
        <div className="text-red-500 text-sm">
          Error:{" "}
          {generateTokenMutation.error?.message ||
            "Failed to generate access token"}
        </div>
      )}

      {accessToken && (
        <div className="rounded border border-green-200 bg-green-50 p-4">
          <h3 className="mb-2 font-semibold text-green-800">
            Access Token Generated:
          </h3>
          <p className="break-all font-mono text-green-700 text-sm">
            {accessToken}
          </p>
          <p className="mt-2 text-green-600 text-xs">
            Token expires in: {generateTokenMutation.data?.expires_in} seconds
          </p>
        </div>
      )}
    </div>
  );
};
