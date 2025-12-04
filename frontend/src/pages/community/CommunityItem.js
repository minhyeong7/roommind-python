// src/pages/community/CommunityItem.js
import { Link } from "react-router-dom";
import "./CommunityItem.css";

export default function CommunityItem({ post }) {

  // 이미지 존재 여부
  const hasImage = post.images && post.images.length > 0;

  // 🔧 이미지 URL 생성
  const getImageUrl = () => {
    if (!hasImage) return null;

    const image = post.images[0];
    let path = image.saveDir.replace(/\\/g, "/");

    const idx = path.indexOf("uploads");
    const relative = path.substring(idx);

    return `http://localhost:8080/${relative}/${image.fileName}`;
  };

  return (
    <Link to={`/community/${post.communityBoardId}`} className="community-item-link">
      <div className="community-item">

        {/* 이미지가 있는 경우에만 렌더링 */}
        {hasImage && (
          <img 
            src={getImageUrl()} 
            alt={post.title} 
            className="item-image"
          />
        )}

        <div className="item-info" style={{ marginLeft: hasImage ? "15px" : "0" }}>
          <h3>{post.title}</h3>

          <p className="subtitle">
            {post.content.length > 30 
              ? post.content.substring(0, 30) + "..." 
              : post.content}
          </p>

          <div className="meta">
            <span>{post.userName}</span>
            <span>{post.createdDate.substring(0, 10)}</span>
            <span>조회 {post.views || 0}</span>
            <span>❤️ {post.likes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
