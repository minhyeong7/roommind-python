import React, { useState, useContext } from "react";
import "./ProductBuyBox.css";
import { CartContext } from "../../pages/cart/CartContext";
import { useNavigate } from "react-router-dom";

function ProductBuyBox({ product }) {
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const optionList =
    product.options && product.options.length > 0
      ? product.options
      : ["기본옵션"];

  const [selectedOption, setSelectedOption] = useState("");
  const [quantity, setQuantity] = useState(1);

  const totalPrice = product.salePrice * quantity;

  const handleSelectOption = (value) => {
    setSelectedOption(value);
    setQuantity(1);
  };

  const handleAddToCart = async () => {
    if (!selectedOption) {
      alert("옵션을 선택해주세요!");
      return;
    }

    try {
      const success = await addToCart({
        productId: product.productId,
        id: product.productId,
        name: product.productName,
        price: product.salePrice,
        image: product.imageUrl || product.image,
        quantity,
        option: selectedOption,
      });

      if (success) {
        alert("장바구니에 담겼습니다!");
      }
    } catch (error) {
      console.error("장바구니 등록 실패:", error);
      alert("장바구니 등록 중 오류가 발생했습니다.");
    }
  };

  // ⭐ 바로구매 → 주문 페이지로 데이터 넘기기
  const handleBuyNow = () => {
    if (!selectedOption) {
      alert("옵션을 선택해주세요!");
      return;
    }

    navigate("/order", {
      state: {
        buyNowItem: {
          uniqueId: "buy-" + Date.now(),
          productId: product.productId,
          name: product.productName,
          price: product.salePrice,
          image: product.imageUrl || product.image,
          quantity,
          option: selectedOption,
        },
      },
    });
  };

  return (
    <div className="buy-box">
      <div className="brand-box">{product.brand || "브랜드 미표기"}</div>

      <h2 className="buy-title">{product.productName}</h2>

      <div className="price-box">
        <span className="discount">20%</span>
        <span className="price">{product.salePrice.toLocaleString()}원</span>
      </div>

      <div className="original">
        {product.originalPrice.toLocaleString()}원
      </div>

      <div className="coupon-box">
        <strong>🎟 쿠폰 할인 상품이 있어요!</strong><br />
        아래 상품에서 사용할 수 있는 쿠폰을 확인해보세요.
      </div>

      <div className="delivery-status">
        <span className="free">🚚 무료배송</span>
        <span className="today">📦 오늘출발</span>
      </div>

      <div className="info-box">
        <div className="info-title">배송</div>
        <div className="info-content">
          결제 완료 후 평균 1~2일 이내 발송됩니다.<br />
          지역 및 상품에 따라 배송비가 달라질 수 있습니다.
        </div>
      </div>

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

      <div className="total-price-box">
        <span>총 상품금액</span>
        <span className="total-price">{totalPrice.toLocaleString()}원</span>
      </div>

      <div className="product-buy-btns">
        <button className="cart-btn" onClick={handleAddToCart}>
          장바구니
        </button>

        {/* 여기!!! 이 부분이 꼭 있어야 바로구매가 동작함 */}
        <button className="buy-btn" onClick={handleBuyNow}>
          바로구매
        </button>
      </div>
    </div>
  );
}

export default ProductBuyBox;
