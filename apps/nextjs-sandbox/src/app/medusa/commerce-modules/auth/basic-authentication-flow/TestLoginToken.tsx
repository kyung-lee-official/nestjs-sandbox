import { useMutation } from "@tanstack/react-query";
import { loginTester } from "./api";

export const TestLoginToken = () => {
  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      const res = await loginTester(data.email, data.password);
      return res;
    },
  });

  return (
    <div className="w-full">
      <h1>
        Test Login (Note that auth info is recorded separately in auth_identity
        table and provider_identity table, deleting tester doesn&#39;t prevent
        login)
      </h1>
      <button
        className="underline decoration-dotted"
        onClick={() =>
          loginMutation.mutate({
            email: "tester1@example.com",
            password: "supersecret",
          })
        }
      >
        Login
      </button>
      <div>token: {loginMutation.data?.token}</div>
    </div>
  );
};
