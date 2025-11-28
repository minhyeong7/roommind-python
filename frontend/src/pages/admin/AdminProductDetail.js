import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi"; // axios 말고 api 인스턴스 사용
import "./AdminProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✔ 상품 상세 불러오기
  const fetchProduct = async () => {
    const res = await api.get(`/admin/products/${id}`);
    setProduct(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <div>⏳ 불러오는 중...</div>;
  if (!product) return <div>❌ 상품을 찾을 수 없습니다.</div>;

  return (
    <AdminLayout>
      <div className="product-detail-container">

        <h1 className="detail-title">{product.productName}</h1>

        <div className="detail-top">

          {/* 왼쪽 이미지 */}
          <div className="detail-image-box">
            <img
              src={
                product.fileName
                  ? `/uploads/${product.saveDir}/${product.fileName}`
                  : "/no-image.png"
              }
              alt=""
            />
          </div>

          {/* 오른쪽 정보 */}
          <div className="detail-info-box">
            <p>
              <strong>카테고리:</strong>{" "}
              {product.majorCategory && product.middleCategory
                ? `${product.majorCategory} > ${product.middleCategory}`
                : "-"}
            </p>

            <p><strong>원가:</strong> {product.originalPrice?.toLocaleString()}원</p>
            <p><strong>판매가:</strong> {product.salePrice?.toLocaleString()}원</p>
            <p><strong>재고:</strong> {product.stock}</p>
            <p><strong>등록일:</strong> {product.createdDate?.slice(0, 10)}</p>

            <div className="detail-buttons">
              <button
                className="edit-btn"
                onClick={() => navigate(`/admin/products/${id}/edit`)}
              >
                수정하기
              </button>

              <button
                className="back-btn"
                onClick={() => navigate("/admin/products")}
              >
                목록으로
              </button>
            </div>
          </div>
        </div>

        {/* 상세 설명 */}
        <div className="detail-description-box">
          <h2>상품 설명</h2>
          <p>{product.description || "-"}</p>
        </div>
      </div>
    </AdminLayout>
  );
}
