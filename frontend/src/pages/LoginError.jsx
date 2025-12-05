import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

function LoginError() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const provider = params.get("provider"); // kakao / naver / google
  const reason = params.get("reason");     // cancel / error

  let message = "로그인 중 오류가 발생했습니다.";

  if (provider === "kakao" && reason === "cancel") {
    message = "카카오 로그인을 취소하셨습니다.";
  } else if (provider === "naver" && reason === "cancel") {
    message = "네이버 로그인을 취소하셨습니다.";
  } else if (provider === "google" && reason === "cancel") {
    message = "구글 로그인을 취소하셨습니다.";
  } else if (reason === "error") {
    message = "소셜 로그인 처리 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }

  return (
    <div style={{ textAlign: "center", marginTop: "120px" }}>
      <h2>❌ 로그인 실패</h2>
      <p style={{ marginTop: 20 }}>{message}</p>

      <button
        onClick={() => navigate("/login")}
        style={{
          marginTop: 30,
          padding: "12px 24px",
          borderRadius: 6,
          border: "none",
          backgroundColor: "#333",
          color: "#fff",
          cursor: "pointer",
          fontSize: "14px",
        }}
      >
        로그인 페이지로 돌아가기
      </button>
    </div>
  );
}

export default LoginError;
