function ProductDetailContent({ product }) {
  return (
    <div className="detail-content">
      <h2>상품 상세정보</h2>
      <img src={product.image} alt="" className="detail-img" />

      {/* 필요시 추가설명 */}
      <p>여기에 상품 상세 설명이 들어갑니다.</p>
    </div>
  );
}

export default ProductDetailContent;
