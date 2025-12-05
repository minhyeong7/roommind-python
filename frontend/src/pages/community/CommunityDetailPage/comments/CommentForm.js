import { useState } from "react";
import { createComment } from "../../../../api/cmtboardApi";

export default function CommentForm({ postId, onAdd }) {
  const [content, setContent] = useState("");

  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("댓글을 입력하세요.");
      return;
    }

    try {
      await createComment(postId, { content }); 
      alert("댓글이 등록되었습니다!");
      setContent("");
      onAdd(); // 댓글 목록 새로고침
    } catch (e) {
      alert("댓글 등록 실패!");
      console.error(e);
    }
  };

  return (
    <div className="comment-form">
      <textarea
        placeholder="댓글을 작성해주세요"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <button onClick={handleSubmit}>등록</button>
    </div>
  );
}
