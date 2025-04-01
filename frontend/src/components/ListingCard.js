import React from "react";
import "./css/listingcard.css";
import { useState } from "react";


function ListingCard({ title, make, model, image, price, mileage, year }) {

  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleBookmarkClick = () => {
    setIsBookmarked(prev => !prev);
    console.log(`${title} was ${!isBookmarked ? "bookmarked" : "unbookmarked"}`);
  };

  return (
    <div className="listing-card">
      <img src={image} alt={title} className="listing-image" />
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
