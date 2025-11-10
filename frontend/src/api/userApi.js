// src/api/userApi.js
import axios from "axios";

// Axios 기본 설정
const api = axios.create({
  baseURL: "http://localhost:8080/api", // 백엔드 주소 (Spring Boot 서버)
  headers: {
    "Content-Type": "application/json",
  },
});

// 회원가입 API
export const registerUser = async (userData) => {
  try {
    const response = await api.post("/signup", userData);
    return response.data;
  } catch (error) {
    console.error("회원가입 오류:", error);
    throw error;
  }
};
