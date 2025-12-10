import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchQnADetail, updateQnABoard } from "../../api/qnaboardApi";
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

  // ⭐ loginUser를 안정화해서 의존성 문제 해결
  const loginUserRef = useRef(loginUser);

  /* ============================
     🔹 상세 조회
  ============================ */
  useEffect(() => {
    const loadDetail = async () => {
      try {
        const data = await fetchQnADetail(id);

        // ⭐ loginUserRef.current 사용 → 의존성 필요 없음
        if (
          loginUserRef.current &&
          loginUserRef.current.userId !== data.board.userId
        ) {
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
  }, [id, navigate]); // ⭐ navigate는 포함해도 안전함

  // 새 파일 선택
  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  /* ============================
     🔹 수정 저장 요청
  ============================ */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!loginUserRef.current) {
      alert("로그인이 필요합니다.");
      return;
    }

    const boardData = {
      title,
      content,
      userId: loginUserRef.current.userId,
    };

    try {
      await updateQnABoard(id, boardData, newFiles);

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
        <label className="qna-edit-label">제목</label>
        <input
          type="text"
          className="qna-edit-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label className="qna-edit-label">내용</label>
        <textarea
          className="qna-edit-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />

        {files.length > 0 && (
          <div className="qna-edit-old-images">
            <p>📷 기존 첨부 이미지</p>
            <div className="qna-edit-old-image-list">
              {files.map((file) => {
                const folder = file.saveDir.split("uploads/qna/")[1];
                const imgUrl = `http://13.209.6.113:8080/uploads/qna/${folder}/${file.fileName}`;
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

        <label className="qna-edit-label">새 첨부파일 추가</label>
        <input type="file" multiple onChange={handleFileChange} />

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
