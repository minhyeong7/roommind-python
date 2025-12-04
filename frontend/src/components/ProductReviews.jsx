import React, { useEffect, useState } from "react";
import {
  getReviewsByProduct,
  createReview,
  updateReview,
  deleteReview
} from "../api/reviewApi";
import "./ProductReviews.css";

function ProductReviews({ productId }) {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.userId;

  const [reviews, setReviews] = useState([]);
  const [sortType, setSortType] = useState("latest");
  const [filterStar, setFilterStar] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  /** 작성 박스 상태 */
  const [showCreateBox, setShowCreateBox] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newContent, setNewContent] = useState("");

  /** 수정 박스 상태 */
  const [editReviewId, setEditReviewId] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    if (!productId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getReviewsByProduct(productId);
        setReviews(data);
      } catch {
        setError("리뷰 불러오기 실패");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [productId]);

  const reload = async () => {
    const data = await getReviewsByProduct(productId);
    setReviews(data);
  };

  /** 리뷰 작성 */
  const handleCreateReview = async () => {
    try {
      await createReview({
        productId,
        rating: newRating,
        content: newContent
      });

      alert("리뷰가 등록되었습니다.");
      setShowCreateBox(false);
      setNewContent("");
      setNewRating(5);

      reload();
    } catch (err) {
      alert(err.response?.data?.message || "리뷰 등록 실패");
    }
  };

  /** 리뷰 수정 박스 열기 */
  const openEditBox = (review) => {
    setEditReviewId(review.reviewId);
    setEditRating(review.rating);
    setEditContent(review.content);
  };

  /** 리뷰 수정 */
  const handleEditReview = async () => {
    try {
      await updateReview(editReviewId, {
        rating: editRating,
        content: editContent
      });

      alert("리뷰가 수정되었습니다.");
      setEditReviewId(null);
      reload();
    } catch (err) {
      alert(err.response?.data?.message || "리뷰 수정 실패");
    }
  };

  /** 리뷰 삭제 */
  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;

    try {
      await deleteReview(reviewId);
      reload();
    } catch (err) {
      alert(err.response?.data?.message || "리뷰 삭제 실패");
    }
  };

  const sorted = [...reviews]
    .filter((r) => (filterStar ? r.rating === Number(filterStar) : true))
    .sort((a, b) =>
      sortType === "latest"
        ? new Date(b.createdDate) - new Date(a.createdDate)
        : b.rating - a.rating
    );

  if (loading) return <div>⏳ 불러오는 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="review-wrap">

      {/* 리뷰 작성 버튼 */}
      {currentUserId && (
        <button
          className="review-create-btn"
          onClick={() => setShowCreateBox(!showCreateBox)}
        >
          {showCreateBox ? "작성 취소" : "리뷰 작성하기"}
        </button>
      )}

      {/* =========================== */}
      {/* 리뷰 작성 박스 */}
      {/* =========================== */}
      {showCreateBox && (
        <div className="review-box write-box">
          <h4>리뷰 작성</h4>

          <div>
            별점:
            <select
              value={newRating}
              onChange={(e) => setNewRating(Number(e.target.value))}
            >
              <option value={5}>★ 5점</option>
              <option value={4}>★ 4점</option>
              <option value={3}>★ 3점</option>
              <option value={2}>★ 2점</option>
              <option value={1}>★ 1점</option>
            </select>
          </div>

          <textarea
            placeholder="내용을 입력하세요"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
          />

          <button onClick={handleCreateReview}>등록</button>
        </div>
      )}

      {/* 정렬 / 필터 */}
      <div className="review-sort-area">
        <button
          className={sortType === "latest" ? "active" : ""}
          onClick={() => setSortType("latest")}
        >
          최신순
        </button>
        <button
          className={sortType === "best" ? "active" : ""}
          onClick={() => setSortType("best")}
        >
          별점순
        </button>

        <select
          value={filterStar}
          onChange={(e) => setFilterStar(e.target.value)}
        >
          <option value="">별점 전체</option>
          <option value="5">★ 5점</option>
          <option value="4">★ 4점</option>
          <option value="3">★ 3점</option>
          <option value="2">★ 2점</option>
          <option value="1">★ 1점</option>
        </select>
      </div>

      {/* =========================== */}
      {/* 리뷰 목록 */}
      {/* =========================== */}
      {sorted.map((review) => (
        <div className="review-box" key={review.reviewId}>
          <div className="review-header">
            <strong>User {review.userId}</strong>
            {" "}<span>{"★".repeat(review.rating)}</span>
            {" "}<span>{new Date(review.createdDate).toLocaleDateString()}</span>
          </div>

          <div className="review-text">{review.content}</div>

          {/* 본인 리뷰일 때만 표시 */}
          {currentUserId === review.userId && (
            <div className="review-btn-group">
              <button onClick={() => openEditBox(review)}>수정</button>
              <button className="delete" onClick={() => handleDeleteReview(review.reviewId)}>
                삭제
              </button>
            </div>
          )}

          {/* 수정 박스 */}
          {editReviewId === review.reviewId && (
            <div className="edit-box">
              <h4>리뷰 수정</h4>

              <div>
                별점:
                <select
                  value={editRating}
                  onChange={(e) => setEditRating(Number(e.target.value))}
                >
                  <option value={5}>★ 5점</option>
                  <option value={4}>★ 4점</option>
                  <option value={3}>★ 3점</option>
                  <option value={2}>★ 2점</option>
                  <option value={1}>★ 1점</option>
                </select>
              </div>

              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
              />

              <button onClick={handleEditReview}>수정 완료</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default ProductReviews;
