"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { EditId, EditPanel, type EditProps } from "./EditPanel";

export const Content = () => {
  const [edit, setEdit] = useState<EditProps>({
    show: false,
    id: EditId.NAME,
  });

  const [isClient, setIsClient] = useState(false);
  /* ensure this runs only on the client */
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-10">
      <button
        className="bg-black/10 hover:bg-black/20 px-2 py-1 rounded-md"
        onClick={() => {
          setEdit({ show: true, id: EditId.NAME });
        }}
      >
        Edit Name
      </button>
      <button
        className="bg-black/10 hover:bg-black/20 px-2 py-1 rounded-md"
        onClick={() => {
          setEdit({ show: true, id: EditId.EMAIL });
        }}
      >
        Edit Email
      </button>
      <p>
        In this case, we use a transparent layer as a click listener to detect
        click outside the edit panel. A ref `listenerRef` is used to add click
        event listener.
      </p>
      <p>
        note that when using a modal dialog component, do not placing the
        component inside of a map function and control its visibility with a
        shared state, or it will cause multiple dialogs to overlay on top of
        each other, and you will only be able to see the last one.
      </p>
      {isClient &&
        createPortal(
          <EditPanel edit={edit} setEdit={setEdit} />,
          document.body,
        )}
    </div>
  );
};
