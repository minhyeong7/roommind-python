import { Link } from "react-router-dom";
import "./MyPage.css";

const MyPageSidebar = () => {
  return (
    <div className="mypage-sidebar">
      <h3>내 정보</h3>
      <ul>
        <li><Link to="/mypage/profile">회원정보 수정</Link></li>
        <li><Link to="/mypage/address">배송지 관리</Link></li>
      </ul>

      <h3>쇼핑 내역</h3>
      <ul>
        <li><Link to="/mypage/orders">주문 / 결제 내역</Link></li>
        <li><Link to="/mypage/reviews">리뷰 내역</Link></li>
      </ul>
    </div>
  );
};

export default MyPageSidebar;
