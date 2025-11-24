export default function CommentItem({ comment }) {
  return (
    <div className="comment-item">
      <div className="comment-writer">{comment.writer}</div>
      <div className="comment-content">{comment.content}</div>
      <div className="comment-date">{comment.date}</div>
    </div>
  );
}
