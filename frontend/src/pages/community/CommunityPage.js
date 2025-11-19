// src/pages/community/CommunityPage.js
import React, { useState } from "react";
import "./CommunityPage.css";
import CommunityItem from "./CommunityItem";
import CommunitySidebar from "./CommunitySidebar";

export default function CommunityPage() {
  const [activeTab, setActiveTab] = useState("all"); // 기본값 전체로 변경

  const dummyPosts = [
    {
      id: 1,
      title: "조명 입문하고 금만먹고 질렀다가 욕실 무한확장중",
      subtitle: "집 처음 꾸미는데 조명부터 넣었어요. 도움돼요!",
      writer: "오다나락",
      date: "1일 전",
      views: 82,
      likes: 14,
      image: "/images/sample1.jpg"
    },
    {
      id: 2,
      title: "털갈이하는 고양이가 있으신가요? 이불 써야해요",
      subtitle: "털땜에 이불 3개 버렸어요...",
      writer: "두현맘",
      date: "2일 전",
      views: 176,
      likes: 2,
      image: "/images/sample2.jpg"
    },
    {
      id: 3,
      title: "첫 셀프 인테리어 도전기",
      subtitle: "도배부터 장판까지 직접 해봤어요!",
      writer: "인테리러버",
      date: "3일 전",
      views: 350,
      likes: 18,
      image: "/images/sample3.jpg"
    }
  ];

  return (
    <div className="community-wrapper">

      {/* 왼쪽 사이드 메뉴 */}
      <CommunitySidebar />

      {/* 메인 콘텐츠 */}
      <div className="community-main">

        {/* 상단 탭 + 글쓰기 */}
        <div className="top-bar">

          <div className="tab-menu">

            {/* 전체 탭 추가 */}
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

          {/* 글쓰기 버튼 */}
          <button className="write-btn-top">글쓰기</button>
        </div>

        {/* 게시글 리스트 */}
        {dummyPosts.map(post => (
          <CommunityItem key={post.id} post={post} />
        ))}

      </div>
    </div>
  );
}
