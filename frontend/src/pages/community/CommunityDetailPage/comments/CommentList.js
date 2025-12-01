import CommentItem from "./CommentItem";

export default function CommentList({ comments }) {
  return (
    <div className="comment-section">
      <h3>댓글 {comments?.length || 0}</h3>

      <div className="comment-list">
        {comments?.map((c) => (
          <CommentItem key={c.id} comment={c} />
        ))}
      </div>
    </div>
  );
}
