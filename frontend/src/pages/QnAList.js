import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchQnAList } from "../api/qnaboardApi";
import "./QnAList.css";

function QnAList() {
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultImage = process.env.PUBLIC_URL + "/default-thumbnail.png";

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

      <div className="qna-container">
        <div className="qna-header">
          <button className="qna-write-btn" onClick={() => navigate("/qna/write")}>
            글쓰기
          </button>
        </div>

        {posts.length > 0 ? (
          <div className="qna-list">
            {posts.map((post) => {
              // 🔥 이미지가 있으면 첫 번째 이미지 URL 만들기
              let imageSrc = defaultImage;

              if (post.images && post.images.length > 0) {
                const img = post.images[0]; // 첫 이미지 사용
                imageSrc = `http://localhost:8080/uploads/qna/${img.createdDate.slice(0,10)}/${img.fileName}`;
              }

              const formattedDate = post.createdDate
                ? post.createdDate.replace("T", " ").slice(0, 16)
                : "";

              return (
                <div
                  className="qna-post"
                  key={post.qnaBoardId}
                  onClick={() => navigate(`/qna/${post.qnaBoardId}`)}
                >
                  <img src={imageSrc} alt="썸네일" className="qna-image" />

                  <div className="qna-content">
                    <h3 className="qna-title">{post.title}</h3>
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
          <p className="no-data">등록된 게시글이 없습니다 😢</p>
        )}
      </div>
    </div>
  );
}

export default QnAList;
