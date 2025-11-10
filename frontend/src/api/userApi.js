// src/api/userApi.js
import axios from "axios";

// ✅ Axios 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 주소 (Spring Boot 서버)
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ 회원가입 API
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/api/members/signup", userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};

// ✅ 로그인 API
export const loginUser = async (loginData) => {
  try {
    const response = await api.post("/api/members/login", loginData);
    return response.data; // 토큰 또는 사용자 정보
  } catch (error) {
    console.error("로그인 오류:", error);
    throw error;
  }
};

// ✅ (선택) 사용자 정보 요청 API
export const fetchUserInfo = async (token) => {
  try {
    const response = await api.get("/api/members/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("사용자 정보 요청 오류:", error);
    throw error;
  }
};
