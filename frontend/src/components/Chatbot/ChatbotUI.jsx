// ChatbotUI.jsx
import React, { useState } from 'react';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';
import './Chatbot.css';

function ChatbotUI() {
  const [messages, setMessages] = useState([]);

  const handleSend = async (text) => {
    const userMsg = { sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);

    const res = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: text })
    });

    const data = await res.json();
    const botMsg = { sender: 'bot', text: data.reply };
    setMessages(prev => [...prev, botMsg]);
  };

  return (
    <div className="chatbot">
      <div className="chat-window">
        {messages.map((msg, i) => (
          <ChatMessage key={i} sender={msg.sender} text={msg.text} />
        ))}
      </div>
      <ChatInput onSend={handleSend} />
    </div>
  );
}

export default ChatbotUI;
