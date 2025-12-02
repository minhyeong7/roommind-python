import React, { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import { useNavigate } from "react-router-dom";
import "./AdminQnaList.css";

export default function AdminQnaList() {
  const navigate = useNavigate();

  const [qnaList, setQnaList] = useState([]);

  // 검색 관련
  const [search, setSearch] = useState("");
  const [searchOption, setSearchOption] = useState("all"); 
  // all / title / writer / content

  // 필터/정렬
  const [statusFilter, setStatusFilter] = useState(""); // all, answered, pending
  const [sort, setSort] = useState("latest"); // latest, oldest

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

  // ============================
  // 검색 조건 적용 함수
  // ============================
  const matchSearch = (q) => {
    const keyword = search.toLowerCase();

    if (searchOption === "title") {
      return q.title.toLowerCase().includes(keyword);
    }

    if (searchOption === "writer") {
      return q.userName.toLowerCase().includes(keyword);
    }

    if (searchOption === "content") {
      return q.content.toLowerCase().includes(keyword);
    }

    // all
    return (
      q.title.toLowerCase().includes(keyword) ||
      q.userName.toLowerCase().includes(keyword) ||
      q.content.toLowerCase().includes(keyword)
    );
  };

  // ============================
  // 전체 필터링/정렬 적용
  // ============================
  const filteredList = qnaList
    .filter((q) => matchSearch(q))
    .filter((q) =>
      statusFilter === "answered"
        ? q.answer
        : statusFilter === "pending"
        ? !q.answer
        : true
    )
    .sort((a, b) => {
      if (sort === "latest") return b.qnaBoardId - a.qnaBoardId;
      if (sort === "oldest") return a.qnaBoardId - b.qnaBoardId;
      return 0;
    });

  return (
    <AdminLayout>
      <div className="admin-qna-container">
        <div className="admin-qna-inner">

          <h1>Q&A 관리 페이지</h1>

          {/* ================= 필터 박스 ================= */}
          <div className="admin-qna-filter-box">

            {/* 검색어 */}
            <input
              type="text"
              placeholder="검색어 입력"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {/* 검색 옵션 */}
            <select
              value={searchOption}
              onChange={(e) => setSearchOption(e.target.value)}
            >
              <option value="all">전체 (제목 + 작성자 + 내용)</option>
              <option value="title">제목만</option>
              <option value="writer">작성자만</option>
              <option value="content">내용만</option>
            </select>

            {/* 정렬 */}
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              <option value="latest">최신순</option>
              <option value="oldest">오래된순</option>
            </select>

            {/* 답변여부 필터 */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">전체 상태</option>
              <option value="answered">답변 완료</option>
              <option value="pending">미답변</option>
            </select>
          </div>

          {/* ================= 테이블 ================= */}
          <div className="admin-qna-table-wrapper">
            <table className="admin-qna-table">
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
                {filteredList.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="admin-qna-empty">
                      조건에 맞는 문의글이 없습니다.
                    </td>
                  </tr>
                ) : (
                  filteredList.map((q) => (
                    <tr key={q.qnaBoardId}>
                      <td>{q.qnaBoardId}</td>
                      <td>{q.userName}</td>

                      <td
                        className="admin-qna-title-link"
                        onClick={() => navigate(`/admin/qna/${q.qnaBoardId}`)}
                      >
                        {q.title}
                      </td>

                      <td>{q.createdDate?.slice(0, 10)}</td>

                      <td>
                        {q.answer ? (
                          <span className="admin-qna-status done">완료</span>
                        ) : (
                          <span className="admin-qna-status pending">미답변</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}
