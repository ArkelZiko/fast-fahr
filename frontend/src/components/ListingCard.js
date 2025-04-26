/**
 * File:         ListingCard.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 20th, 2025 (Updated April 23rd, 2025)
 * Description:  A general-purpose listing card component. Displays vehicle info
 *               and conditionally renders action buttons based on context.
*/

import React, { useState, useEffect } from "react";
import "./css/listingcard.css";

/**
 * Renders a generic listing card with conditional action buttons.
 * @param {object} props - Component properties.
 * @param {object} props.listing - The full listing object (used for Edit action).
 * @param {string} props.title - Listing title.
 * @param {string} props.image - Image URL.
 * @param {number|string} props.price - Listing price.
 * @param {number|string} props.mileage - Vehicle mileage.
 * @param {number|string} props.year - Vehicle year.
 * @param {function} [props.onView] - Callback function for View action.
 * @param {function} [props.onEdit] - Callback function for Edit action (expects listing object).
 * @param {function} [props.onDelete] - Callback function for Delete action.
 * @param {function} [props.onContact] - Callback function for Contact action.
 * @param {function} [props.onBookmarkToggle] - Callback function when bookmark state changes.
 * @param {boolean} [props.isBookmarked=false] - Initial bookmark state.
 * @param {'buying'|'selling'|'bookmarks'} [props.context='buying'] - Context to determine which buttons to show.
 * @returns {JSX.Element} The ListingCard component.
*/
function ListingCard({
  listing, // Added listing prop
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
  context = "buying",
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
          // ***MODIFIED HERE*** Pass the listing object to onEdit
          <button className="edit-btn" onClick={() => onEdit(listing)}>
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

        {context === "bookmarks" && onBookmarkToggle && ( // Ensure onBookmarkToggle exists for remove
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