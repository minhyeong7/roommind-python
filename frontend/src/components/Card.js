import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Card.css";

function Card({ image, title, price, originalPrice, link }) {
  const productId = title;
  const [liked, setLiked] = useState(false);

  const format = (num) => Number(num).toLocaleString();
  const toNumber = (num) => Number(num.toString().replace(/,/g, ""));

  const priceNum = toNumber(price);
  const originalNum = toNumber(originalPrice);

  const discount = Math.round((1 - priceNum / originalNum) * 100);

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

  // 🔥 여기서 Link + state로 product 데이터 넘김
  return (
    <Link
      to={link}
      state={{
        product: {
          title,
          price: priceNum,
          originalPrice: originalNum,
          image,
          discount,
          options: ["기본옵션"], // 옵션 없는 상품 대비
        },
      }}
      className="card"
    >
      <div className="card-img-box">
        <img src={image} alt={title} />
        <div className="card-scrap" onClick={toggleLike}>
          {liked ? "❤️" : "🤍"}
        </div>
      </div>

      <div className="card-info">
        <div className="card-title">{title}</div>

        <div className="card-price-line">
          <span className="card-discount">{discount}%</span>
          <span className="card-price">{format(priceNum)}원</span>
        </div>

        <div className="card-original">{format(originalNum)}원</div>

        <div className="card-review">⭐ 0 리뷰 0</div>
      </div>
    </Link>
  );
}

export default Card;
