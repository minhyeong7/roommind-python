import { useState } from "react";
import { updateComment, deleteComment } from "../../../../api/cmtboardApi";

export default function CommentItem({ comment, onUpdate }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const loginUserId = user?.userId;

  const isOwner = loginUserId === comment.userId;

  /* 좋아요 */
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState(comment.likes || 0);

  const handleLike = () => {
    const newState = !liked;
    setLiked(newState);
    setLikes(prev => (newState ? prev + 1 : prev - 1));
  };

  /* 수정 */
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const handleSave = async () => {
    try {
      await updateComment(comment.commentId, { content: editContent });
      alert("댓글이 수정되었습니다.");
      setEditing(false);
      onUpdate();
    } catch (e) {
      console.error(e);
      alert("댓글 수정 실패!");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("댓글을 삭제할까요?")) return;
    try {
      await deleteComment(comment.commentId);
      alert("삭제되었습니다.");
      onUpdate();
    } catch (e) {
      alert("댓글 삭제 실패!");
    }
  };

  /* 수정됨 여부 판단 */
  const isEdited =
    comment.updatedDate &&
    comment.updatedDate !== comment.createdDate;

  return (
    <div className="comment-item">
      <div className="comment-writer">{comment.userName}</div>

      {/* 수정 중 */}
      {editing ? (
        <textarea
          className="comment-edit-area"
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
        />
      ) : (
        <div className="comment-content">
          {comment.content}{" "}
          {isEdited && <span className="edited-tag">(수정됨)</span>}
        </div>
      )}

      <div className="comment-bottom">
        
        {/* 날짜 + 좋아요 묶음 */}
        <div className="comment-left">
          <span className="comment-date">
            {comment.createdDate?.split("T")[0]}
          </span>

          <span
            className={`comment-like-btn ${liked ? "liked" : ""}`}
            onClick={handleLike}
          >
            {liked ? "❤️" : "🤍"} {likes}
          </span>
        </div>

        {/* 수정 / 삭제 */}
        {isOwner && (
          <div className="comment-actions">
            {editing ? (
              <>
                <button className="comment-save-btn" onClick={handleSave}>
                  저장
                </button>
                <button
                  className="comment-cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setEditContent(comment.content);
                  }}
                >
                  취소
                </button>
              </>
            ) : (
              <>
                <button
                  className="comment-edit-btn"
                  onClick={() => setEditing(true)}
                >
                  수정
                </button>
                <button className="comment-delete-btn" onClick={handleDelete}>
                  삭제
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
