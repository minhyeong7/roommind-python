import React, { useState, useContext } from "react";
import { CartContext } from "../context/CartContext"; 
import "./ProductBuyBox.css";

function ProductBuyBox({ product }) {

  // 🔥 옵션 없는 상품이면 기본옵션 자동 생성
  const optionList =
    product.options && product.options.length > 0
      ? product.options
      : ["기본옵션"];

  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useContext(CartContext);

  const totalPrice = product.price * quantity;

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
      uniqueId: `${product.id}_${selectedOption}`,
      id: product.id,
      name: product.title,
      option: selectedOption,
      quantity: quantity,
      price: product.price,
      image: product.image,
    });

    alert("장바구니에 상품이 담겼습니다!");
  };

  return (
    <div className="buy-box">

      {/* 상품명 */}
      <h2 className="buy-title">{product.title}</h2>

      {/* 가격 박스 */}
      <div className="price-box">
        <span className="discount">{product.discount}%</span>
        <span className="price">{product.price.toLocaleString()}원</span>
      </div>
      <div className="original">
        {product.originalPrice.toLocaleString()}원
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

      {/* 선택된 옵션 박스 */}
      {selectedOption && (
        <div className="selected-item-box">
          <div className="selected-info">
            <div className="selected-name">
              {product.title} - {selectedOption}
            </div>

            {/* 수량 조절 버튼 */}
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

          {/* 옵션 가격 */}
          <div className="selected-price">
            {(product.price * quantity).toLocaleString()}원
          </div>
        </div>
      )}

      {/* 총 금액 */}
      <div className="total-price-box">
        <span>총 상품금액</span>
        <span className="total-price">
          {totalPrice.toLocaleString()}원
        </span>
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
