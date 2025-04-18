import React from "react";
import "../css/buyingCSS/buylistingcard.css";

/**
 * Updated BuyListingCard to integrate bookmark functionality via props.
 * Props:
 * - title, image, price, mileage, year
 * - onView, onContact, onBookmark (callback)
 * - isBookmarked (boolean)
 */
const imageUrl = `${process.env.PUBLIC_URL}/${image}`;

function BuyListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  onContact,
  onBookmark,
  isBookmarked,
}) {
  return (
    <div className="buy-listing-card">
      <img src={imageUrl} alt={title} className="buy-listing-image" />
      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {mileage} km
        </p>
        <p className="buy-listing-price">
          ${parseInt(price).toLocaleString()} CAD
        </p>
      </div>
      <div className="listing-actions">
        <button className="view-btn" onClick={onView}>
          <i className="fas fa-eye"></i> View
        </button>
        <button className="bookmark-btn" onClick={onBookmark}>
          <i className={`fas ${isBookmarked ? "fa-star" : "far fa-star"}`}></i>
          {isBookmarked ? " Saved" : " Save"}
        </button>
        <button className="message-btn" onClick={onContact}>
          <i className="fas fa-envelope"></i> Contact
        </button>
      </div>
    </div>
  );
}

export default BuyListingCard;
