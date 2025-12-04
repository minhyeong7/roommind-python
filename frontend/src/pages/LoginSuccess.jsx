import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const executed = useRef(false);

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

    console.log("===== 소셜 로그인 성공 처리 =====");

    const token = searchParams.get("token");
    const userName = searchParams.get("userName") || searchParams.get("username");
    const socialType = searchParams.get("socialType") || searchParams.get("socialtype");
    const role = searchParams.get("role") || "user";

    // ⭐⭐⭐ 핵심 추가 ⭐⭐⭐
    const userId = searchParams.get("userId");

    console.log("token:", token);
    console.log("userName:", userName);
    console.log("socialType:", socialType);
    console.log("role:", role);
    console.log("userId:", userId);
    console.log("================================");

    if (token) {
      localStorage.setItem("token", token);

      // 🌟 userId를 포함해야 모든 기능이 정상 작동됨
      const userData = {
        userId: Number(userId),
        userName: userName || "소셜유저",
        socialType: socialType || "social",
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ user 저장:", userData);

      window.dispatchEvent(new Event("loginSuccess"));

      Swal.fire({
        icon: "success",
        title: "로그인 성공 🎉",
        text: `${userName || "회원"}님, 환영합니다!`,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => navigate("/"), 1500);
    } else {
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "토큰을 받지 못했습니다. 다시 시도해주세요.",
      });
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔄 소셜 로그인 처리 중...</h2>
      <p>잠시만 기다려주세요.</p>
    </div>
  );
}

export default LoginSuccess;
