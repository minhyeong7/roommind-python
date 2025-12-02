import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQnAList } from "../../api/qnaboardApi";
import "./QnAList.css";

function QnAList() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 검색 + 정렬
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("latest");

  // 페이지네이션
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchQnAList();
        setPosts(data || []);
      } catch (error) {
        alert("❌ 게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // 검색 + 정렬 적용된 리스트
  const filteredPosts = posts
    .filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "latest") {
        return new Date(b.createdDate) - new Date(a.createdDate);
      }
      return new Date(a.createdDate) - new Date(b.createdDate);
    });

  // 전체 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);

  // 현재 페이지 데이터
  const pagePosts = filteredPosts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 검색어/정렬 변경 시 페이지 초기화
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, sortOrder]);

  if (loading) {
    return (
      <div className="qna-page">
        <h1 className="qna-title-main">Q&A 게시판</h1>
        <p className="qna-subtitle">⏳ 게시글을 불러오는 중입니다...</p>
      </div>
    );
  }

  return (
    <div className="qna-page">
      <h1 className="qna-title-main">Q&A 게시판</h1>
      <p className="qna-subtitle">💬 궁금한 점을 자유롭게 질문해보세요!</p>

      {/* 검색 + 정렬 UI */}
      <div className="qna-filter-box">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="qna-search-input"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="qna-select"
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
        >
          <option value="latest">최신순</option>
          <option value="oldest">오래된순</option>
        </select>
      </div>

      <div className="qna-container">
        <div className="qna-header">
          <button className="qna-write-btn" onClick={() => navigate("/qna/write")}>
            글쓰기
          </button>
        </div>

        {pagePosts.length > 0 ? (
          <div className="qna-list">
            {pagePosts.map((post) => {
              // 이미지 존재 여부 체크
              const hasImage = post.images && post.images.length > 0;

              let imageSrc = "";
              if (hasImage) {
                const img = post.images[0];
                imageSrc = `http://localhost:8080/uploads/qna/${img.createdDate.slice(
                  0,
                  10
                )}/${img.fileName}`;
              }

              const formattedDate = post.createdDate
                ? post.createdDate.replace("T", " ").slice(0, 16)
                : "";

              const isAnswered =
                post.answer && post.answer.trim() !== "";

              return (
                <div
                  className="qna-post"
                  key={post.qnaBoardId}
                  onClick={() => navigate(`/qna/${post.qnaBoardId}`)}
                >
                  {/* 🔥 이미지 있을 때만 렌더링 */}
                  {hasImage && (
                    <img src={imageSrc} alt="썸네일" className="qna-image" />
                  )}

                  <div className="qna-content">
                    <h3 className="qna-title">{post.title}</h3>

                    <div className="qna-status">
                      {isAnswered ? (
                        <span className="answered">답변완료</span>
                      ) : (
                        <span className="pending">답변미완료</span>
                      )}
                    </div>

                    <p className="qna-preview">{post.content}</p>

                    <div className="qna-meta">
                      <span className="qna-author">{post.userName}</span>
                      <span className="qna-date">{formattedDate}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="no-data">게시글이 없습니다 😢</p>
        )}

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              이전
            </button>

            {[...Array(totalPages)].map((_, idx) => (
              <button
                key={idx}
                className={`page-number ${currentPage === idx + 1 ? "active" : ""}`}
                onClick={() => setCurrentPage(idx + 1)}
              >
                {idx + 1}
              </button>
            ))}

            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default QnAList;
