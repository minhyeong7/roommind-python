// src/components/Chatbot/ChatMessage.jsx
import React from "react";

function ChatMessage({ sender, text, image, top3 }) {
  return (
    <div className={`chat-message ${sender}`}>

      {/* 🔹 말풍선 박스 */}
      <div className="message-bubble">
        
        {/* 🔸 텍스트 (HTML 태그 적용) */}
        {text && (
          <div
            dangerouslySetInnerHTML={{ __html: text }}
          ></div>
        )}

        {/* 🔸 사용자가 업로드한 이미지 */}
        {image && (
          <img
            src={image}
            alt="user upload"
            className="chat-image"
          />
        )}

        {/* 🔸 추천 Top3 이미지 */}
        {top3 && (
          <div className="top3-box">
            {top3.map((item, idx) => (
              <img
                key={idx}
                src={`http://localhost:5000${item.url}`}
                alt={`top3-${idx}`}
                className="top3-image"
              />
            ))}
          </div>
        )}
      </div>

    </div>
  );
}

export default ChatMessage;
