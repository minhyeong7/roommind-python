// src/pages/community/CommunityWrite.js
import React, { useState } from "react";
import "./CommunityWrite.css";
import { useNavigate } from "react-router-dom";

export default function CommunityWrite() {
  const navigate = useNavigate();

  // 🔥 로그인 사용자 정보 불러오기
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("폼 제출 기능은 백엔드 연결 후 구현됩니다!");
  };

  return (
    <div className="cmt-write-container">
      <div className="cmt-write-box">

        {/* 제목 */}
        <h2 className="cmt-write-title">✏️ 커뮤니티 글쓰기</h2>

        {/*  작성자 이름/이메일 표시 */}
        <div className="cmt-writer-info">
          작성자 : <strong>{user?.username || user?.email || "로그인 필요"}</strong>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 제목 입력 */}
          <input
            className="cmt-input-title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* 내용 입력 */}
          <textarea
            className="cmt-input-content"
            placeholder="내용을 입력하세요"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />

          {/* 파일 업로드 */}
          <div className="cmt-file-box">
            <label className="cmt-file-label">파일 업로드</label>
            <input
              type="file"
              multiple
              onChange={handleFileChange}
              className="cmt-file-input"
            />
          </div>

          {/* 버튼 영역 */}
          <div className="cmt-btn-box">
            <button
              type="button"
              className="cmt-cancel-btn"
              onClick={() => navigate("/community")}
            >
              취소
            </button>

            <button type="submit" className="cmt-submit-btn">
              등록하기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
