import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import "./AdminQnaDetail.css";

export default function AdminQnaDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [qna, setQna] = useState(null);
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    loadDetail();
  }, []);

  const loadDetail = async () => {
    try {
      const res = await api.get(`/admin/qna/${id}`);
      setQna(res.data);
      setAnswer(res.data.answer || "");
    } catch (err) {
      console.error("QnA 상세 로드 실패:", err);
    }
  };

  const handleSave = async () => {
    try {
      await api.put(`/admin/qna/${id}/answer`, { answer });
      alert("답변이 저장되었습니다.");
      navigate("/admin/qna");
    } catch (err) {
      console.error("답변 저장 실패:", err);
    }
  };

  if (!qna) return <AdminLayout>로딩중...</AdminLayout>;

  return (
    <AdminLayout>
      <div className="admin-qna-detail">

        <h1 className="page-title">Q&A 상세</h1>

        {/* ====== 정보 박스 ====== */}
        <div className="detail-card">
          <div className="info-row"><strong>ID:</strong> {qna.qnaBoardId}</div>
          <div className="info-row"><strong>작성자:</strong> {qna.userName} ({qna.email})</div>
          <div className="info-row"><strong>등록일:</strong> {qna.createdDate?.slice(0, 10)}</div>
          {qna.answeredDate && (
            <div className="info-row"><strong>답변일:</strong> {qna.answeredDate.replace("T", " ").slice(0, 16)}</div>
          )}
        </div>

        {/* ====== 문의 내용 박스 ====== */}
        <div className="detail-card">
          <div className="section">
            <div className="section-title">제목</div>
            <div className="section-text">{qna.title}</div>
          </div>

          <div className="section">
            <div className="section-title">문의 내용</div>
            <div className="section-text content-area">{qna.content}</div>
          </div>
        </div>

        {/* ====== 관리자 답변 박스 ====== */}
        <div className="detail-card">
          <div className="section-title">관리자 답변</div>
          <textarea
            className="answer-input"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="답변을 입력하세요..."
          />
        </div>

        {/* ====== 버튼 영역 ====== */}
        <div className="btn-area">
          <button className="save-btn" onClick={handleSave}>답변 저장</button>
          <button className="back-btn" onClick={() => navigate("/admin/qna")}>목록으로</button>
        </div>
      </div>
    </AdminLayout>
  );
}
