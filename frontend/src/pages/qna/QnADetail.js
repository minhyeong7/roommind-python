import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQnADetail, deleteQnA } from "../../api/qnaboardApi";
import "./QnADetail.css";

export default function QnADetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [files, setFiles] = useState([]);

  const storedUser = localStorage.getItem("user");
  const loginUser = storedUser ? JSON.parse(storedUser) : null;

  const loadDetail = useCallback(async () => {
    try {
      const data = await fetchQnADetail(id);
      setPost(data.board);
      setFiles(data.files || []);
    } catch (error) {
      console.error("❌ 상세 조회 오류:", error);
      alert("게시글을 불러오는 중 문제가 발생했습니다.");
    }
  }, [id]);

  useEffect(() => {
    loadDetail();
  }, [loadDetail]);

  const getImageUrl = (file) => {
    if (!file) return "/default-thumbnail.png";
    const folder = file.createdDate.slice(0, 10);
    return `http://13.209.66.16:8080/uploads/qna/${folder}/${file.fileName}`;
  };

  const isOwner = loginUser && post && loginUser.userId === post.userId;

  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteQnA(id);
      alert("삭제되었습니다.");
      navigate("/qna");
    } catch (error) {
      console.error("❌ 삭제 실패:", error);
      alert("삭제 실패했습니다.");
    }
  };

  if (!post) return <div className="qna-detail-loading">불러오는 중...</div>;

  const formattedDate = post.createdDate
    ? post.createdDate.replace("T", " ").slice(0, 16)
    : "";

  const formattedAnswerDate = post.answeredDate
    ? post.answeredDate.replace("T", " ").slice(0, 16)
    : "";

  return (
    <div className="qna-detail-container">
      <div className="qna-detail-card">

        {/* 제목 */}
        <h2 className="qna-detail-title">{post.title}</h2>

        {/* 작성자 정보 */}
        <div className="qna-detail-info">
          <span>{post.userName}</span>
          <span className="dot">•</span>
          <span>{formattedDate}</span>
        </div>

        {/* 내용 */}
        <div className="qna-detail-content">{post.content}</div>

        {/* 이미지 */}
        {files.length > 0 && (
          <div className="qna-detail-images">
            {files.map((file) => (
              <img
                key={file.uuid}
                src={getImageUrl(file)}
                alt="첨부 이미지"
                className="qna-detail-img"
              />
            ))}
          </div>
        )}

        {/* 관리자 답변 */}
        {post.answer && (
          <div className="qna-admin-answer-box">
            <div className="admin-answer-title">관리자 답변</div>
            <div className="admin-answer-content">{post.answer}</div>
            <div className="admin-answer-date">답변일: {formattedAnswerDate}</div>
          </div>
        )}

        {/* 버튼 */}
        <div className="qna-detail-buttons">
          <button className="back-btn" onClick={() => navigate("/qna")}>
            목록
          </button>

          {isOwner && (
            <>
              <button
                className="edit-btn"
                onClick={() => navigate(`/qna/edit/${id}`)}
              >
                수정
              </button>
              <button className="delete-btn" onClick={handleDelete}>
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
