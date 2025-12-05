import React, { useState } from "react";
import ChatMessage from "./ChatMessage";
import ChatbotInput from "./ChatbotInput";
import { sendChatMessage, uploadImage } from "../../services/ChatService";
import "./Chatbot.css";

function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);   // 🔥 추가

  // 🔹 텍스트 메시지 처리
  const handleSendText = async (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);

    // 🔥 챗봇이 입력 중 표시
    setIsTyping(true);

    const res = await sendChatMessage(text);

    // typing 종료
    setIsTyping(false);

    // 기본 bot 메시지
    setMessages((prev) => [
      ...prev,
      { sender: "bot", text: res.reply }
    ]);

    if (res.top3) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", top3: res.top3 }
      ]);
    }
  };

  // 🔹 이미지 업로드 메시지 처리
  const handleSendImage = async (imageFile) => {
    setMessages((prev) => [
      ...prev,
      { sender: "user", image: URL.createObjectURL(imageFile) }
    ]);

    setIsTyping(true);  // 🔥 이미지 처리중

    const res = await uploadImage(imageFile);

    setIsTyping(false);

    if (!res || res.error) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "이미지 분석에 실패했습니다." }
      ]);
      return;
    }

    if (res.classes) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: `감지된 가구: ${res.classes.join(", ")}` }
      ]);
    }

    if (res.top3) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", top3: res.top3 }
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window">

        {messages.map((msg, idx) => (
          <ChatMessage key={idx} {...msg} />
        ))}

        {/* 🔥 챗봇 '입력 중...' 표시 */}
        {isTyping && (
          <div className="typing-indicator">
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        )}

      </div>

      <ChatbotInput 
        onSend={handleSendText}
        onImageSend={handleSendImage}
      />
    </div>
  );
}

export default ChatbotUI;
