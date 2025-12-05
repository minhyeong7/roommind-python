import api from "./header.js";

/** 전체 상품 조회 */
export const fetchAllProducts = async () => {
  const res = await api.get("/products");
  return res.data.products; // success, count 제외하고 products만
};

/** 상품 필터링 조회 */
export const fetchFilteredProducts = async ({ keyword, sort, major, middle }) => {
  const res = await api.get("/products/filter", {
    params: { keyword, sort, major, middle },
  });
  return res.data; // List<ProductVO>
};

/** 단일 상품 조회 */
export const fetchProductById = async (productId) => {
  const res = await api.get(`/products/${productId}`);
  return res.data.data; // ProductVO
};

/** 상품 등록 (Multipart/form-data) */
export const insertProduct = async (formData) => {
  const res = await api.post("/products", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/** 상품 수정 */
export const updateProduct = async (productId, formData) => {
  const res = await api.put(`/products/${productId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

/** 상품 삭제 */
export const deleteProduct = async (productId) => {
  const res = await api.delete(`/products/${productId}`);
  return res.data;
};
