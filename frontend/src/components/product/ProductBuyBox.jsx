import React, { useState, useContext } from "react";
import { CartContext } from "../../pages/cart/CartContext";
import "./ProductBuyBox.css";

function ProductBuyBox({ product }) {

  // 옵션 없는 경우 기본 옵션 자동 생성
  const optionList =
    product.options && product.options.length > 0
      ? product.options
      : ["기본옵션"];

  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  const totalPrice = product.salePrice * quantity;

  const handleSelectOption = (value) => {
    setSelectedOption(value);
    setQuantity(1);
  };

  const handleAddToCart = () => {
    if (!selectedOption) {
      alert("옵션을 선택해주세요!");
      return;
    }

    addToCart({
      id: product.productId,
      name: product.productName,
      option: selectedOption,
      quantity,
      price: product.salePrice,
      image: product.image,
    });

    alert("장바구니에 담겼습니다!");
  };

  return (
    <div className="buy-box">

      {/* 브랜드 */}
      <div className="brand-box">{product.brand || "브랜드 미표기"}</div>

      {/* 상품명 */}
      <h2 className="buy-title">{product.productName}</h2>

      {/* 가격 */}
      <div className="price-box">
        <span className="discount">20%</span>
        <span className="price">{product.salePrice.toLocaleString()}원</span>
      </div>
      <div className="original">
        {product.originalPrice.toLocaleString()}원
      </div>

      {/* 쿠폰 박스 */}
      <div className="coupon-box">
        <strong>🎟 쿠폰 할인 상품이 있어요!</strong><br />
        아래 상품에서 사용할 수 있는 쿠폰을 확인해보세요.
      </div>

      {/* 무료배송 / 오늘출발 */}
      <div className="delivery-status">
        <span className="free">🚚 무료배송</span>
        <span className="today">📦 오늘출발</span>
      </div>

      {/* 배송 정보 */}
      <div className="info-box">
        <div className="info-title">배송</div>
        <div className="info-content">
          결제 완료 후 평균 1~2일 이내 발송됩니다.<br />
          지역 및 상품에 따라 배송비가 달라질 수 있습니다.
        </div>
      </div>

      {/* 옵션 선택 */}
      <select
        className="option-select"
        value={selectedOption}
        onChange={(e) => handleSelectOption(e.target.value)}
      >
        <option value="">옵션 선택</option>
        {optionList.map((op, i) => (
          <option key={i} value={op}>
            {op}
          </option>
        ))}
      </select>

      {/* 선택된 옵션 표시 */}
      {selectedOption && (
        <div className="selected-item-box">
          <div className="selected-info">
            <div className="selected-name">
              {product.productName} - {selectedOption}
            </div>

            <div className="quantity-box">
              <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button onClick={() => setQuantity((q) => q + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="selected-price">
            {(product.salePrice * quantity).toLocaleString()}원
          </div>
        </div>
      )}

      {/* 총 금액 */}
      <div className="total-price-box">
        <span>총 상품금액</span>
        <span className="total-price">{totalPrice.toLocaleString()}원</span>
      </div>

      {/* 버튼 */}
      <div className="product-buy-btns">
        <button className="cart-btn" onClick={handleAddToCart}>
          장바구니
        </button>
        <button className="buy-btn">
          바로구매
        </button>
      </div>
    </div>
  );
}

export default ProductBuyBox;