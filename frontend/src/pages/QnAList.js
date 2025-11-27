import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQnAList } from "../api/qnaboardApi";
import "./QnAList.css";

function QnAList() {
  const navigate = useNavigate();

  const [posts] = useState([
    {
      id: 1,
      image: "", // 이미지 없음
      title: "가구 추천 관련 질문 있습니다.",
      content: "AI 추천이 정확하지 않은 것 같아요. 조건을 다르게 해야 할까요?",
      author: "노아",
      date: "2025-11-10 14:30",
    },
    {
      id: 2,
      image: "https://via.placeholder.com/100",
      title: "AI 인테리어 컬러 조합 문의",
      content: "방 색상이 어두운데 밝은 가구를 써도 괜찮을까요?",
      author: "윤헌",
      date: "2025-11-09 19:12",
    },
  ]);

  const defaultImage = process.env.PUBLIC_URL + "/default-thumbnail.png";

  return (
    <div className="qna-page">
      <h1 className="qna-title-main">Q&A 게시판</h1>
      <p className="qna-subtitle">💬 궁금한 점을 자유롭게 질문해보세요!</p>

      {/* 🔍 검색 + 정렬 UI */}
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
            {posts.map((post) => {
              // ✅ 미리 이미지 경로 확정 (onError 안 써도 깜빡임 없음)
              const imageSrc = post.image && post.image.trim() !== "" ? post.image : defaultImage;
              return (
                <div
                  className="qna-post"
                  key={post.qnaBoardId}
                  onClick={() => navigate(`/qna/${post.qnaBoardId}`)}
                >
                  <img src={imageSrc} alt="썸네일" className="qna-image" />

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

        {/* 📄 페이지네이션 */}
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
                className={`page-number ${
                  currentPage === idx + 1 ? "active" : ""
                }`}
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
