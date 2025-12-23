"use client";

import { type DragEvent, useRef, useState } from "react";

interface User {
  id: string;
  name: string;
  age: number;
}

const initialUsers: User[] = [
  { id: "1", name: "Alice", age: 30 },
  { id: "2", name: "Bob", age: 25 },
  { id: "3", name: "Charlie", age: 35 },
  { id: "4", name: "David", age: 28 },
];

export const Content = () => {
  const [users, setUsers] = useState<User[]>(initialUsers);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);
  const [dragOverItem, setDragOverItem] = useState<number | null>(null);
  const dragItemRef = useRef<HTMLDivElement | null>(null);

  const handleDragStart = (e: DragEvent<HTMLDivElement>, index: number) => {
    setDraggedItem(index);
    dragItemRef.current = e.currentTarget;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/html", e.currentTarget.outerHTML);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedItem === index) return;
    setDragOverItem(index);
  };

  const handleDragLeave = () => {
    setDragOverItem(null);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>, index: number) => {
    e.preventDefault();
    if (draggedItem === index) return;

    const newUsers = [...users];
    if (draggedItem !== null) {
      const draggedUser = newUsers[draggedItem];
      newUsers.splice(draggedItem, 1);
      newUsers.splice(index, 0, draggedUser!);

      setUsers(newUsers);
      setDraggedItem(null);
      setDragOverItem(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverItem(null);
    dragItemRef.current = null;
  };

  return (
    <div style={{ display: "flex", flexWrap: "wrap" }}>
      {users.map((user, index) => (
        <div
          key={user.id}
          draggable
          onDragStart={(e) => handleDragStart(e, index)}
          onDragOver={(e) => handleDragOver(e, index)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => handleDrop(e, index)}
          onDragEnd={handleDragEnd}
          style={{
            margin: "8px",
            padding: "16px",
            border:
              dragOverItem === index ? "2px dashed blue" : "1px solid #ccc",
            borderRadius: "4px",
            cursor: "move",
            backgroundColor: draggedItem === index ? "#f0f0f0" : "white",
          }}
        >
          <p>Name: {user.name}</p>
          <p>Age: {user.age}</p>
        </div>
      ))}
    </div>
  );
};
