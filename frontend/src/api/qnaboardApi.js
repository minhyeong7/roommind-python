// src/api/qnaApi.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

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
   🔹 QnA 전체 리스트 조회
=============================== */
export const fetchQnAList = async () => {
  try {
    const res = await api.get("/qnaboards");
    return res.data.data; 
  } catch (error) {
    console.error("❌ QnA 리스트 조회 실패:", error);
    throw error;
  }
};

/* ============================
   🔹 QnA 게시글 등록
=============================== */
export const createQnABoard = async (boardData, images) => {
  try {
    const formData = new FormData();

    // ⭐ board JSON 을 문자열로 변환해서 넣기
    formData.append(
      "board",
      new Blob([JSON.stringify(boardData)], { type: "application/json" })
    );

    // ⭐ images 여러 개 추가
    if (images && images.length > 0) {
      images.forEach((file) => {
        formData.append("images", file);
      });
    }

    const res = await api.post("/qnaboards", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return res.data;
  } catch (error) {
    console.error("❌ QnA 게시글 등록 실패:", error);
    throw error;
  }
};

export default api;
