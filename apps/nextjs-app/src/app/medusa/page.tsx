import Link from "next/link";
import type { ReactNode } from "react";

const Block = ({
  title,
  list,
  children,
}: {
  title: string | ReactNode;
  list: { link: string; text: string | ReactNode }[];
  children?: ReactNode;
}) => {
  return (
    <div
      className="flex flex-col p-6 gap-3
			bg-white/50
			rounded-lg"
    >
      <h1 className="text-xl">{title}</h1>
      {children}
      <div className="flex flex-col">
        {list.map((item) => {
          return (
            <Link key={item.link} href={item.link} className="hover:underline">
              {item.text}
            </Link>
          );
        })}
      </div>
    </div>
  );
};
export default function Page() {
  return (
    <main
      className="grid
			grid-cols-1
			sm:grid-cols-2
			md:grid-cols-3
			lg:grid-cols-4
			xl:grid-cols-5
			min-h-svh p-10 gap-6
			bg-gradient-to-br from-cyan-500/60 to-purple-500/60"
    >
      <Block
        title="Test"
        list={[{ link: "medusa/test/hello-world", text: "Hello World" }]}
      />
      <Block
        title="Framework"
        list={[
          {
            link: "medusa/framework/events-and-subscribers",
            text: "Events and Subscribers",
          },
        ]}
      />
      <Block
        title="Commerce Modules"
        list={[
          {
            link: "medusa/commerce-modules/api-key",
            text: "API Key",
          },
          { link: "medusa/commerce-modules/auth", text: "Auth" },
          { link: "medusa/commerce-modules/cart", text: "Cart" },
          {
            link: "medusa/commerce-modules/customer",
            text: "Customer",
          },
          {
            link: "medusa/commerce-modules/fulfillment",
            text: "Fulfillment",
          },
          {
            link: "medusa/commerce-modules/inventory",
            text: "Inventory",
          },
          {
            link: "medusa/commerce-modules/product",
            text: "Product",
          },
          {
            link: "medusa/commerce-modules/sales-channel",
            text: "Sales Channel",
          },
          {
            link: "medusa/commerce-modules/stock-location",
            text: "Stock Location",
          },
          { link: "medusa/commerce-modules/user", text: "User" },
        ]}
      />
      <Block
        title="Infrastructure Modules"
        list={[
          {
            link: "medusa/infrastructure-modules/notification",
            text: "Notification",
          },
        ]}
      />
      <Block
        title="Examples"
        list={[
          {
            link: "medusa/examples/restaurant-delivery",
            text: "Restaurant Delivery",
          },
        ]}
      />
    </main>
  );
}
