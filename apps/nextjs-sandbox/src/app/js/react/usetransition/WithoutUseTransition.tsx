import { memo, useState, useTransition } from "react";

function TabButton({ children, isActive, onClick }: any) {
  return (
    <button
      className={`p-2 ${isActive ? "font-bold bg-gray-400 rounded-lg" : ""}`}
      onClick={() => {
        onClick();
      }}
    >
      {children}
    </button>
  );
}

const PostsTab = memo(function PostsTab() {
  /* Log once. The actual slowdown is inside SlowPost. */
  console.log("[ARTIFICIALLY SLOW] Rendering 500 <SlowPost />");

  const items = [];
  for (let i = 0; i < 500; i++) {
    items.push(<SlowPost key={i} index={i} />);
  }
  return <ul className="items">{items}</ul>;
});

function AboutTab() {
  return <p>Welcome to my profile!</p>;
}

function SlowPost({ index }: any) {
  const startTime = performance.now();
  while (performance.now() - startTime < 1) {
    /* Do nothing for 1 ms per item to emulate extremely slow code */
  }

  return <li className="item">Post #{index + 1}</li>;
}

function ContactTab() {
  return (
    <>
      <p>You can find me online here:</p>
      <ul>
        <li>admin@mysite.com</li>
        <li>+123456789</li>
      </ul>
    </>
  );
}

export default function WithUseTransition() {
  const [tab, setTab] = useState("about");

  function selectTab(nextTab: "about" | "posts" | "contact") {
    setTab(nextTab);
  }

  return (
    <div
      className="flex flex-col w-96
			bg-gray-200 rounded overflow-hidden"
    >
      <div
        className="flex p-2 gap-2
				bg-gray-300"
      >
        <TabButton
          isActive={tab === "about"}
          onClick={() => selectTab("about")}
        >
          About
        </TabButton>
        <TabButton
          isActive={tab === "posts"}
          onClick={() => selectTab("posts")}
        >
          Posts (slow)
        </TabButton>
        <TabButton
          isActive={tab === "contact"}
          onClick={() => selectTab("contact")}
        >
          Contact
        </TabButton>
      </div>
      <hr />
      <div
        className="h-96 p-2
				overflow-y-scroll"
      >
        {tab === "about" && <AboutTab />}
        {tab === "posts" && <PostsTab />}
        {tab === "contact" && <ContactTab />}
      </div>
    </div>
  );
}
