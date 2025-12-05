// src/services/ChatService.js
import axios from "axios";

const API_URL = "http://localhost:5000"; // Flask 서버 주소

/**
 * 🔹 텍스트 메시지 → Flask /chat
 */
export async function sendChatMessage(message) {
  try {
    const res = await axios.post(`${API_URL}/chat`, { message });

    return res.data; 
    // res.data = { reply: "...", top3: [...] }
  } catch (err) {
    console.error("❌ Flask /chat 오류:", err);
    return { reply: "서버와 연결할 수 없습니다." };
  }
}

/**
 * 🔹 이미지 업로드 → Flask /detect
 */
export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  try {
    const res = await axios.post(`${API_URL}/detect`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    /**
     * res.data 예시:
     * {
     *   upload_image: "/localfile/..",
     *   detected: [...],
     *   classes: ["couch", "chair"]
     * }
     */

    return res.data;
  } catch (err) {
    console.error("❌ Flask /detect 오류:", err);
    return { error: true, message: "이미지 분석 실패" };
  }
}

/**
 * 🔹 감지된 가구 중 특정 클래스 Top3 요청 → Flask /top3
 */
export async function fetchTop3(targetClass) {
  try {
    const res = await axios.get(`${API_URL}/top3`, {
      params: { class: targetClass },
    });

    /**
     * res.data = { top3: [ { filename, url, similarity }, ... ] }
     */

    return res.data;
  } catch (err) {
    console.error("❌ Flask /top3 오류:", err);
    return { top3: [] };
  }
}
