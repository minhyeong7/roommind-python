import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Card.css";

function Card({ product }) {
  const {
    productId,
    productName,
    salePrice,
    originalPrice,
    images,
  } = product;

  // ⭐ 실제 이미지 URL 생성 (백엔드 도메인 포함)
  const imageUrl =
    images && images.length > 0
      ? `http://localhost:8080/${images[0].saveDir}/${images[0].fileName}`
      : "/images/no-image.png";

  // ❤️ 위시리스트 로컬스토리지
  const [liked, setLiked] = useState(false);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setLiked(wishlist.includes(productId));
  }, [productId]);

  const toggleLike = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    let updated;

    if (wishlist.includes(productId)) {
      updated = wishlist.filter((id) => id !== productId);
      setLiked(false);
    } else {
      updated = [...wishlist, productId];
      setLiked(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(updated));
  };

  // ⭐ 할인율 계산
  const discount =
    originalPrice > 0
      ? Math.round((1 - salePrice / originalPrice) * 100)
      : 0;

  console.log("🔥 Card product:", product);


  return (
    <Link
      to={`/product/${productId}`}
      
      className="card"
    >
      <div className="card-img-box">
        <img src={imageUrl} alt={productName} />

        <div className="card-scrap" onClick={toggleLike}>
          {liked ? "❤️" : "🤍"}
        </div>
      </div>

      <div className="card-info">
        <div className="card-title">{productName}</div>

        <div className="card-price-line">
          <span className="card-discount">{discount}%</span>
          <span className="card-price">
            {salePrice.toLocaleString()}원
          </span>
        </div>

        <div className="card-original">
          {originalPrice.toLocaleString()}원
        </div>

        <div className="card-review">⭐ 0 리뷰 0</div>
      </div>
    </Link>
  );
}

export default Card;
