// src/components/Chatbot/ChatbotUI.jsx
import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatbotInput from "./ChatbotInput";
import { sendChatMessage } from "../../services/ChatService";
import "./Chatbot.css";

function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (text) => {
    if (!text.trim()) return;

    // 사용자 메시지 추가
    const userMsg = { sender: "user", text };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    const reply = await sendChatMessage(text); // Flask 서버 호출
    const botMsg = { sender: "bot", text: reply };

    setMessages((prev) => [...prev, botMsg]);
    setLoading(false);
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
        {loading && <div className="loading">답변 생성 중...</div>}
      </div>

      <ChatbotInput onSend={handleSend} />
    </div>
  );
}

export default ChatbotUI;
