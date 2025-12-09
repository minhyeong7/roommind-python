import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/userApi";
import "./MyPage.css";

const OrderList = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      // JWT에서 이메일 꺼내기
      const email = JSON.parse(atob(token.split(".")[1])).sub;

      // 이메일 → user 정보 조회
      const userRes = await api.get(`/users/email/${email}`);
      const userId = userRes.data.data.userId;

      // 유저 주문 내역 조회
      const orderRes = await api.get(`/orders/${userId}`);
      setOrders(orderRes.data.data || []);
    } catch (err) {
      console.error("주문 정보 조회 실패:", err);
    }
  };

  const goDetail = (orderId) => {
    navigate(`/mypage/orders/${orderId}`);
  };

  return (
    <div>
      <h2 className="mypage-title">주문 / 결제 내역</h2>

      <div className="order-list">
        {orders.length === 0 ? (
          <p>주문 내역이 없습니다.</p>
        ) : (
          orders.map((o) => (
            <div key={o.orderId} className="order-item">
              <p><b>주문번호:</b> {o.orderId}</p>
              <p><b>상품명:</b> {o.items?.[0]?.productName || "상품 정보 없음"}</p>
              <p><b>결제금액:</b> {o.totalPrice.toLocaleString()}원</p>

              <button className="btn-small" onClick={() => goDetail(o.orderId)}>
                상세보기
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default OrderList;
