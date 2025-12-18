const Page = () => {
  return (
    <div>
      <h1>CORS Test</h1>
      <div>
        CORS is a browser security feature that restricts cross-origin HTTP
        requests, note that the backend `X-Origin-Resource-Policy` header only
        tells the browser how to handle the resource, it does not enforce
        blocking of requests by itself, that is why preflight requests are
        important.
      </div>
      <div>
        To test CORS behavior, you can use the browser developer tools to
        inspect network requests and responses, paying close attention to the
        presence of CORS-related headers such as `Access-Control-Allow-Origin`
        and `X-Origin-Resource-Policy`.
      </div>
      <div>
        In the backend, set the `Access-Control-Allow-Origin` header to `*` to
        allow requests from any origin, or set it to a specific origin to
        restrict access. Setting the `Access-Control-Allow-Origin` header to
        `""` will block all cross-origin requests.
      </div>
      <div>
        Typically you can use an `if` statement to conditionally set the
        `Access-Control-Allow-Origin` header based on the `Origin` header of the
        incoming request in your middleware.
      </div>
    </div>
  );
};

export default Page;
