"use client";

import { useEffect, useState } from "react";
import { Payload } from "@/app/api/sse/route";

export function Content() {
  const [events, setEvents] = useState<Payload[]>([]);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setEvents((prev) => [...prev, data]);
      } catch (err) {
        setEvents((prev) => [...prev, event.data]);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      eventSource.close();
    };

    // Cleanup on unmount
    return () => {
      eventSource.close();
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Next.js SSE Demo</h1>
      <p>Open the browser console or this list to see real-time updates:</p>
      <ul className="mt-4 space-y-2">
        {events.map((event) => {
          return (
            <li key={event.id} className="rounded bg-gray-100 p-2">
              id: {event.id} {event.message} - <em>{event.time}</em>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
