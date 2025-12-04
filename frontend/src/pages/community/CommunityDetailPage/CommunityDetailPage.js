import React, { useEffect, useState } from "react";
import "./CommunityDetailPage.css";

import PostHeader from "./posts/PostHeader";
import PostContent from "./posts/PostContent";
import CommentList from "./comments/CommentList";
import CommentForm from "./comments/CommentForm";
import usePostDetail from "./posts/usePostDetail";

import {
  deleteCommunityBoard,
  fetchComments,
} from "../../../api/cmtboardApi";

import { useNavigate } from "react-router-dom";

export default function CommunityDetailPage() {
  const { post, files, loading } = usePostDetail();
  const [comments, setComments] = useState([]);
  const navigate = useNavigate();

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const loginUserId = storedUser?.userId;
  const isOwner = loginUserId === post?.userId;

  // 🔥 댓글 새로고침 함수 — CommentItem, CommentForm 에 모두 전달됨
  const loadComments = async () => {
    if (!post) return;
    try {
      const data = await fetchComments(post.communityBoardId);
      setComments(data);
    } catch (e) {
      console.error("댓글 로딩 실패:", e);
    }
  };

  useEffect(() => {
    if (post) loadComments();
  }, [post]);

  if (loading) return <div className="detail-loading">불러오는 중...</div>;

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

  const handleEdit = () => {
    navigate(`/community/${post.communityBoardId}/edit`);
  };

  return (
    <div className="detail-container">
      <div className="detail-inner">
        
        <PostHeader post={post} />

        <PostContent content={post.content} files={files} />

        {/* 게시글 버튼 */}
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

        {/* 댓글 영역 */}
        <div className="comment-section">

          {/* 댓글 수 */}
          <h3 className="comment-title">댓글 {comments.length}</h3>

          {/* 댓글 리스트에 loadComments 전달! */}
          <CommentList comments={comments} onUpdate={loadComments} />

          {/* 댓글 입력에 loadComments 전달 */}
          <CommentForm postId={post.communityBoardId} onAdd={loadComments} />
        </div>
      </div>
    </div>
  );
}
