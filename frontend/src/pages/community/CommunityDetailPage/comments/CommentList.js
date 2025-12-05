import React from "react";
import CommentItem from "./CommentItem";

export default function CommentList({ comments, onUpdate }) {
  return (
    <div className="comment-list">
      {comments.length === 0 ? (
        <p>등록된 댓글이 없습니다.</p>
      ) : (
        comments.map((comment) => (
          <CommentItem
            key={comment.commentId}
            comment={comment}
            onUpdate={onUpdate}   // 수정/삭제 후 목록 새로고침
          />
        ))
      )}
    </div>
  );
}
