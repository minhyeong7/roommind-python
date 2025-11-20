// src/pages/community/CommunityDetailPage.js
import { useParams } from "react-router-dom";

export default function CommunityDetailPage() {
  const { id } = useParams();

  return (
    <div style={{ padding: "40px" }}>
      <h1>게시글 상세페이지</h1>
      <p>게시글 ID: {id}</p>
      {/* 이 다음부터 id 기반으로 백엔드 또는 더미데이터에서 세부 내용 가져오면 됨 */}
    </div>
  );
}
