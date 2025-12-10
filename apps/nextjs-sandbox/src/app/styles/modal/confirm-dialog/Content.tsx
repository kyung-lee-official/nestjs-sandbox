"use client";

import { useState } from "react";
import { ConfirmDialog } from "./confirm-dialog/ConfirmDialog";
import { ConfirmDialogWithButton } from "./confirm-dialog/ConfirmDialogWithButton";

const DeleteOutlineOutlined = (props: { size: number }) => {
  const { size } = props;
  return (
    <svg
      focusable="false"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      className="fill-neutral-400"
    >
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6zM8 9h8v10H8zm7.5-5-1-1h-5l-1 1H5v2h14V4z"></path>
    </svg>
  );
};

type User = { id: number; user: string };

export const Content = () => {
  const [show, setShow] = useState<boolean>(false);
  const [userToDelete, setUserToDelete] = useState<number | undefined>(
    undefined,
  );

  const [mockData, setMockData] = useState<User[]>([
    {
      id: 1,
      user: "John Doe",
    },
    {
      id: 2,
      user: "Jane Smith",
    },
    {
      id: 3,
      user: "Alice Johnson",
    },
    {
      id: 4,
      user: "Bob Brown",
    },
  ]);

  return (
    <div
      className="flex p-8 h-svh gap-24
			bg-neutral-950"
    >
      <div className="w-96 text-neutral-400">
        <h1>ConfirmDialog</h1>
        <span>
          this way, you could only use one dialog in this page, and use a state
          to store which user to delete
        </span>
        {mockData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 gap-4
						border-b border-neutral-700"
          >
            <div>{item.user}</div>
            <button
              className="flex cursor-pointer
							bg-neutral-800 hover:bg-neutral-700
							rounded"
              onClick={() => {
                setUserToDelete(item.id);
                setShow(true);
              }}
            >
              <DeleteOutlineOutlined size={24} />
            </button>
          </div>
        ))}
        <ConfirmDialog
          show={show}
          setShow={setShow}
          question={"Delete this user?"}
          description={"Are you sure you want to delete this user?"}
          confirmText="Delete"
          data={userToDelete}
          onOk={(id: number | undefined) => {
            /* typically, you would call an API to delete the user here */
            setMockData((prev) => prev.filter((i) => i.id !== id));
          }}
        />
      </div>
      <div className="w-96 text-neutral-400">
        <h1>ConfirmDialogWithButton</h1>
        <span>
          this way, you could use multiple dialogs in this page, pass in id
          directly in the map function
        </span>
        {mockData.map((item) => (
          <div
            key={item.id}
            className="flex justify-between items-center p-4 gap-4
						border-b border-neutral-700"
          >
            <div>{item.user}</div>
            <ConfirmDialogWithButton
              question={"Delete this user?"}
              description={"Are you sure you want to delete this user?"}
              confirmText="Delete"
              data={item.id}
              onOk={(id: number | undefined) => {
                /* typically, you would call an API to delete the user here */
                setMockData((prev) => {
                  return prev.filter((i) => i.id !== id);
                });
              }}
            >
              <button
                className="flex cursor-pointer
								bg-neutral-800 hover:bg-neutral-700
								rounded"
              >
                <DeleteOutlineOutlined size={24} />
              </button>
            </ConfirmDialogWithButton>
          </div>
        ))}
      </div>
    </div>
  );
};
