import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const ProfileEdit = () => {
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  const [userName, setUserName] = useState("");
  const [phone, setPhone] = useState("");

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");

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
      .catch((err) => console.error(err));
  }, [token]);

  if (!user) return <div className="mypage-content">불러오는 중...</div>;

  // ================================
  // 회원 정보 수정
  // ================================
  const handleUpdateProfile = () => {
    axios
      .put(
        "http://localhost:8080/api/users/update",
        {
          email: user.email,
          userName,
          phone,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("회원정보가 수정되었습니다!");

        // ⭐ localStorage 내 user 업데이트
        const updatedUser = {
          ...user,
          userName: userName,
          phone: phone,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        // ⭐ Navbar가 변경사항 감지하도록 이벤트 발행
        window.dispatchEvent(new Event("loginSuccess"));

        // 화면 즉시 반영
        setUser(updatedUser);
      })
      .catch((err) => console.error(err));
  };

  // ================================
  // 비밀번호 변경
  // ================================
  const handleChangePassword = () => {
    if (!currentPw || !newPw) {
      alert("현재 비밀번호와 새 비밀번호를 입력해주세요!");
      return;
    }

    axios
      .put(
        "http://localhost:8080/api/users/password",
        {
          email: user.email,
          currentPw,
          newPw,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )
      .then(() => {
        alert("비밀번호가 변경되었습니다");
        setCurrentPw("");
        setNewPw("");
      })
      .catch((err) => {
        console.error(err);
        alert("현재 비밀번호가 틀렸습니다");
      });
  };

  return (
    <div className="mypage-content">
      <h2 className="mypage-title">회원정보 수정</h2>

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

      <h2 className="mypage-title" style={{ marginTop: "40px" }}>
        비밀번호 변경
      </h2>

      <div className="form-box">
        <label>현재 비밀번호</label>
        <input
          type="password"
          value={currentPw}
          onChange={(e) => setCurrentPw(e.target.value)}
        />

        <label>새 비밀번호</label>
        <input
          type="password"
          value={newPw}
          onChange={(e) => setNewPw(e.target.value)}
        />

        <button className="btn-primary" onClick={handleChangePassword}>
          비밀번호 변경
        </button>
      </div>
    </div>
  );
};

export default ProfileEdit;
