import { nanoid } from "nanoid";

export const dynamic = "force-dynamic"; // Prevent caching

export type Payload = {
  id: string;
  time: string;
  message: string;
};

// Store active SSE connections
// connection a.k.a. stream controllers
const activeConnections = new Set<ReadableStreamDefaultController>();

function broadcastMessage(message: string) {
  const encoder = new TextEncoder();
  const payload = JSON.stringify({
    id: nanoid(),
    time: new Date().toISOString(),
    message,
  });

  const data = encoder.encode(`data: ${payload}\n\n`);

  // Send to all connected clients
  activeConnections.forEach((controller) => {
    try {
      controller.enqueue(data);
    } catch (error) {
      // Remove broken connections
      activeConnections.delete(controller);
    }
  });
}

export async function GET() {
  const encoder = new TextEncoder();

  /**
   * Server-Sent Events (SSE) is a standardized protocol that
   * browsers understand. The protocol mandates a specific text format:
   *
   * data: your-message-here\n\n
   *  -	data: This prefix indicates that the following text is the message payload.
   *  -	\n\n: A double newline signifies the end of one message.
   *
   * Why encoder.encode()? The ReadableStream expects bytes (Uint8Array), not strings.
   * The TextEncoder converts the SSE-formatted string into the byte format
   * the stream requires.
   */

  let streamController: ReadableStreamDefaultController;

  const stream = new ReadableStream({
    start(controller) {
      // Store controller reference for use in cancel method
      streamController = controller;

      // Add this controller to active connections
      activeConnections.add(controller);

      // Send an initial message
      controller.enqueue(
        encoder.encode(
          `data: ${JSON.stringify({
            id: nanoid(),
            time: new Date().toISOString(),
            message: "Connected to SSE!",
          })}\n\n`,
        ),
      );
    },
    cancel() {
      // Remove controller from active connections
      activeConnections.delete(streamController);
      console.log("Client disconnected");
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { message } = body;

    if (!message || typeof message !== "string") {
      return Response.json({ error: "Message is required" }, { status: 400 });
    }

    // Broadcast the message to all connected SSE clients
    broadcastMessage(message);

    return Response.json({
      success: true,
      message: "Message sent to all connected clients",
    });
  } catch (error) {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
}
