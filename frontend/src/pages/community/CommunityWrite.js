import React, { useState } from "react";
import "./CommunityWrite.css";

export default function CommunityWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("글쓰기 테스트 - 나중에 API 연결하면 됨!");
  };

  return (
    <div className="write-container">
      <h2>✏️ 커뮤니티 글쓰기</h2>

      <form className="write-form" onSubmit={handleSubmit}>
        <input
          type="text"
          className="write-title"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="write-content"
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        <div className="write-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={() => window.history.back()}
          >
            취소
          </button>

          <button type="submit" className="submit-btn">
            등록하기
          </button>
        </div>
      </form>
    </div>
  );
}
