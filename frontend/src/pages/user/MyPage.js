import "./MyPage.css";
import { Link } from "react-router-dom";

const MyPage = () => {
  return (
    <div className="mypage-content">
      <h2 className="mypage-title">마이페이지</h2>

      <div className="mypage-links">
        <Link to="/mypage/orders">주문 내역 보기</Link>
        <Link to="/mypage/reviews">내 리뷰 보기</Link>
        <Link to="/mypage/qna">내가 쓴 Q&A</Link>
      </div>
    </div>
  );
};

export default MyPage;
