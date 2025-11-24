import React from "react";
import "./CommunityDetailPage.css";

import PostHeader from "./components/PostHeader";
import PostContent from "./components/PostContent";
import CommentList from "./components/CommentList";
import CommentForm from "./components/CommentForm";
import usePostDetail from "./hooks/usePostDetail";

export default function CommunityDetailPage() {
  const { post, comments, loading } = usePostDetail();

  if (loading) return <div className="detail-loading">불러오는 중...</div>;

  return (
    <div className="detail-container">
      <div className="detail-inner">

        <PostHeader post={post} />

        <PostContent content={post?.content} image={post?.image} />

        <CommentList comments={comments} />

        <CommentForm postId={post?.id} />

      </div>
    </div>
  );
}
