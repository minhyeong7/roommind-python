import api from "./header.js";


/* ============================
   🔹 JWT 자동 첨부 인터셉터
=============================== */
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

/* ============================
   🔹 커뮤니티 전체 리스트 조회
=============================== */
export const fetchCommunityList = async () => {
  try {
    const res = await api.get("/community");
    return res.data.data;
  } catch (error) {
    console.error("❌ 커뮤니티 리스트 조회 실패:", error);
    throw error;
  }
};

/* ============================
   🔹 커뮤니티 게시글 등록
=============================== */
export const createCommunityBoard = async (boardData, images) => {
  try {
    const formData = new FormData();

    // 게시글 JSON → Blob 변환
    formData.append(
      "board",
      new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

    // 이미지 여러개 추가
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.post("/community", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("❌ 커뮤니티 게시글 등록 실패:", error);
    throw error;
  }
};

/* ============================
   🔹 커뮤니티 게시글 상세 조회
=============================== */
export const fetchCommunityDetail = async (communityId) => {
  try {
    const res = await api.get(`/community/${communityId}`);
    return res.data.data;
  } catch (error) {
    console.error("❌ 커뮤니티 상세 조회 실패:", error);
    throw error;
  }
};



/* ============================
   🔹 커뮤니티 게시글 삭제
=============================== */
export const deleteCommunityBoard = async (communityId) => {
  try {
    const res = await api.delete(`/community/${communityId}`);
    return res.data;
  } catch (error) {
    console.error("❌ 커뮤니티 게시글 삭제 실패:", error);
    throw error;
  }
};

/* ============================
   🔹 커뮤니티 게시글 수정
=============================== */
export const updateCommunityBoard = async (communityId, boardData, images) => {
  try {
    const formData = new FormData();

    // 게시글 데이터 추가
    formData.append(
      "board",
      new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

    // 이미지 추가 (선택)
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.put(`/community/${communityId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    return res.data;
  } catch (error) {
    console.error("❌ 커뮤니티 게시글 수정 실패:", error);
    throw error;
  }
};
/* 댓글 목록 조회 */
export const fetchComments = async (communityId) => {
  try {
    const res = await api.get(`/comments/board/${communityId}`);
    return res.data;
  } catch (error) {
    console.error("❌ 댓글 목록 조회 실패:", error);
    throw error;
  }
};

/* 댓글 등록 */
export const createComment = async (communityId, commentData) => {
  try {
    const res = await api.post(`/comments/board/${communityId}`, commentData);
    return res.data;
  } catch (error) {
    console.error("❌ 댓글 등록 실패:", error);
    throw error;
  }
};

/* 댓글 수정 */
export const updateComment = async (commentId, dto) => {
  try {
    const res = await api.put(`/comments/${commentId}`, dto);
    return res;  // ★ res.data 말고 res 자체 반환
  } catch (error) {
    console.error("댓글 수정 실패:", error);
    throw error;
  }
};




/* 댓글 삭제 */
export const deleteComment = async (commentId) => {
  try {
    const res = await api.delete(`/comments/${commentId}`);
    return res.data;
  } catch (error) {
    console.error("❌ 댓글 삭제 실패:", error);
    throw error;
  }
};





export default api;
