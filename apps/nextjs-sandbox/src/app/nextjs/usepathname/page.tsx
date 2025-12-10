import Link from "next/link";
import Content from "./Content";

const Page = () => {
  return (
    <div className="flex flex-col p-10 gap-6">
      <h1 className="text-xl">
        <Link
          href={
            "https://nextjs.org/docs/app/api-reference/functions/use-pathname"
          }
        >
          usePathname
        </Link>
      </h1>
      <h2>Anchor is not included in the string returned by usePathname()</h2>
      <Content />
    </div>
  );
};

export default Page;
