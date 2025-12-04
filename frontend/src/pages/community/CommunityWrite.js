// src/pages/community/CommunityWrite.js
import React, { useState } from "react";
import "./CommunityWrite.css";
import { useNavigate } from "react-router-dom";
import { createCommunityBoard } from "../../api/cmtboardApi";   // 🔥 API 연결

export default function CommunityWrite() {
  const navigate = useNavigate();

  // 🔥 로그인 사용자 정보
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);

  const handleFileChange = (e) => {
    setFiles([...e.target.files]);
  };

  /* ============================
      🔥 폼 제출 → API 요청
  ============================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 백엔드가 요구하는 JSON 형식
    const boardData = {
      title,
      content,
      userId: user.userId, // 로그인되어 있는 유저 ID 사용
    };

    try {
      await createCommunityBoard(boardData, files); // 🔥 API 호출
      alert("게시글이 등록되었습니다!");
      navigate("/community");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("게시글 등록 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="cmt-write-container">
      <div className="cmt-write-box">
        <h2 className="cmt-write-title">✏️ 커뮤니티 글쓰기</h2>

        <div className="cmt-writer-info">
          작성자 : <strong>
            {user?.userName || user?.username || user?.email || "로그인 필요"}
          </strong>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 제목 */}
          <input
            className="cmt-input-title"
            type="text"
            placeholder="제목을 입력하세요"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          {/* 내용 */}
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

          {/* 버튼 */}
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
