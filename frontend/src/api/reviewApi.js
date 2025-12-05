// src/api/reviewApi.js
import api from "./header";

/** ======================================
 * JWT 토큰 자동 포함
 * ====================================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/** ======================================
 * 1. 상품별 리뷰 조회
 * GET /api/reviews/{productId}
 * ====================================== */
export const getReviewsByProduct = async (productId) => {
  const res = await api.get(`/reviews/${productId}`);
  return res.data;
};

/** ======================================
 * 2. 리뷰 작성
 * POST /api/reviews
 * dto: { productId, rating, content }
 * ====================================== */
export const createReview = async (dto) => {
  const res = await api.post(`/reviews`, dto);
  return res.data;
};

/** ======================================
 * 3. 리뷰 수정
 * PUT /api/reviews/{reviewId}
 * dto: { rating, content, productId(optional) }
 * ====================================== */
export const updateReview = async (reviewId, dto) => {
  const res = await api.put(`/reviews/${reviewId}`, dto);
  return res.data;
};

/** ======================================
 * 4. 리뷰 삭제
 * DELETE /api/reviews/{reviewId}
 * ====================================== */
export const deleteReview = async (reviewId) => {
  const res = await api.delete(`/reviews/${reviewId}`);
  return res.data;
};
