import React, { useState } from "react";
import "./Chatbot.css";
import { BsImage, BsSend } from "react-icons/bs"; // 아이콘 사용

function ChatbotInput({ onSend, onImageSend }) {
  const [input, setInput] = useState("");
  const [image, setImage] = useState(null);

  // 전송 버튼 클릭
  const handleSend = () => {
    if (!input.trim() && !image) return;
    if (image) {
      onImageSend && onImageSend(image);
      setImage(null);
    }
    if (input.trim()) {
      onSend(input);
      setInput("");
    }
  };

  // Enter 키 전송
  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  // 이미지 업로드
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };

  return (
    <div className="chat-input-container">
      <label className="image-upload">
        <BsImage />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: "none" }}
        />
      </label>

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="메시지를 입력하세요..."
      />

      <button onClick={handleSend} className="send-btn">
        <BsSend />
      </button>

      {/* 이미지 미리보기 */}
      {image && (
        <div className="image-preview">
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
            className="preview-img"
          />
          <button onClick={() => setImage(null)} className="cancel-btn">
            ✕
          </button>
        </div>
      )}
    </div>
  );
}

export default ChatbotInput;
