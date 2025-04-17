import React from "react";
import "../css/buyingCSS/buylistingcard.css";
import { useState } from "react";

function BuyListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  onContact,
}) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev);
  };

  return (
    <div className="buy-listing-card">
      <img src={image} alt={title} className="buy-listing-image" />
      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {mileage} km
        </p>
        <p className="buy-listing-price">${parseInt(price).toLocaleString()} CAD</p>
        </div>
      <div className="listing-actions">
        <button className="view-btn">
          <i className="fas fa-eye"></i> View
        </button>
        <button className="bookmark-btn" onClick={handleBookmarkClick}>
          <i
            className={`fas ${isBookmarked ? "fa-star" : "fa-star-half-alt"}`}
          ></i>
          {isBookmarked ? " Saved" : " Star"}
        </button>
        <button className="message-btn">
          <i className="fas fa-envelope"></i> Contact
        </button>
      </div>
    </div>
  );
}

export default BuyListingCard;
