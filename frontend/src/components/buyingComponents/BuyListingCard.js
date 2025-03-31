import React from "react";
import "../css/buyingCSS/buylistingcard.css";

function BuyListingCard({ title, image, price, mileage, year, onView, onContact }) {
  return (
    <div className="buy-listing-card">
      <img src={image} alt={title} className="buy-listing-image" />
      <div className="buy-listing-info">
        <h3 className="buy-listing-title">{title}</h3>
        <p className="buy-listing-detail">
          {year} • {mileage} km
        </p>
        <p className="buy-listing-price">${price} CAD</p>
      </div>
      <div className="buy-listing-actions">
        <button className="view-btn" onClick={onView}>
          <i className="fas fa-eye"></i> View Details
        </button>
        <button className="contact-btn" onClick={onContact}>
          <i className="fas fa-envelope"></i> Contact Seller
        </button>
      </div>
    </div>
  );
}

export default BuyListingCard;
