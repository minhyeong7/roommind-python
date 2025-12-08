import api from "./header";

/**
 * 🟡 주문 생성 (PENDING)
 * POST /api/orders
 */
export const createOrder = async (orderData) => {
  const res = await api.post("/orders", orderData);
  return res.data;
};

/**
 * 🟡 내 주문 목록 조회
 * GET /api/orders
 */
export const getMyOrders = async () => {
  const res = await api.get("/orders");
  return res.data;
};
