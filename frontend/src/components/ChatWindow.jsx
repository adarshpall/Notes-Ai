import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user", timestamp: new Date() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const token = localStorage.getItem("token");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/ask",
        { question: input },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMessage = {
        text: res.data.answer || "🤖 No response from AI",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      console.error("❌ Chat error:", err);
      setMessages((prev) => [
        ...prev,
        { text: "❌ Error reaching AI", sender: "bot", timestamp: new Date() },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = () => {
    setMessages([]);
  };

  const downloadChatAsTxt = () => {
    const chatContent = messages
      .map((msg) => {
        const sender = msg.sender === "user" ? "You" : "Bot";
        const time = new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
        return `${sender} [${time}]: ${msg.text}`;
      })
      .join("\n\n");

    const blob = new Blob([chatContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `chat-${new Date().toISOString()}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="mt-6 p-4 border rounded-md h-[90vh] max-h-[90vh] flex flex-col dark:border-gray-700 dark:bg-gray-900 transition-colors duration-300 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-2">
        <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Chat</h2>
        <div className="space-x-2 flex-shrink-0 text-sm">
          <button
            onClick={downloadChatAsTxt}
            className="bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800"
          >
            ⬇️ Export .txt
          </button>
          <button
            onClick={handleClearChat}
            className="text-red-600 hover:underline"
          >
            🗑 Clear Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`relative group p-2 rounded-lg max-w-[85%] break-words transition-all duration-300 animate-fade-in text-sm sm:text-base ${
              msg.sender === "user"
                ? "ml-auto bg-blue-100 dark:bg-blue-600 dark:text-white text-right"
                : "mr-auto bg-gray-200 dark:bg-gray-700 dark:text-white text-left"
            }`}
          >
            <div className="font-medium mb-1">
              {msg.sender === "user" ? "You" : "Bot"}
            </div>
            <div>{msg.text}</div>
            <div className="text-[10px] mt-1 opacity-70">
              {new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>

            {/* Copy Icon */}
            <button
              onClick={() => copyToClipboard(msg.text)}
              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/30 px-1.5 py-0.5 rounded hover:bg-black"
              title="Copy"
            >
              📋
            </button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask your note..."
          className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors text-sm sm:text-base"
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors text-sm sm:text-base"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <span className="animate-bounce">🤖</span>
              <span className="text-white/80">Thinking...</span>
            </div>
          ) : (
            "Send"
          )}
        </button>
      </div>
    </div>
  );
}

// import { useState, useRef, useEffect } from "react";
// import axios from "axios";

// export default function ChatWindow() {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);
//   const messagesEndRef = useRef(null);

//   const scrollToBottom = () => {
//     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   useEffect(() => {
//     scrollToBottom();
//   }, [messages]);

//   const handleSend = async () => {
//     if (!input.trim()) return;

//     const userMessage = { text: input, sender: "user", timestamp: new Date() };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     const token = localStorage.getItem("token");

//     try {
//       const res = await axios.post(
//         "http://localhost:5000/api/ask",
//         { question: input },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         }
//       );

//       const botMessage = {
//         text: res.data.answer || "🤖 No response from AI",
//         sender: "bot",
//         timestamp: new Date(),
//       };

//       setMessages((prev) => [...prev, botMessage]);
//     } catch (err) {
//       console.error("❌ Chat error:", err);
//       setMessages((prev) => [
//         ...prev,
//         { text: "❌ Error reaching AI", sender: "bot", timestamp: new Date() },
//       ]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleClearChat = () => {
//     setMessages([]);
//   };

//   const downloadChatAsTxt = () => {
//     const chatContent = messages
//       .map((msg) => {
//         const sender = msg.sender === "user" ? "You" : "Bot";
//         const time = new Date(msg.timestamp).toLocaleTimeString([], {
//           hour: "2-digit",
//           minute: "2-digit",
//         });
//         return `${sender} [${time}]: ${msg.text}`;
//       })
//       .join("\n\n");

//     const blob = new Blob([chatContent], { type: "text/plain" });
//     const url = URL.createObjectURL(blob);

//     const link = document.createElement("a");
//     link.href = url;
//     link.download = `chat-${new Date().toISOString()}.txt`;
//     link.click();

//     URL.revokeObjectURL(url);
//   };

//   const copyToClipboard = (text) => {
//     navigator.clipboard.writeText(text);
//   };

//   return (
//     <div className="mt-6 p-4 border rounded-md h-[500px] flex flex-col dark:border-gray-700 dark:bg-gray-900 transition-colors duration-300">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-2">
//         <h2 className="font-semibold text-lg text-gray-800 dark:text-gray-100">Chat</h2>
//         <div className="space-x-2">
//           <button
//             onClick={downloadChatAsTxt}
//             className="text-sm bg-gray-700 text-white px-2 py-1 rounded hover:bg-gray-800"
//           >
//             ⬇️ Export .txt
//           </button>
//           <button
//             onClick={handleClearChat}
//             className="text-sm text-red-600 hover:underline"
//           >
//             🗑 Clear Chat
//           </button>
//         </div>
//       </div>

//       {/* Messages */}
//       <div className="flex-1 overflow-y-auto space-y-2 mb-4 pr-2">
//         {messages.map((msg, i) => (
//           <div
//             key={i}
//             className={`relative group p-2 rounded-lg max-w-[75%] break-words transition-all duration-300 animate-fade-in ${
//               msg.sender === "user"
//                 ? "ml-auto bg-blue-100 dark:bg-blue-600 dark:text-white text-right"
//                 : "mr-auto bg-gray-200 dark:bg-gray-700 dark:text-white text-left"
//             }`}
//           >
//             <div className="text-sm font-medium mb-1">
//               {msg.sender === "user" ? "You" : "Bot"}
//             </div>
//             <div>{msg.text}</div>
//             <div className="text-[10px] mt-1 opacity-70">
//               {new Date(msg.timestamp).toLocaleTimeString([], {
//                 hour: "2-digit",
//                 minute: "2-digit",
//               })}
//             </div>

//             {/* Copy Icon */}
//             <button
//               onClick={() => copyToClipboard(msg.text)}
//               className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-white bg-black/30 px-1.5 py-0.5 rounded hover:bg-black"
//               title="Copy"
//             >
//               📋
//             </button>
//           </div>
//         ))}
//         <div ref={messagesEndRef} />
//       </div>

//       {/* Input */}
//       <div className="flex gap-2">
//         <input
//           type="text"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//           onKeyDown={(e) => e.key === "Enter" && handleSend()}
//           placeholder="Ask your note..."
//           className="flex-1 border rounded px-3 py-2 dark:bg-gray-800 dark:border-gray-600 dark:text-white transition-colors"
//         />

//         <button
//           onClick={handleSend}
//           disabled={loading}
//           className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 transition-colors"
//         >
//           {loading ? (
//             <div className="flex items-center gap-2">
//               <span className="animate-bounce">🤖</span>
//               <span className="text-sm text-white/80">Thinking...</span>
//             </div>
//           ) : (
//             "Send"
//           )}
//         </button>
//       </div>
//     </div>
//   );
// }
