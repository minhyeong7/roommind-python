import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createQnABoard } from "../api/qnaboardApi"; 
import "./QnAWrite.css";

function QnAWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    isPrivate: false,
  });

  const [images, setImages] = useState([]); // 다중 이미지

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // 🔹 이미지 파일 업로드 (여러 개)
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
  };

  // 🔹 비밀글 여부
  const handlePrivateToggle = (e) => {
    setForm({ ...form, isPrivate: e.target.checked });
  };

  // 🔥 게시글 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim()) {
      alert("제목과 내용을 입력해주세요.");
      return;
    }

    const boardData = {
      title: form.title,
      content: form.content,
      privateFlag: form.isPrivate, // 백엔드 DTO에 맞게 필요시 수정
    };

    try {
      console.log("📤 전송 데이터:", boardData, images);

      const res = await createQnABoard(boardData, images);

      alert("✅ 게시글이 등록되었습니다!");
      navigate("/qna");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      alert("❌ 등록 실패. 다시 시도해주세요.");
    }
  };

  return (
    <div className="qna-write-page">
      <h1 className="qna-write-title">Q&A 글쓰기</h1>

      <form className="qna-write-form" onSubmit={handleSubmit}>
        {/* 제목 */}
        <label>제목</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="제목을 입력하세요"
          required
        />

        {/* 내용 */}
        <label>내용</label>
        <textarea
          name="content"
          value={form.content}
          onChange={handleChange}
          placeholder="내용을 입력하세요"
          rows="8"
          required
        />

        {/* 이미지 업로드 */}
        <label>이미지 첨부 (여러 개 가능)</label>
        <input type="file" accept="image/*" multiple onChange={handleImageUpload} />

        {images.length > 0 && (
          <div className="image-preview">
            {images.map((img, idx) => (
              <img
                key={idx}
                src={URL.createObjectURL(img)}
                alt="preview"
              />
            ))}
          </div>
        )}

        {/* 비밀글 */}
        <div className="private-checkbox">
          <label>
            <input type="checkbox" checked={form.isPrivate} onChange={handlePrivateToggle} />
            비밀글로 등록하기 🔒
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="qna-write-buttons">
          <button type="submit" className="btn-primary">
            등록
          </button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("/qna")}
          >
            목록
          </button>
        </div>
      </form>
    </div>
  );
}

export default QnAWrite;
