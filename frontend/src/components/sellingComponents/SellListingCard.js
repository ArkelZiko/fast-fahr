import React from "react";
import "../css/sellingCSS/selllistingcard.css";

function SellListingCard({
  title,
  image,
  price,
  mileage,
  year,
  onView,
  onEdit,
  onDelete,
  
}) {
  return (
    <div className="sell-listing-card">
      <img src={image} alt={title} className="sell-listing-image" />
      <div className="sell-listing-info">
        <h3 className="sell-listing-title">{title}</h3>
        <p className="sell-listing-detail">
          {year} • {Number(mileage).toLocaleString()} km
        </p>
        <p className="sell-listing-price">
          ${Number(price).toLocaleString()} CAD
        </p>
      </div>
      <div className="sell-listing-actions">
        <button className="view-btn" onClick={onView}>
          <i className="fas fa-eye"></i> View
        </button>
        <button className="edit-btn" onClick={onEdit}>
          <i className="fas fa-pencil-alt"></i> Edit
        </button>
        <button className="delete-btn" onClick={onDelete}>
          <i className="fas fa-trash-alt"></i> Delete
        </button>
      </div>
    </div>
  );
}

export default SellListingCard;
