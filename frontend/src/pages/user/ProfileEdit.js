import "./MyPage.css";

const ProfileEdit = () => {
  return (
    <div className="mypage-container">
      <div className="mypage-sidebar-placeholder" />

      <div className="mypage-content">
        <h2 className="mypage-title">회원정보 수정</h2>

        <div className="form-box">
          <label>이름</label>
          <input type="text" value="김노아" />

          <label>이메일</label>
          <input type="email" value="noah@example.com" />

          <label>전화번호</label>
          <input type="text" placeholder="010-0000-0000" />

          <button className="btn-primary">정보 수정하기</button>
        </div>
      </div>
    </div>
  );
};

export default ProfileEdit;
