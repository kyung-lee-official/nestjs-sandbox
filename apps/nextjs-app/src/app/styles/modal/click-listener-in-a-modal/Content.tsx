"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Modal } from "./Modal";
import { Test1, Test2 } from "./Test";

export const Content = () => {
  const [showModel, setShowModel] = useState(false);
  const [isClient, setIsClient] = useState(false);

  /* Ensure this runs only on the client side */
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div className="flex p-8 gap-8">
      <button
        className="px-2 py-1
				text-white/70
				bg-neutral-700
				rounded"
        onClick={() => {
          setShowModel(true);
        }}
      >
        Open Modal
      </button>
      <Test1 />
      {isClient &&
        createPortal(
          <Modal show={showModel} setShow={setShowModel}>
            <div
              className="flex gap-6
							text-white/70 text-sm"
            >
              <div className="flex-1">
                <p>
                  the handleClick function attached to the document might not be
                  triggered because the click event is being stopped or
                  intercepted by another element higher up in the DOM hierarchy.
                </p>
                <p>Why onClick Works but document.addEventListener Does Not</p>
                <p>
                  The onClick handler is directly attached to the `button`
                  element, so it will always fire when the button is clicked.
                </p>
                <p>
                  The document.addEventListener is listening for clicks on the{" "}
                  <b className="text-lg italic">entire document</b>. If another
                  element (e.g., a modal or overlay) intercepts the click event
                  and stops its propagation (via e.stopPropagation()), the
                  handleClick function will not be triggered.
                </p>
                <p>Steps to Fix the Issue:</p>
                <p>
                  1. Check for e.stopPropagation() or pointer-events: none:
                  Inspect the DOM and ensure no parent or sibling elements are
                  stopping the event propagation or blocking clicks with CSS
                  (e.g., pointer-events: none).
                </p>
                <p>
                  2. Use capture Phase in Event Listener: By default,
                  document.addEventListener listens in the bubbling phase. You
                  can set it to listen in the capture phase to ensure it catches
                  the event before it reaches other elements.
                </p>
                <p>
                  `document.addEventListener(&quot;click&quot;, handleClick,
                  true);`
                </p>
                <Test1 />
              </div>
              <div className="flex-1">
                <Test2 />
              </div>
            </div>
          </Modal>,
          document.body,
        )}
    </div>
  );
};
