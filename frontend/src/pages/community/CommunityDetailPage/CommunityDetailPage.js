import React from "react";
import "./CommunityDetailPage.css";

import PostHeader from "./posts/PostHeader";
import PostContent from "./posts/PostContent";
import CommentList from "./comments/CommentList";
import CommentForm from "./comments/CommentForm";
import usePostDetail from "./posts/usePostDetail";
import { deleteCommunityBoard } from "../../../api/cmtboardApi";
import { useNavigate } from "react-router-dom";

export default function CommunityDetailPage() {
  const { post, files, loading } = usePostDetail();
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loginUserId = storedUser?.userId;

  const isOwner = loginUserId === post?.userId; // 본인 게시글 여부

  if (loading) return <div className="detail-loading">불러오는 중...</div>;

  // 🔥 삭제 처리
  const handleDelete = async () => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteCommunityBoard(post.communityBoardId);
      alert("삭제되었습니다.");
      navigate("/community");
    } catch (e) {
      alert("삭제 실패!");
    }
  };

  // 🔥 수정 페이지 이동
  const handleEdit = () => {
    navigate(`/community/${post.communityBoardId}/edit`);
  };

  return (
    <div className="detail-container">
      <div className="detail-inner">

        <PostHeader post={post} />

        {/* 🔥 버튼 영역 */}
        <div className="detail-btn-area">
          <button className="back-btn" onClick={() => navigate("/community")}>
            목록
          </button>

          {isOwner && (
            <>
              <button className="edit-btn" onClick={handleEdit}>수정</button>
              <button className="delete-btn" onClick={handleDelete}>삭제</button>
            </>
          )}
        </div>

        <PostContent content={post?.content} files={files} />

        {/* 댓글은 아직 API 없음 → 빈 배열 */}
        <CommentList comments={[]} />

        <CommentForm postId={post?.communityBoardId} />

      </div>
    </div>
  );
}
