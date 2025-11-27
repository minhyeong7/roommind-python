import React, { useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const executed = useRef(false); // 🔥 StrictMode에서 두 번 실행 방지

  useEffect(() => {
    if (executed.current) return;
    executed.current = true;

    console.log("===== 소셜 로그인 성공 처리 =====");
    console.log("전체 URL:", window.location.href);
    console.log("searchParams:", Object.fromEntries(searchParams));

    const token = searchParams.get("token");

    // 🔥 혹시 모를 케이스 대비해서 대소문자/오타 둘 다 체크
    const userName =
      searchParams.get("userName") || searchParams.get("username");

    const socialType =
      searchParams.get("socialType") || searchParams.get("socialtype");

    const role = searchParams.get("role") || "user";

    console.log("token:", token);
    console.log("userName:", userName);
    console.log("socialType:", socialType);
    console.log("role:", role);
    console.log("================================");

    if (token) {
      // ✅ 토큰 저장
      localStorage.setItem("token", token);

      // ✅ 소셜 로그인 사용자 정보 통일된 형태로 저장
      const userData = {
        userName: userName || "소셜유저",
        socialType: socialType || "social",
        role: role,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ user 저장:", userData);

      // ✅ Navbar 등에서 로그인 상태 감지
      window.dispatchEvent(new Event("loginSuccess"));

      Swal.fire({
        icon: "success",
        title: "로그인 성공 🎉",
        text: `${userName || "회원"}님, 환영합니다!`,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      console.log("❌ token 없음 - 로그인 실패 처리");
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
