import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Swal from "sweetalert2";

function LoginSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // ✅ URL에서 받은 파라미터들 출력
    console.log("===== 카카오 로그인 디버깅 =====");
    console.log("전체 URL:", window.location.href);
    console.log("searchParams 전체:", Object.fromEntries(searchParams));
    
    const token = searchParams.get("token");
    const username = searchParams.get("username");
    const socialType = searchParams.get("socialType");
    const role = searchParams.get("role");

    console.log("token:", token);
    console.log("username:", username);
    console.log("socialType:", socialType);
    console.log("role:", role);
    console.log("================================");

    if (token) {
      // ✅ 토큰 저장
      localStorage.setItem("token", token);
      console.log("✅ 토큰 localStorage에 저장됨");

      // ✅ 사용자 정보 저장
      const userData = {
        username: username || "KAKAO",
        socialType: socialType,
        role: role || "USER"
      };
      localStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ user 정보 localStorage에 저장됨:", userData);

      // ✅ 로그인 이벤트 발생
      window.dispatchEvent(new Event("loginSuccess"));
      console.log("✅ loginSuccess 이벤트 발생");

      // ✅ 성공 알림
      Swal.fire({
        icon: "success",
        title: "로그인 성공 🎉",
        text: `${username || "회원"}님, 환영합니다!`,
        showConfirmButton: false,
        timer: 1500,
      });

      setTimeout(() => {
        console.log("✅ 홈으로 이동");
        navigate("/");
      }, 1500);

    } else {
      console.log("❌ 토큰이 없음!");
      Swal.fire({
        icon: "error",
        title: "로그인 실패",
        text: "토큰을 받지 못했습니다.",
      });
      navigate("/login");
    }
  }, [navigate, searchParams]);

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>🔄 로그인 처리 중...</h2>
      <p>잠시만 기다려주세요</p>
    </div>
  );
}

export default LoginSuccess;



