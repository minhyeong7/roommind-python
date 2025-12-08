import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import api from "../../api/userApi";
import "./AdminProductDetail.css";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

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

  // ⭐ 이미지 경로 처리
  const getProductImage = (images) => {
    if (!images || images.length === 0) return "/no-image.png";

    const img = images[0];

    const fixedDir = img.saveDir.replace(/\\/g, "/");
    const folderName = fixedDir.split("uploads/product/")[1];

    if (!folderName) return "/no-image.png";

    return `/uploads/product/${folderName}/${img.fileName}`;
  };

  const firstImage = getProductImage(product.images);

  return (
    <AdminLayout>
      <div className="product-detail-container">

        <h1 className="detail-title">{product.productName}</h1>

        <div className="detail-top">

          {/* 왼쪽 이미지 */}
          <div className="detail-image-box">
            <img src={firstImage} alt="상품 이미지" />
          </div>

          {/* 오른쪽 정보 */}
          <div className="detail-info-box">
            <p>
              <strong>카테고리:</strong>{" "}
              {product.majorCategory && product.middleCategory
                ? `${product.majorCategory} > ${product.middleCategory}`
                : "-"}
            </p>

            {/* 브랜드 추가 */}
            <p>
              <strong>브랜드:</strong> {product.brand || "-"}
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
