import React from "react";
import "./css/listingcard.css";

function ListingCard({ title, image, price, mileage, year }) {
  return (
    <div className="listing-card">
      <img src={image} alt={title} className="listing-image" />
      <div className="listing-info">
        <h3 className="listing-title">{title}</h3>
        <p className="listing-detail">
          {year} • {mileage} km
        </p>
        <p className="listing-price">${price}</p>
      </div>
      <div className="listing-actions">
        <button className="view-btn">
          <i className="fas fa-eye"></i> View
        </button>
        <button className="bookmark-btn">
            <i className="fas fa-star"></i> Star
        </button>
        <button className="message-btn">
            <i className="fas fa-envelope"></i> Contact
        </button>
      </div>
    </div>
  );
}

export default ListingCard;
