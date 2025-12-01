// src/pages/community/CommunityPage.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CommunityPage.css";
import CommunityItem from "./CommunityItem";
import CommunitySidebar from "./CommunitySidebar";
import { fetchCommunityList } from "../../api/cmtboardApi";  // ✅ API 추가


export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all"); 
  const [posts, setPosts] = useState([]);             // 🔥 백엔드 데이터 저장
  const [loading, setLoading] = useState(true);       // 로딩 상태
  const [error, setError] = useState(null);           // 에러 상태
  const navigate = useNavigate();
 
  /* ================================
     🔥 커뮤니티 전체 리스트 가져오기
  ================================== */
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchCommunityList();
        setPosts(data);        // 리스트 저장
      } catch (err) {
        console.error("커뮤니티 목록 로딩 실패:", err);
        setError("데이터를 불러올 수 없습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /* ================================
     🔥 로딩 / 에러 / 빈 데이터 처리
  ================================== */
  if (loading) return <div className="community-wrapper">⏳ 불러오는 중...</div>;
  if (error) return <div className="community-wrapper">❌ {error}</div>;
  if (posts.length === 0)
    return (
      <div className="community-wrapper">
        <CommunitySidebar />
        <div className="community-main">
          <div className="top-bar">
            <div className="tab-menu">
              <button className={activeTab === "all" ? "active" : ""}>전체</button>
              <button className={activeTab === "popular" ? "active" : ""}>인기</button>
              <button className={activeTab === "new" ? "active" : ""}>최신</button>
              <button className={activeTab === "weekly" ? "active" : ""}>주간</button>
            </div>
           <button
            className="write-btn-top"
            onClick={() => navigate("/community/write")}
          >
            글쓰기
          </button>

          </div>
          <p>📭 아직 등록된 게시글이 없습니다.</p>
        </div>
      </div>
    );

  return (
    <div className="community-wrapper">
      {/* 왼쪽 사이드 메뉴 */}
      <CommunitySidebar />

      {/* 메인 콘텐츠 */}
      <div className="community-main">

        {/* 상단 탭 + 글쓰기 */}
        <div className="top-bar">
          <div className="tab-menu">
            <button
              className={activeTab === "all" ? "active" : ""}
              onClick={() => setActiveTab("all")}
            >
              전체
            </button>

            <button
              className={activeTab === "popular" ? "active" : ""}
              onClick={() => setActiveTab("popular")}
            >
              인기
            </button>

            <button
              className={activeTab === "new" ? "active" : ""}
              onClick={() => setActiveTab("new")}
            >
              최신
            </button>

            <button
              className={activeTab === "weekly" ? "active" : ""}
              onClick={() => setActiveTab("weekly")}
            >
              주간
            </button>
          </div>

          <button className="write-btn-top" onClick={() => navigate("/community/write")}>글쓰기</button>
        </div>

        {/* 🔥 실제 API 데이터로 리스트 렌더링 */}
        {posts.map((post) => (
          <CommunityItem key={post.communityBoardId} post={post} />
        ))}
      </div>
    </div>
  );
}
