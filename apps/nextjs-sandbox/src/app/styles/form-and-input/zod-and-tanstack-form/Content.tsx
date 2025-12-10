"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import SimpleContactForm from "./SimpleContactForm";

const Content = () => {
  return (
    <div className="w-96 p-10">
      <QueryClientProvider client={queryClient}>
        <SimpleContactForm />
      </QueryClientProvider>
    </div>
  );
};

export default Content;
