import React, { useState } from "react";
import "./css/listingcard.css";

function ListingCard({ title, make, model, image, price, mileage, year }) {
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Construct the correct image URL from the public folder
  const imageUrl = `${process.env.PUBLIC_URL}/${image}`;
  // Alternatively, use the PUBLIC_URL for subdirectory deployment:
  // const imageUrl = `${process.env.PUBLIC_URL}/${image}`;

  const handleBookmarkClick = () => {
    setIsBookmarked((prev) => !prev);
    console.log(`${title} was ${!isBookmarked ? "bookmarked" : "unbookmarked"}`);
  };

  return (
    <div className="listing-card">
      <img src={imageUrl} alt={title} className="listing-image" />
      <div className="listing-info">
        <h3 className="listing-title">{title}</h3>
        <p className="listing-detail">
          {year} • {mileage} km
        </p>
        <p className="listing-price">${price} CAD</p>
      </div>
      <div className="listing-actions">
        <button className="view-btn">
          <i className="fas fa-eye"></i> View
        </button>
        <button className="bookmark-btn" onClick={handleBookmarkClick}>
          <i className={`fas ${isBookmarked ? "fa-star" : "fa-star-half-alt"}`}></i>
          {isBookmarked ? " Saved" : " Star"}
        </button>
        <button className="message-btn">
          <i className="fas fa-envelope"></i> Contact
        </button>
      </div>
    </div>
  );
}

export default ListingCard;
