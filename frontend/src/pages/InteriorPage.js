// src/pages/InteriorPage.js
import React from "react";
import ChatbotUI from "../components/Chatbot/ChatbotUI";
import "./InteriorPage.css"; // 스타일 별도 파일 추가

function InteriorPage() {
  return (
    <div className="interior-page">
      {/* ✅ 상단 안내 배너 */}
      <div className="interior-header">
        <h1 className="interior-title">AI 인테리어 추천 CHATBOT</h1>
        <p className="interior-desc">
          나만의 공간을 AI에게 맡겨보세요!<br />
          당신의 취향, 방 구조, 분위기에 맞는 인테리어를 분석하고 추천합니다 💡
        </p>
      </div>

      {/* ✅ 챗봇 본체 */}
      <div className="interior-chatbox">
        <ChatbotUI />
      </div>
    </div>
  );
}

export default InteriorPage;
