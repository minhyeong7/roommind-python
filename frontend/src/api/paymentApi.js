import api from "./header";

/**
 * 🟢 결제 승인(서버 검증)
 * POST /api/payments/confirm
 * { orderId, paymentId }
 */
export const confirmPayment = async (data) => {
  const res = await api.post("/payments/confirm", data);
  return res.data;
};
