import { useState } from "react";

export default function PostHeader({ post }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(post?.likes || 0);

  const handleLike = () => {
    setLiked(!liked);

    // ❤️ 눌렀을 때 숫자 증가/감소
    if (!liked) {
      setLikes(likes + 1);
      // TODO: API 요청 (좋아요 증가)
    } else {
      setLikes(likes - 1);
      // TODO: API 요청 (좋아요 취소)
    }
  };

  return (
    <div className="post-header">
      <h1 className="post-title">{post?.title}</h1>

      <div className="post-info">
        <span className="post-writer">{post?.writer}</span>
        <span className="post-date">{post?.date}</span>
        <span className="post-views">조회수 {post?.views}</span>

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
