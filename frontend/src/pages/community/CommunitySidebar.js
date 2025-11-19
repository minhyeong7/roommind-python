// src/pages/community/CommunitySidebar.js
import React, { useState } from "react";
import "./CommunityPage.css";

export default function CommunitySidebar() {
  const [open, setOpen] = useState(true);

  return (
    <aside className="community-sidebar">
      {/* 상단 제목 + 화살표 */}
      <div className="sidebar-top" onClick={() => setOpen(!open)}>
        <h3 className="sidebar-title">커뮤니티</h3>
      </div>

      {open && (
        <ul className="sidebar-menu">
          <li>홈</li>
          <li>집들이</li>
          <li>노하우</li>
          <li>질문과 답변</li>
          <li>DIY & 셀프인테리어</li>
          <li>반려동물 공간</li>
          <li>인테리어 사진</li>
        </ul>
      )}
    </aside>
  );
}
