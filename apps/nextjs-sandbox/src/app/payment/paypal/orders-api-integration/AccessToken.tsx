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
      <h2 className="text-xl font-semibold">Access Token Management</h2>

      {paypalAccessToken && (
        <div className="bg-blue-50 border border-blue-200 rounded p-4">
          <h3 className="font-semibold text-blue-800 mb-2">
            Existing Access Token (from cookie):
          </h3>
          <p className="text-sm text-blue-700 font-mono break-all">
            {paypalAccessToken}
          </p>
        </div>
      )}

      <button
        onClick={() => generateTokenMutation.mutate()}
        disabled={generateTokenMutation.isPending}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
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
        <div className="bg-green-50 border border-green-200 rounded p-4">
          <h3 className="font-semibold text-green-800 mb-2">
            Access Token Generated:
          </h3>
          <p className="text-sm text-green-700 font-mono break-all">
            {accessToken}
          </p>
          <p className="text-xs text-green-600 mt-2">
            Token expires in: {generateTokenMutation.data?.expires_in} seconds
          </p>
        </div>
      )}
    </div>
  );
};
