import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./MyPage.css";

const OrderDetail = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    axios
      .get(`http://13.209.6.113:8080/api/orders/${orderId}`)
      .then(res => setOrder(res.data))
      .catch(err => console.error(err));
  }, [orderId]);

  if (!order) return <div>불러오는 중...</div>;

  return (
    <div>
      <h2 className="mypage-title">주문 상세</h2>

      {/* 주문 정보 */}
      <div className="order-detail-section">
        <h3>주문정보</h3>
        <p><b>주문번호:</b> {order.orderId}</p>
        <p><b>주문일자:</b> {order.orderDate}</p>
        <p><b>주문상태:</b> {order.status}</p>
      </div>

      {/* 상품 정보 */}
      <div className="order-detail-section">
        <h3>상품정보</h3>

        {order.products.map((p, index) => (
          <div className="order-product-item" key={index}>
            <img src={p.imageUrl} alt={p.name} />

            <div className="product-info">
              <p className="product-name">{p.name}</p>
              <p>옵션: {p.optionName}</p>
              <p>수량: {p.quantity}개</p>
              <p><b>{p.price.toLocaleString()}원</b></p>
            </div>
          </div>
        ))}
      </div>

      {/* 배송 정보 */}
      <div className="order-detail-section">
        <h3>배송정보</h3>
        <p><b>받는 사람:</b> {order.receiver.name}</p>
        <p><b>연락처:</b> {order.receiver.phone}</p>
        <p><b>주소:</b> {order.receiver.address}</p>
        <p><b>요청사항:</b> {order.receiver.request}</p>
      </div>

      {/* 결제 정보 */}
      <div className="order-detail-section">
        <h3>결제정보</h3>
        <p><b>총 결제금액:</b> {order.payment.totalPrice.toLocaleString()}원</p>
        <p><b>결제수단:</b> {order.payment.method}</p>
        <p><b>결제상태:</b> {order.payment.status}</p>
      </div>
    </div>
  );
};

export default OrderDetail;
