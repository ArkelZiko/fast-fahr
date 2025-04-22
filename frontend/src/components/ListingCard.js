import React, { useState, useEffect } from "react";
import "./css/listingcard.css";

function ListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  onEdit,
  onDelete,
  onContact,
  onBookmarkToggle,
  isBookmarked = false,
  context = "buying", // can be "buying", "selling", or "bookmarks"
}) {
  const [bookmarked, setBookmarked] = useState(isBookmarked);

  useEffect(() => {
    setBookmarked(isBookmarked);
  }, [isBookmarked]);

  const handleBookmarkClick = () => {
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
          {year} • {Number(mileage).toLocaleString()} km
        </p>
        <p className="buy-listing-price">
          ${Number(price).toLocaleString()} CAD
        </p>
      </div>

      <div className="listing-actions">
        {onView && (
          <button className="view-btn" onClick={onView}>
            <i className="fas fa-eye"></i> View
          </button>
        )}

        {context === "buying" && onBookmarkToggle && (
          <button
            className={bookmarked ? "bookmark-btn active" : "bookmark-btn"}
            onClick={handleBookmarkClick}
          >
            <i className={bookmarked ? "fas fa-star" : "far fa-star"}></i>
            {bookmarked ? " Saved" : " Star"}
          </button>
        )}

        {context === "selling" && onEdit && (
          <button className="edit-btn" onClick={onEdit}>
            <i className="fas fa-pencil-alt"></i> Edit
          </button>
        )}

        {context === "selling" && onDelete && (
          <button className="delete-btn" onClick={onDelete}>
            <i className="fas fa-trash-alt"></i> Delete
          </button>
        )}

        {context === "buying" && onContact && (
          <button className="message-btn" onClick={onContact}>
            <i className="fas fa-envelope"></i> Contact
          </button>
        )}

        {context === "bookmarks" && (
          <button
            className="remove-bookmark-btn"
            onClick={handleBookmarkClick}
            title="Remove Bookmark"
          >
            <i className="fas fa-star"></i> Remove
          </button>
        )}
      </div>
    </div>
  );
}

export default ListingCard;
