import React, { useState, useRef, useEffect } from 'react';
import ChatService from './ChatService';
import './Chatbot.css';

const ChatbotUI = () => {
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [detectedImage, setDetectedImage] = useState(null);
  const [top3Images, setTop3Images] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [detectedClasses, setDetectedClasses] = useState([]);

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const addBotMessage = (text) => {
    setMessages((prev) => [...prev, { type: 'bot', text }]);
  };

  const addUserMessage = (text) => {
    setMessages((prev) => [...prev, { type: 'user', text }]);
  };

  const handleImageUpload = async () => {
    const file = fileInputRef.current?.files?.[0];

    if (!file) {
      addBotMessage('이미지를 선택해주세요!');
      return;
    }

    setIsLoading(true);
    addBotMessage('이미지를 분석 중입니다...🔍');

    const result = await ChatService.uploadAndDetect(file);

    if (result.success) {
      setDetectedImage(ChatService.getLocalFileUrl(result.uploadImage));
      setDetectedClasses(result.classes);
      setTop3Images([]);

      if (result.classes.length > 0) {
        const classList = result.classes.join(', ');
        await sendAIMessage(`이미지 분석 완료! 감지된 객체: ${classList}.\n추천받고 싶은 가구를 선택하세요.`);
      } else {
        addBotMessage('객체가 감지되지 않았습니다. 다른 이미지를 업로드해주세요.');
      }
    } else {
      addBotMessage(`오류: ${result.error}`);
    }

    setIsLoading(false);
    fileInputRef.current.value = '';
  };

  const sendAIMessage = async (message) => {
    const result = await ChatService.sendChatMessage(message);

    if (result.success) {
      addBotMessage(result.reply);

      if (result.top3?.length > 0) {
        const urls = result.top3.map((item) => ChatService.getLocalFileUrl(item.url));
        setTop3Images(urls);
      }
    } else {
      addBotMessage(`오류: ${result.error}`);
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    const msg = inputValue;
    setInputValue('');
    setIsLoading(true);

    await sendAIMessage(msg);

    setIsLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const loadTop3 = async (cls) => {
    setIsLoading(true);
    const result = await ChatService.getTop3Recommendations(cls);

    if (result.success) {
      const urls = result.top3.map((item) => ChatService.getLocalFileUrl(item.url));
      setTop3Images(urls);

      addBotMessage(`${cls} 추천 Top3입니다!`);
    } else {
      addBotMessage(`오류: ${result.error}`);
    }

    setIsLoading(false);
  };

  const openFilePicker = () => fileInputRef.current.click();

  return (
    <div className="chat-app-container">
      {/* 왼쪽 챗봇 영역 */}
      <div className="chat-section">
        <h2>인테리어 가구 추천 챗봇</h2>

        <div className="chat-container" ref={chatContainerRef}>
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.type}`}>
              {msg.text}
            </div>
          ))}

          {isLoading && (
            <div className="message bot loading">
              <span>...</span>
            </div>
          )}
        </div>

        {/* 메시지 입력창 + 이미지 버튼 */}
        <div className="chat-input-area">

          {/* 📷 이미지 업로드 버튼 (입력창 왼쪽) */}
          <div
            className="image-upload"
            onClick={openFilePicker}
            title="이미지 업로드"
          >
            업로드
          </div>

          {/* 실제 숨겨진 파일 input */}
          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleImageUpload}
          />

          <input
            type="text"
            className="chat-input"
            placeholder="메시지를 입력하세요"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
          />

          <button
            className="send-button"
            onClick={handleSendMessage}
            disabled={isLoading}
          >
            전송
          </button>
        </div>
      </div>

      {/* 오른쪽: 이미지 및 추천 패널 */}
      <div className="right-panel">
        <div className="panel-section">
          <h3>분석 이미지</h3>
          {detectedImage && (
            <img src={detectedImage} className="preview-image" alt="detected" />
          )}

          {detectedClasses.length > 0 && (
            <div className="class-buttons">
              {detectedClasses.map((cls, i) => (
                <button
                  key={i}
                  className="class-button"
                  onClick={() => loadTop3(cls)}
                >
                  {cls}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="panel-section">
          <h3>추천 Top3</h3>
          <div className="top3-area">
            {top3Images.map((url, i) => (
              <img key={i} src={url} className="recommendation-image" alt="top3" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatbotUI;
