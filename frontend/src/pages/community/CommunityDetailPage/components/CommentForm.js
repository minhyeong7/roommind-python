import { useState } from "react";

export default function CommentForm({ postId }) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim()) return;
    alert("댓글 작성 로직 연결 예정!");
    setText("");
  };

  return (
    <div className="comment-form">
      <textarea
        placeholder="댓글을 작성해주세요"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}
