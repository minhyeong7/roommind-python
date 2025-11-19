// src/pages/community/CommunityItem.js
import React from "react";

export default function CommunityItem({ post }) {
  return (
    <div className="community-item">
      <div className="item-info">
        <h3 className="item-title">{post.title}</h3>
        <p className="item-sub">{post.subtitle}</p>

        <div className="item-meta">
          <span>{post.writer}</span>
          <span>· {post.date}</span>
          <span>· 조회 {post.views}</span>
          <span>· ❤ {post.likes}</span>
        </div>
      </div>

      <img src={post.image} alt="" className="item-img" />
    </div>
  );
}
