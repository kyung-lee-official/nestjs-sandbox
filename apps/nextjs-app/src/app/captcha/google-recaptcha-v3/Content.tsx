"use client";

import axios from "axios";
import Script from "next/script";
import { useCallback, useState } from "react";

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (
        siteKey: string,
        options: { action: string },
      ) => Promise<string>;
    };
  }
}

const Content = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [recaptchaLoaded, setRecaptchaLoaded] = useState(false);

  const executeRecaptcha = useCallback(
    async (action: string): Promise<string | null> => {
      if (!recaptchaLoaded || !window.grecaptcha) {
        console.error("reCAPTCHA not loaded yet");
        return null;
      }

      return new Promise((resolve) => {
        window.grecaptcha.ready(
          /* This callback will execute when reCAPTCHA is fully loaded and ready */
          async () => {
            try {
              /**
               * get reCAPTCHA token
               *
               * What the token contains (internally):
               * 1. Site key - the public key for your reCAPTCHA
               * 2. Action - the action name you assigned to the reCAPTCHA (e.g., "submit_form")
               * 3. Timestamp - the time when the token was generated
               * 4. User's risk score- Google's assessment (0.0 to 1.0)
               * 5. Browser/device fingerprint - Various signals about the user's device and browser
               * 6. Session info - Information about the user's session
               *
               * * You cannot decode this token in JavaScript - it's encrypted and signed by Google.
               * * Only Google's servers can verify this token.
               */
              const token = await window.grecaptcha.execute(
                process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY!,
                { action },
              );
              console.log("reCAPTCHA token:", token);
              resolve(token);
            } catch (error) {
              console.error("reCAPTCHA execution failed:", error);
              resolve(null);
            }
          },
        );
      });
    },
    [recaptchaLoaded],
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");

    try {
      /* Execute reCAPTCHA */
      const token = await executeRecaptcha("submit_form");

      if (!token) {
        setMessage("reCAPTCHA verification failed. Please try again.");
        return;
      }

      const res = await axios.post("/api/recaptcha-v3/submit", {
        name,
        email,
        recaptchaToken: token,
      });

      const result = res.data;

      if (res.status === 200) {
        setMessage("Form submitted successfully!");
        setName("");
        setEmail("");
      } else {
        setMessage(result.message || "Submission failed");
      }
    } catch (error) {
      console.error("Submission error:", error);
      setMessage("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main
      className="p-12
			bg-neutral-100"
    >
      <Script
        src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
        strategy="afterInteractive"
        onLoad={() => {
          setRecaptchaLoaded(true);
          console.log("reCAPTCHA loaded successfully");
        }}
        onError={() => {
          console.error("Failed to load reCAPTCHA");
        }}
      />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6">Contact Form</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading || !recaptchaLoaded}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Submitting..." : "Submit"}
          </button>
        </form>

        {message && (
          <div
            className={`mt-4 p-3 rounded ${
              message.includes("successfully")
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message}
          </div>
        )}
      </div>
    </main>
  );
};

export default Content;
