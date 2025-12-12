// src/api/chatbotApi.js
import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:5000"; // 127.0.0.1로 통일

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// 이미지 업로드
export const detectImage = async (imageFile) => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const res = await api.post("/detect", formData); // 헤더 직접 지정 X
  return res.data;
};

// 챗봇 메시지
export const sendChat = async (message) => {
  const res = await api.post("/chat", { message });
  return res.data;
};

// 이미지 URL 보정
export const getImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE_URL}${path}`;
};
