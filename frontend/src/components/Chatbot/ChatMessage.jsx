// src/components/Chatbot/ChatMessage.jsx
import React from "react";
import "./Chatbot.css";

function ChatMessage({ sender, text }) {
  return (
    <div className={`chat-message ${sender === "user" ? "user" : "bot"}`}>
      <div className="message-bubble">{text}</div>
    </div>
  );
}

export default ChatMessage;
