import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchQnADetail } from "../../api/qnaboardApi";
import api from "../../api/userApi";
import "./QnAEdit.css";

export default function QnAEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [newFiles, setNewFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const storedUser = localStorage.getItem("user");
  const loginUser = storedUser ? JSON.parse(storedUser) : null;

  // ============================
  // 상세조회 (무한호출 방지)
  // ============================
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchQnADetail(id);

        if (loginUser && loginUser.userId !== data.board.userId) {
          alert("본인 게시물만 수정할 수 있습니다.");
          navigate(`/qna/${id}`);
          return;
        }

        setTitle(data.board.title);
        setContent(data.board.content);
        setFiles(data.files || []);
      } catch (error) {
        console.error("❌ 상세 조회 실패:", error);
        alert("게시글을 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadDetail();
  }, [id]); // loginUser, navigate 제거 → 무한 호출 방지

  // 새 파일 선택
  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  // ============================
  // 수정 저장 요청
  // ============================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginUser) {
      alert("로그인이 필요합니다.");
      return;
    }

    const boardData = {
      title,
      content,
      userId: loginUser.userId, // 꼭 필요함!
    };

    const formData = new FormData();
    formData.append(
      "board",
      new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

    newFiles.forEach((file) => {
      formData.append("images", file);
    });

    try {
      await api.put(
        `/qnaboards/${id}?userId=${loginUser.userId}`, // ⭐ requestUserId 전달
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("수정이 완료되었습니다!");
      navigate(`/qna/${id}`);
    } catch (error) {
      console.error("❌ 수정 실패:", error);
      alert("수정 중 문제가 발생했습니다.");
    }
  };

  if (loading) return <div className="qna-edit-loading">불러오는 중...</div>;

  return (
    <div className="qna-edit-container">
      <h2>Q&A 수정하기</h2>

      <form onSubmit={handleSubmit} className="qna-edit-form">
        {/* 제목 */}
        <label className="qna-edit-label">제목</label>
        <input
          type="text"
          className="qna-edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        {/* 내용 */}
        <label className="qna-edit-label">내용</label>
        <textarea
          className="qna-edit-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {/* 기존 이미지 */}
        {files.length > 0 && (
          <div className="qna-edit-old-images">
            <p>📷 기존 첨부 이미지</p>
            <div className="qna-edit-old-image-list">
              {files.map((file) => {
                const folder = file.saveDir.split("uploads/qna/")[1];
                const imgUrl = `http://localhost:8080/uploads/qna/${folder}/${file.fileName}`;
                return (
                  <img
                    key={file.uuid}
                    src={imgUrl}
                    alt="old"
                    className="qna-edit-old-image"
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* 새 이미지 추가 */}
        <label className="qna-edit-label">새 첨부파일 추가</label>
        <input type="file" multiple onChange={handleFileChange} />

        {/* 버튼 */}
        <div className="qna-edit-buttons">
          <button type="button" onClick={() => navigate(`/qna/${id}`)}>
            취소
          </button>
          <button type="submit" className="qna-edit-submit">
            저장
          </button>
        </div>
      </form>
    </div>
  );
}
