import { Suspense } from "react";
import { Content } from "./Content";
import axios from "axios";

const Page = async () => {
  return (
    <div className="flex flex-col gap-4 p-10">
      <h1>React `use` with Suspense and Promise</h1>
      <p>
        Open the devtools network tab to see the requests, you will notice that
        no request is made on the client side, because the data is fetched on
        the server side. If you click the &quot;suspense&quot; doc, you will see
        the suspense loading.
      </p>
      <div className="w-96 bg-neutral-100">
        <Suspense fallback={<div>Loading...</div>}>
          <Content
            promise={axios.get("https://jsonplaceholder.typicode.com/todos/")}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default Page;
