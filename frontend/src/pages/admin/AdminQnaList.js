import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";

export default function AdminQna() {
  const [qnaList, setQnaList] = useState([]);

  useEffect(() => {
    loadQna();
  }, []);

  const loadQna = async () => {
    try {
      const res = await api.get("/admin/qna");
      setQnaList(res.data);
    } catch (err) {
      console.error("문의글 로드 실패:", err);
    }
  };

  return (
    <AdminLayout>
      <div className="admin-qna-container">
        <h1>Q&A 관리 페이지</h1>

        {qnaList.length === 0 ? (
          <p>등록된 문의글이 없습니다.</p>
        ) : (
          <table className="qna-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>작성자</th>
                <th>제목</th>
                <th>등록일</th>
                <th>답변 여부</th>
              </tr>
            </thead>
            <tbody>
              {qnaList.map((q) => (
                <tr key={q.qnaId}>
                  <td>{q.qnaId}</td>
                  <td>{q.userName}</td>
                  <td>{q.title}</td>
                  <td>{q.createdDate?.slice(0, 10)}</td>
                  <td>{q.answer ? "완료" : "미답변"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
}
