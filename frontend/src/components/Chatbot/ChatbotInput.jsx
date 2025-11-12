// src/components/Chatbot/ChatbotInput.jsx
import React, { useState } from "react";
import "./Chatbot.css";

function ChatbotInput({ onSend }) {
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="chat-input-container">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
      />
      <button onClick={handleSend} className="send-btn">전송</button>
    </div>
  );
}

export default ChatbotInput;
