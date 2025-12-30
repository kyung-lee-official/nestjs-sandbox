"use client";

import { useEffect, useState } from "react";
import { Payload } from "@/app/api/sse/route";

export function Content() {
  const [events, setEvents] = useState<Payload[]>([]);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const eventSource = new EventSource("/api/sse");

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        setEvents((prev) => [...prev, data]);
      } catch (_err) {
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

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/sse", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: message.trim() }),
      });

      if (response.ok) {
        setMessage(""); // Clear the input
      } else {
        console.error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="p-8">
      <h1 className="mb-4 font-bold text-2xl">Next.js SSE Demo</h1>

      {/* Message Input Form */}
      <div className="mb-6 rounded-lg border border-gray-300 bg-white p-4">
        <h2 className="mb-3 font-semibold text-lg">Send a Message</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 rounded border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={!message.trim() || isLoading}
            className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
        <p className="mt-2 text-gray-600 text-sm">
          Messages will be broadcasted to all connected clients in real-time
        </p>
      </div>

      {/* Events List */}
      <div>
        <h2 className="mb-3 font-semibold text-lg">Live Messages</h2>
        <p className="mb-4 text-gray-600">Real-time updates from the server:</p>
        <ul className="space-y-2">
          {events.map((event) => {
            return (
              <li key={event.id} className="rounded bg-gray-100 p-3">
                <div className="font-medium">{event.message}</div>
                <div className="mt-1 text-gray-500 text-xs">
                  ID: {event.id} • {new Date(event.time).toLocaleTimeString()}
                </div>
              </li>
            );
          })}
        </ul>
        {events.length === 0 && (
          <p className="text-gray-500 italic">No messages yet...</p>
        )}
      </div>
    </div>
  );
}
