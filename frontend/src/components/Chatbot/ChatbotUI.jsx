import React, { useRef, useState } from "react";
import { detectImage, sendChat, getImageUrl } from "./ChatService";
import "./Chatbot.css";

export default function ChatbotUI() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [detectedImg, setDetectedImg] = useState("");
  const [top3, setTop3] = useState([]);

  const fileRef = useRef();

  const addBot = (text) => {
    setMessages((prev) => [...prev, { sender: "bot", text }]);
  };

  const addUser = (text) => {
    setMessages((prev) => [...prev, { sender: "user", text }]);
  };

  // ✅ 챗 전송
  const sendMessage = async () => {
    if (!input.trim()) return;

    addUser(input);
    const userText = input;
    setInput("");

    const data = await sendChat(userText);
    addBot(data.reply);

    if (data.top3) {
      setTop3(data.top3);
    }
  };

  // ✅ 이미지 업로드
  const uploadImage = async () => {
    const file = fileRef.current.files[0];
    if (!file) {
      addBot("이미지를 선택해주세요!");
      return;
    }

    addBot("이미지를 분석 중입니다... 🔍");

    const data = await detectImage(file);
    setDetectedImg(getImageUrl(data.upload_image));
    setTop3([]);

    if (data.classes?.length > 0) {
      const clsList = data.classes.join(", ");
      sendMessageToAI(
        `이미지 분석 완료. 감지된 객체: ${clsList}. 어떤 가구를 추천받고 싶나요?`
      );
    } else {
      addBot("객체가 감지되지 않았습니다. 다른 이미지를 업로드해주세요.");
    }
  };

  // ✅ 내부 AI 호출용
  const sendMessageToAI = async (msg) => {
    const data = await sendChat(msg);
    addBot(data.reply);

    if (data.top3) {
      setTop3(data.top3);
    }
  };

  return (
    <div className="chat-layout">
      {/* ✅ 왼쪽 챗봇 */}
      <div>
        <h2>인테리어 가구 추천 챗봇</h2>

        <div className="chatContainer">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.sender}`}>
              {m.text}
            </div>
          ))}
        </div>

        <div className="chatInputArea">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="메시지를 입력하세요"
          />
          <button onClick={sendMessage}>전송</button>
        </div>
      </div>

      {/* ✅ 오른쪽 패널 */}
      <div className="rightPanel">
        <h3>이미지 업로드</h3>
        <input type="file" ref={fileRef} />
        <button onClick={uploadImage}>업로드</button>

        <h3>분석 이미지</h3>
        {detectedImg && <img src={detectedImg} alt="detected" />}

        <h3>추천 Top3</h3>
        <div>
          {top3.map((item, i) => (
            <img
              key={i}
              src={getImageUrl(item.url)}
              alt="추천"
              style={{ maxHeight: 200, margin: 10 }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
