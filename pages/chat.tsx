import { useEffect, useState, useRef } from "react";
import socket from "../utils/socket";
import Link from "next/link";

export default function Chat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-white flex flex-col">
      <header className="bg-purple-600 text-white py-4 shadow-md">
        <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Live Chat 💬</h1>
          <Link href="/login" className="text-sm underline hover:text-gray-200">
            Logout
          </Link>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-4 py-6 flex flex-col">
        <div className="flex-grow overflow-y-auto bg-white rounded-lg shadow-inner p-4 mb-4 border h-[60vh]">
          {messages.map((m, i) => (
            <div key={i} className="mb-2 text-gray-800 bg-gray-100 px-3 py-2 rounded w-fit max-w-[80%]">
              {m}
            </div>
          ))}
          <div ref={bottomRef}></div>
        </div>

        <div className="flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            onClick={sendMessage}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition duration-150"
          >
            Send
          </button>
        </div>
      </main>
    </div>
  );
}
