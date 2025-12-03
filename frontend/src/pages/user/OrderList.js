import { useNavigate } from "react-router-dom";
import "./MyPage.css";

const OrderList = () => {
  const navigate = useNavigate();

  const handleDetail = () => {
    navigate("/mypage/orders/202512030001"); // 주문번호 전달
  };

  return (
    <div className="mypage-container">
      <div className="mypage-sidebar-placeholder" />

      <div className="mypage-content">
        <h2 className="mypage-title">주문 / 결제 내역</h2>

        <div className="order-list">
          <div className="order-item">
            <p><b>주문번호:</b> 202512030001</p>
            <p><b>상품명:</b> 화이트 원목 테이블</p>
            <p><b>결제금액:</b> 129,000원</p>

            <button className="btn-small" onClick={handleDetail}>
              상세보기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderList;
