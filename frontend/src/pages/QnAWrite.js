import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./QnAWrite.css";

function QnAWrite() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    content: "",
    author: "",
    image: null, // ✅ 파일 객체
    isPrivate: false, // ✅ 비밀글 여부
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // ✅ 이미지 파일 업로드
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) setForm({ ...form, image: file });
  };

  // ✅ 비밀글 설정
  const handlePrivateToggle = (e) => {
    setForm({ ...form, isPrivate: e.target.checked });
  };

  // ✅ 제출
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.content.trim() || !form.author.trim()) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // ✅ 서버에 보낼 FormData 구성 (백엔드에서 createdAt 자동 생성)
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("content", form.content);
    formData.append("author", form.author);
    formData.append("isPrivate", form.isPrivate);
    if (form.image) formData.append("image", form.image);

    console.log("📤 서버로 전송될 데이터:", form);

    // 실제 API 요청 예시 (백엔드 연결 시)
    // axios.post("/api/qna", formData);

    alert("✅ 게시글이 등록되었습니다!");
    navigate("/qna");
  };

  return (
    <div className="qna-write-page">
      <h1 className="qna-write-title">Q&A 글쓰기</h1>

      <form className="qna-write-form" onSubmit={handleSubmit}>
        {/* 작성자 */}
        <label>작성자</label>
        <input
          type="text"
          name="author"
          value={form.author}
          onChange={handleChange}
          placeholder="작성자 이름을 입력하세요"
          required
        />

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

        {/* ✅ 이미지 첨부 */}
        <label>이미지 첨부</label>
        <input type="file" accept="image/*" onChange={handleImageUpload} />

        {form.image && (
          <div className="image-preview">
            <img src={URL.createObjectURL(form.image)} alt="미리보기" />
          </div>
        )}

        {/* ✅ 비밀글 설정 */}
        <div className="private-checkbox">
          <label>
            <input
              type="checkbox"
              checked={form.isPrivate}
              onChange={handlePrivateToggle}
            />
            비밀글로 등록하기 🔒
          </label>
        </div>

        {/* 버튼 영역 */}
        <div className="qna-write-buttons">
          <button type="submit" className="btn-primary">등록</button>
          <button
            type="button"
            className="btn-outline"
            onClick={() => navigate("/qna")}
          >
            목록
          </button>
          <button
            type="button"
            className="btn-outline edit"
            onClick={() => alert("✏️ 수정 기능은 서버 연결 후 활성화 예정")}
          >
            수정
          </button>
          <button
            type="button"
            className="btn-outline delete"
            onClick={() => alert("🗑️ 삭제 기능은 서버 연결 후 활성화 예정")}
          >
            삭제
          </button>
        </div>
      </form>
    </div>
  );
}

export default QnAWrite;
