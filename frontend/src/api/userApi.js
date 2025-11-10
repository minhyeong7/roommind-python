// src/api/userApi.js
import axios from "axios";

// ✅ Axios 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드(Spring Boot) 서버 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 회원가입 API
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/members/signup", userData);
    return response.data; // 성공 시 백엔드 응답 반환
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

// ✅ 로그인 API (JWT)
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/api/members/login", loginData);

    // ✅ 로그인 성공 시 토큰 저장
    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }

    return response; // 전체 응답 반환
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

// ✅ 로그인 후 사용자 정보 가져오기 (JWT 필요)
export const fetchUserInfo = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");

    const response = await api.get("/api/members/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("사용자 정보 요청 오류:", error);
    throw error;
  }
};

// ✅ 로그아웃 (토큰 삭제)
export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("🧹 JWT 토큰 삭제 완료 — 로그아웃 처리됨");
};

// ✅ JWT 자동 첨부 (인터셉터)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
