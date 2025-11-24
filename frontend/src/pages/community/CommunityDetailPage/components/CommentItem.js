import { useState } from "react";

export default function CommentItem({ comment }) {
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const handleLike = () => {
    setLiked(!liked);

    if (!liked) {
      setLikes(likes + 1);
      // TODO: API 요청 (댓글 좋아요 증가)
    } else {
      setLikes(likes - 1);
      // TODO: API 요청 (댓글 좋아요 취소)
    }
  };

  return (
    <div className="comment-item">

      <div className="comment-writer">{comment.writer}</div>

      <div className="comment-content">
        {comment.content}
      </div>

      <div className="comment-bottom">
        <span className="comment-date">{comment.date}</span>

        {/* ❤️ 댓글 좋아요 버튼 */}
        <span
          className={`comment-like-btn ${liked ? "liked" : ""}`}
          onClick={handleLike}
        >
          {liked ? "❤️" : "🤍"} {likes}
        </span>
      </div>

    </div>
  );
}
