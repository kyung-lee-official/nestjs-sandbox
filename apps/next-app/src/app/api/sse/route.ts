import { nanoid } from "nanoid";

export const dynamic = "force-dynamic"; // Prevent caching

export type Payload = {
  id: string;
  time: string;
  message: string;
};

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

  const stream = new ReadableStream({
    start(controller) {
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

      const interval = setInterval(() => {
        const time = new Date().toISOString();
        const payload = JSON.stringify({
          id: nanoid(),
          time,
          message: "Current server time",
        });
        controller.enqueue(encoder.encode(`data: ${payload}\n\n`));
      }, 2000);

      // Cleanup on client disconnect
      return () => {
        clearInterval(interval);
        controller.close();
      };
    },
    cancel() {
      // Optional: handle abrupt close
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
