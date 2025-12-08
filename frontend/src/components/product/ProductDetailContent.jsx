function ProductDetailContent({ product }) {
  return (
    <div className="detail-content">
      <h2>상품 상세정보</h2>

      {/* 메인 이미지 */}
      <img src={product.image} alt="" className="detail-img" />

      {/* 상세 이미지들 */}
      {product.images && product.images.length > 0 && (
        <div className="detail-sub-images">
          {product.images.map((img, idx) => (
            <img key={idx} src={img} alt="" className="detail-sub-img" />
          ))}
        </div>
      )}

      {/* 설명 */}
      <p className="product-description">
        {product.description || "상세 설명이 없습니다."}
      </p>
    </div>
  );
}

export default ProductDetailContent;
