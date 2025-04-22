import React, { useState, useEffect } from "react";
import "./css/listingcard.css";

export default function ListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  isBookmarked = false,
  onBookmarkToggle,
}) {

  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleClick = () => {
    const next = !bookmarked;
    setBookmarked(next);
    if (onBookmarkToggle) onBookmarkToggle(next);
  };

  return (
    <div className="buy-listing-card">
      <img src={image} alt={title} className="buy-listing-image" />

      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {Number(mileage).toLocaleString()} km
        </p>
        <p className="buy-listing-price">
          ${Number(price).toLocaleString()} CAD
        </p>
      </div>

    <div className ="listing-actions">
      <button className="view-btn" onClick={onView}>
          <i className="fas fa-eye"></i> View
      </button>

        <button
          className="remove-bookmark-btn"
          onClick={handleClick}
          title="Remove Bookmark"
        >
          <i className="fas fa-star"></i> Remove
        </button>
      </div>
    </div>
  );
}
