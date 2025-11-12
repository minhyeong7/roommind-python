// src/api/userApi.js
import axios from "axios";

// ✅ Axios 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드(Spring Boot) 주소
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 회원가입 API
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/members/signup", userData);
    return response.data; // 백엔드 응답 반환
  } catch (error) {
    console.error("❌ 회원가입 오류:", error);
    throw error;
  }
};

// ✅ 로그인 API (JWT)
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/api/members/login", loginData);

    // ✅ 백엔드 응답 구조 예시:
    // { status:200, message:"success", data:{ token:"JWT_TOKEN" } }
    const token = response.data?.data?.token;

    if (token) {
      localStorage.setItem("token", token);
      console.log("✅ 로그인 성공 — 토큰 저장 완료:", token);
    } else {
      console.warn("⚠️ 로그인 응답에 토큰이 없습니다:", response.data);
    }

    return response.data; // 전체 반환
  } catch (error) {
    console.error("❌ 로그인 오류:", error);
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

    console.log("📥 fetchUserInfo 응답:", response.data);

    // ✅ 백엔드 응답 구조가 {data:{...}} 형태인 경우
    if (response.data.data) {
      return response.data.data;
    }

    // 단일 구조면 그냥 반환
    return response.data;
  } catch (error) {
    console.error("❌ 사용자 정보 요청 오류:", error);
    throw error;
  }
};

// ✅ 로그아웃 (토큰 삭제)
export const logoutUser = () => {
  localStorage.removeItem("token");
  console.log("🧹 JWT 토큰 삭제 완료 — 로그아웃 처리됨");
};

// ✅ Axios 인터셉터 — 모든 요청에 JWT 자동 첨부
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
