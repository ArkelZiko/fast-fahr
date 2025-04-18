import React from "react";
import "../css/buyingCSS/buylistingcard.css";

/**
 * BuyListingCard displays a listing with bookmark functionality.
 * Props:
 * - title, image (full URL string), price, mileage, year
 * - onView, onContact, onBookmark (click handlers)
 * - isBookmarked (boolean)
 */
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
      <img src={image} alt={title} className="buy-listing-image" />
      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {mileage.toLocaleString()} km
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
