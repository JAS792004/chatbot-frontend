import { useEffect, useState } from "react";
import socket from "../utils/socket";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("chat message", (msg: string) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chat message", message);
      setMessage("");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Chat App</h1>
      <input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type something..."
        className="border p-2 mt-2"
      />
      <button onClick={sendMessage} className="ml-2 bg-blue-500 text-white px-4 py-2 rounded">
        Send
      </button>
      <ul className="mt-4">
        {messages.map((m, i) => (
          <li key={i} className="border-b py-1">{m}</li>
        ))}
      </ul>
    </div>
  );
}
