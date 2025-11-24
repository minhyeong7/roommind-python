import "./Card.css";

function Card({ image, title, price, originalPrice, link }) {
  return (
    <a href={link} className="card">
      <div className="card-img-box">
        <img src={image} alt={title} />
        <div className="card-scrap">🤍</div>
      </div>

      <div className="card-info">
        <div className="card-title">{title}</div>

        <div className="card-price-line">
          <span className="card-discount">
            {Math.round((1 - price.replace(/,/g, "") / originalPrice.replace(/,/g, "")) * 100)}%
          </span>
          <span className="card-price">{price}원</span>
        </div>

        <div className="card-original">{originalPrice}원</div>

        <div className="card-review">⭐ 0 리뷰 0</div>
      </div>
    </a>
  );
}

export default Card;
