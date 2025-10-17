import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Get JWT token from localStorage (adjust based on how you store it)
  const getUserToken = () => {
    return localStorage.getItem("token") || "";
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    // Add user message to chat
    setMessages((prev) => [...prev, { type: "user", text: userMessage }]);

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          user_token: getUserToken(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: data.response,
            action: data.action_taken,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            type: "bot",
            text: "Sorry, I encountered an error. Please try again.",
            error: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Chatbot error:", error);
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: "Unable to connect to chatbot. Make sure the chatbot server is running.",
          error: true,
        },
      ]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-80 h-96 bg-white border rounded-lg shadow-lg flex flex-col">
      {/* Header */}
      <div className="bg-blue-600 text-white p-3 rounded-t-lg">
        <h3 className="font-semibold">🤖 Paytm Assistant</h3>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 overflow-y-auto space-y-2">
        {messages.length === 0 && (
          <div className="text-gray-500 text-sm">
            👋 Hi! I can help you with your account details. Try asking:
            <br />• "What's my name?"
            <br />• "Show my username"
            <br />• "Who am I?"
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs p-2 rounded-lg text-sm ${
                message.type === "user"
                  ? "bg-blue-600 text-white"
                  : message.error
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.text}
              {message.action && (
                <div className="text-xs mt-1 opacity-70">
                  Action: {message.action}
                </div>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 p-2 rounded-lg text-sm">
              🤖 Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about your account..."
            className="flex-1 px-3 py-2 border rounded-md text-sm focus:outline-none focus:border-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={sendMessage}
            disabled={isLoading || !inputMessage.trim()}
            className="px-3 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
