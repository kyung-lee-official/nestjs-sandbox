"use client";

import { useState } from "react";

const Content = () => {
  const [date, setDate] = useState(new Date().toISOString());

  return (
    <div className="flex flex-col p-6">
      <div>
        Real-time Date: {date} <br />
        This date updates if the page is refreshed in both dev and build mode
        because a state is used.
      </div>
      <div>
        If you simply write `new Date().toISOString()` in the HTML section
        without using a state, the date will not update in real-time in the
        build mode. Because during the build, the date is generated once and is
        not updated.
      </div>
      <div>
        Note that we should import the date component dynamically in the parent
        component to avoid server-side rendering, which could cause the
        &quot;Text content does not match server-rendered HTML.&quot; error.{" "}
        <a href="https://react.dev/errors/425">
          <u>#425</u>
        </a>
      </div>
    </div>
  );
};

export default Content;
