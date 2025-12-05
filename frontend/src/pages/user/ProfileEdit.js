import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");

  // 비밀번호 관리
  const [passwords, setPasswords] = useState({
    currentPw: "",
    newPw: "",
    confirmPw: "",
  });

  // 비밀번호 보기
  const [showPassword, setShowPassword] = useState({
    currentPw: false,
    newPw: false,
    confirmPw: false,
  });

  // CapsLock 감지
  const [isCapsLockOn, setIsCapsLockOn] = useState(false);

  // 비밀번호 강도
  const [passwordStrength, setPasswordStrength] = useState("");

  // ================================
  // 로그인한 사용자 정보 불러오기
  // ================================
  useEffect(() => {
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const email = payload.sub;

    axios
      .get(`http://localhost:8080/api/users/email/${email}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const data = res.data.data;
        setUser(data);
        setUserName(data.userName);
        setPhone(data.phone || "");
      })
      .catch(console.error);
  }, [token]);

  if (!user) return <div className="mypage-content">불러오는 중...</div>;

  // ================================
  // 기본 정보 업데이트
  // ================================
  const handleUpdateProfile = () => {
    axios
      .put(
        "http://localhost:8080/api/users/update",
        { email: user.email, userName, phone },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("회원정보가 수정되었습니다!");

        const updatedUser = { ...user, userName, phone };
        localStorage.setItem("user", JSON.stringify(updatedUser));
        window.dispatchEvent(new Event("loginSuccess"));
        setUser(updatedUser);
      })
      .catch(console.error);
  };

  // ================================
  // CapsLock 감지
  // ================================
  const handleCapsCheck = (e) => {
    setIsCapsLockOn(e.getModifierState("CapsLock"));
  };

  // ================================
  // 비밀번호 변경 입력 처리
  // ================================
  const handlePwdChange = (e) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({ ...prev, [name]: value }));

    if (name === "newPw") checkPasswordStrength(value);
  };

  // 비밀번호 강도 계산
  const checkPasswordStrength = (pw) => {
    if (pw.length < 8) return setPasswordStrength("weak");

    const hasLetter = /[a-zA-Z]/.test(pw);
    const hasNumber = /\d/.test(pw);
    const hasSpecial = /[@$!%*?&]/.test(pw);

    const score = [hasLetter, hasNumber, hasSpecial].filter(Boolean).length;

    if (score === 1) setPasswordStrength("weak");
    else if (score === 2) setPasswordStrength("medium");
    else setPasswordStrength("strong");
  };

  // 비밀번호 보기 토글
  const togglePassword = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  // ================================
  // 비밀번호 최종 제출
  // ================================
  const handleChangePassword = () => {
    const { currentPw, newPw, confirmPw } = passwords;

    if (!currentPw || !newPw || !confirmPw) {
      alert("모든 비밀번호 입력란을 작성해주세요.");
      return;
    }

    if (newPw !== confirmPw) {
      alert("새 비밀번호가 일치하지 않습니다.");
      return;
    }

    const pwRegex =
      /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (!pwRegex.test(newPw)) {
      alert("비밀번호는 8자 이상, 영문/숫자/특수문자를 모두 포함해야 합니다.");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/users/password",
        { email: user.email, currentPw, newPw },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        alert("비밀번호 변경 완료!");
        setPasswords({ currentPw: "", newPw: "", confirmPw: "" });
        setPasswordStrength("");
      })
      .catch(() => alert("현재 비밀번호가 틀렸습니다."));
  };

  return (
    <div className="mypage-content">
      <h2 className="mypage-title">회원정보 수정</h2>

      {/* 기본 정보 */}
      <div className="form-box">
        <label>이름</label>
        <input
          type="text"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />

        <label>이메일</label>
        <input type="email" value={user.email} readOnly />

        <label>전화번호</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <button className="btn-primary" onClick={handleUpdateProfile}>
          정보 수정하기
        </button>
      </div>

      {/* 비밀번호 변경 */}
      <h2 className="mypage-title" style={{ marginTop: 40 }}>
        비밀번호 변경
      </h2>

      <div className="form-box">
        {isCapsLockOn && (
          <div className="caps-warning">⚠️ CapsLock이 켜져 있습니다!</div>
        )}

        {/* 현재 비밀번호 */}
        <label>현재 비밀번호</label>
        <div className="pw-wrap">
          <input
            type={showPassword.currentPw ? "text" : "password"}
            name="currentPw"
            value={passwords.currentPw}
            onChange={handlePwdChange}
            onKeyDown={handleCapsCheck}
            onKeyUp={handleCapsCheck}
          />
          <span
            className="pw-eye"
            onClick={() => togglePassword("currentPw")}
          >
            {showPassword.currentPw ? "👁‍🗨" : "👁"}
          </span>
        </div>

        {/* 새 비밀번호 */}
        <label>새 비밀번호</label>
        <div className="pw-wrap">
          <input
            type={showPassword.newPw ? "text" : "password"}
            name="newPw"
            value={passwords.newPw}
            onChange={handlePwdChange}
            onKeyDown={handleCapsCheck}
            onKeyUp={handleCapsCheck}
          />
          <span
            className="pw-eye"
            onClick={() => togglePassword("newPw")}
          >
            {showPassword.newPw ? "👁‍🗨" : "👁"}
          </span>
        </div>

        {/* 강도 표시 */}
        {passwords.newPw && (
          <div className={`pw-strength ${passwordStrength}`}>
            {passwordStrength === "weak" && "약함 (Weak)"}
            {passwordStrength === "medium" && "보통 (Medium)"}
            {passwordStrength === "strong" && "강함 (Strong)"}
          </div>
        )}

        {/* 확인 비밀번호 */}
        <label>새 비밀번호 확인</label>
        <div className="pw-wrap">
          <input
            type={showPassword.confirmPw ? "text" : "password"}
            name="confirmPw"
            value={passwords.confirmPw}
            onChange={handlePwdChange}
            onKeyDown={handleCapsCheck}
            onKeyUp={handleCapsCheck}
          />
          <span
            className="pw-eye"
            onClick={() => togglePassword("confirmPw")}
          >
            {showPassword.confirmPw ? "👁‍🗨" : "👁"}
          </span>
        </div>

        <button className="btn-primary" onClick={handleChangePassword}>
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
