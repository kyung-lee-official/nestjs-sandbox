"use client";

import Link from "next/link";
import { useState } from "react";
import Pathname from "./Pathname";

function Content() {
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col">
      <Link href={"#anchor"}>Click me to add an anchor in the URL</Link>
      <button
        className="w-fit"
        onClick={() => {
          setShow(!show);
        }}
      >
        Click me to show the result of usePathname()
      </button>
      {show && <Pathname />}
    </div>
  );
}

export default Content;
