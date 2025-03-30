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
    </div>
  );
}

export default ListingCard;
