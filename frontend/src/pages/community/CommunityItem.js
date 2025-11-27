// src/pages/community/CommunityItem.js
import { Link } from "react-router-dom";
import "./CommunityItem.css";

export default function CommunityItem({ post }) {

  // 🔧 이미지 URL 만들기 함수
  const getImageUrl = () => {
    if (!post.images || post.images.length === 0) return "/images/no-image.png";

    const image = post.images[0];

    // 역슬래시 → 슬래시
    let path = image.saveDir.replace(/\\/g, "/");

    // uploads 기준 상대경로 추출
    const idx = path.indexOf("uploads");
    const relative = path.substring(idx);

    return `http://localhost:8080/${relative}/${image.fileName}`;
  };

  return (
    <Link to={`/community/${post.communityBoardId}`} className="community-item-link">
      <div className="community-item">

        {/* 🔥 실제 이미지 표시 */}
        <img 
          src={getImageUrl()} 
          alt={post.title} 
          className="item-image" 
        />

        <div className="item-info">
          <h3>{post.title}</h3>

          {/* subtitle 없음 → content의 앞부분 잘라서 표현 */}
          <p className="subtitle">
            {post.content.length > 30 
              ? post.content.substring(0, 30) + "..." 
              : post.content}
          </p>

          <div className="meta">
            <span>{post.userName}</span>

            {/* 날짜 포맷 */}
            <span>{post.createdDate.substring(0, 10)}</span>

            {/* 백엔드에 조회수/좋아요 없음 → 임시로 0 */}
            <span>조회 {post.views || 0}</span>
            <span>❤️ {post.likes || 0}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
