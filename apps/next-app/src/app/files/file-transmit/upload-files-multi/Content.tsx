"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { queryClient } from "@/app/data-fetching/tanstack-query/queryClient";
import { UploadFiles } from "./UploadFiles";

const Content = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col gap-6 p-10 w-1/2">
        <h1 className="text-lg">Upload Files (one by one in a loop)</h1>
        <p>The files are uploaded in multipart/form-data format.</p>
        <p>
          Essentially the same as uploading a single file, but do it in a loop
          for each file in the array.
        </p>
        <p>
          Throttle down (fast 4G) your network in the dev tools to test this
          feature. The file will be uploaded to the server, check it out in the
          server&apos;s file system.
        </p>
        <UploadFiles />
      </div>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default Content;
