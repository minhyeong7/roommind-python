// src/services/chatService.js
export async function sendChatMessage(message) {
  try {
    const res = await fetch("http://localhost:5000/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message }),
    });

    if (!res.ok) throw new Error("서버 통신 오류");

    const data = await res.json();
    return data.reply;
  } catch (error) {
    console.error("chatService 에러:", error);
    return "서버 연결에 문제가 발생했어요 😢";
  }
}
