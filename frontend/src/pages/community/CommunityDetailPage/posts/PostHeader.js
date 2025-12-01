import { useState } from "react";

export default function PostHeader({ post }) {
  // 백엔드에 likes, views가 없으므로 기본값 0 처리
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);
  const [views] = useState(post?.views || 0); // 조회수 기능 아직 없음

  const handleLike = () => {
    setLiked(!liked);

    if (!liked) {
      setLikes(likes + 1);
      // TODO: 백엔드 좋아요 증가 API 호출
    } else {
      setLikes(likes - 1);
      // TODO: 백엔드 좋아요 취소 API 호출
    }
  };

  // 날짜 형식 변환
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.replace("T", " ").slice(0, 16);
  };

  return (
    <div className="post-header">
      <h1 className="post-title">{post?.title}</h1>

      <div className="post-info">
        <span className="post-writer">{post?.userName}</span>
        <span className="post-date">{formatDate(post?.createdDate)}</span>
        <span className="post-views">조회수 {views}</span>

        {/* ❤️ 좋아요 버튼 */}
        <span
          className={`post-like-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </span>
      </div>
    </div>
  );
}
