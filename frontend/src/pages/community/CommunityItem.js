// src/pages/community/CommunityItem.js
import { Link } from "react-router-dom";
import "./CommunityItem.css";

export default function CommunityItem({ post }) {
  return (
    <Link to={`/community/${post.id}`} className="community-item-link">
      <div className="community-item">
        <img src={post.image} alt={post.title} className="item-image" />

        <div className="item-info">
          <h3>{post.title}</h3>
          <p className="subtitle">{post.subtitle}</p>

          <div className="meta">
            <span>{post.writer}</span>
            <span>{post.date}</span>
            <span>조회 {post.views}</span>
            <span>❤️ {post.likes}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
