"use client";

import { useEffect, useState } from "react";
import { getChatSocket } from "../socket";

const ChatContent = (props: { messages: string[] }) => {
	return (
		<div
			className="flex flex-col w-full h-[calc(100vh-400px)] p-4 gap-2
			bg-neutral-100
			rounded overflow-y-auto scrollbar"
		>
			{props.messages.map((message, index) => (
				<div key={index} className="text-gray-700">
					{message}
				</div>
			))}
		</div>
	);
};

const Content = () => {
	const [isConnected, setIsConnected] = useState(false);
	const [messages, setMessages] = useState<string[]>([]);
	const [textArea, setTextArea] = useState("");
	const [socketId, setSocketId] = useState<string | null>(null);

	useEffect(() => {
		/**
		 * Get the singleton socket instance
		 * the best practice is to use a singleton pattern for the socket instance
		 * to avoid creating multiple instances of the socket connection
		 *
		 * but if you prefer to use a page-level socket instance, you should
		 * use useRef to persist the socket instance across renders
		 */
		const socket = getChatSocket();

		/* event listeners */
		socket.on("connect", () => {
			setIsConnected(true);
			setSocketId(socket.id ?? null);
		});
		socket.on("disconnect", () => {
			setIsConnected(false);
			setSocketId(null);
		});
		socket.on("s2c", (chatHistory: string[]) => {
			setMessages(chatHistory);
		});

		/* cleanup on component unmount */
		/**
		 * why `off` not `disconnect`?
		 * The socket.off method removes specific event listeners that were
		 * added using socket.on
		 *
		 * The socket.disconnect method closes the connection to the server,
		 * this is a more drastic action and is typically used when you want to stop all communication with the server,
		 * not just clean up event listeners.
		 */
		return () => {
			socket.off("connect");
			socket.off("disconnect");
			socket.off("s2c");
		};
	}, []);

	const handleStart = () => {
		/* get the singleton socket instance */
		const socket = getChatSocket();
		socket.connect();
	};

	const handleDisconnect = () => {
		const socket = getChatSocket(); /* get the singleton socket instance */
		socket.disconnect();
	};

	const handleSend = () => {
		const socket = getChatSocket(); /* get the singleton socket instance */
		socket.emit("c2s", {
			message: textArea,
		});
	};

	return (
		<div
			className="flex flex-col justify-start items-start h-svh p-10 gap-8
			bg-gray-200"
		>
			<ChatContent messages={messages} />
			<textarea
				className="w-full min-h-40
				bg-neutral-100"
				value={textArea}
				onChange={(e) => setTextArea(e.target.value)}
			/>
			<div className="flex items-center gap-6">
				<button
					className="px-2 py-1
					text-white
					bg-green-500 hover:bg-green-600
					rounded"
					onClick={handleSend}
				>
					Send
				</button>
				<button
					className="px-2 py-1
					text-white
					bg-blue-500 hover:bg-blue-600
					rounded"
					onClick={handleStart}
				>
					Connect
				</button>
				<button
					className="px-2 py-1
					text-white
					bg-red-500 hover:bg-red-600
					rounded"
					onClick={handleDisconnect}
				>
					Disconnect
				</button>
				<div
					className={`w-3 h-3 
					${isConnected ? "bg-green-500" : "bg-gray-500"}
					${isConnected ? "shadow-[0_0_10px_#00ff00]" : ""}
					rounded-full duration-700`}
				></div>
				{/* Display the socket ID when connected */}
				{socketId && (
					<div className="text-gray-700">
						<strong>Socket ID:</strong> {socketId}
					</div>
				)}
			</div>
		</div>
	);
};

export default Content;
