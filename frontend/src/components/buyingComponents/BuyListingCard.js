import React, { useState, useEffect } from "react";
import "../css/buyingCSS/buylistingcard.css";

function BuyListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  onContact,
  onBookmark,
  isBookmarked = false,
}) {
  // local UI state starts from the prop
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // keep in sync whenever the parent prop changes (e.g., page navigation)
  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  // toggle bookmark
  const handleBookmarkClick = () => {
    const next = !bookmarked;
    setBookmarked(next); // instant UI feedback
    if (onBookmark) onBookmark(next); // inform parent
  };

  // fallback no‑op so buttons still work even if parent didn't pass a handler
  const noop = () => {};

  return (
    <div className="buy-listing-card">
      <img src={image} alt={title} className="buy-listing-image" />

      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {Number(mileage).toLocaleString()} km
        </p>
        <p className="buy-listing-price">
          ${Number(price).toLocaleString()} CAD
        </p>
      </div>

      <div className="listing-actions">
        {/* View */}
        <button className="view-btn" onClick={onView ?? noop}>
          <i className="fas fa-eye"></i> View
        </button>

        {/* Bookmark */}
        <button
          className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
          onClick={handleBookmarkClick}
        >
          <i className={bookmarked ? "fas fa-star" : "far fa-star"}></i>
          {bookmarked ? " Saved" : " Star"}
        </button>

        {/* Contact */}
        <button className="message-btn" onClick={onContact ?? noop}>
          <i className="fas fa-envelope"></i> Contact
        </button>
      </div>
    </div>
  );
}

export default BuyListingCard;
