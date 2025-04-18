import React, { useState, useEffect } from "react";
import "./css/listingcard.css";

export default function ListingCard({
  title,
  image,
  price,
  mileage,
  year,
  isBookmarked = false,
  onBookmarkToggle,
}) {
  // ① initialize from prop …
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  // ② … then stay in sync any time the parent flips the prop
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

      <button
        className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
        onClick={handleClick}
        title={bookmarked ? "Remove bookmark" : "Add bookmark"}
      >
        {bookmarked ? "★" : "☆"}
      </button>
    </div>
  );
}
