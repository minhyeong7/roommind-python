import MyPageSidebar from "./MyPageSidebar";
import "./MyPage.css";

const MyPage = () => {
  return (
    <div className="mypage-container">
      <MyPageSidebar />

      <div className="mypage-content">
        <h2 className="mypage-title">마이페이지</h2>
        <p>여기에 기본 마이페이지 안내 또는 위젯 넣기!</p>
      </div>
    </div>
  );
};

export default MyPage;
