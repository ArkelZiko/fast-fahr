/**
 * File: ViewModal.js
 * Authors: Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs: alamy1, govindag, kharodg, zikoa
 * Date: April 22nd, 2025
 * Description: Rendering the modal that pops up when view is clicked
 *              consists of year and title at the top,
 *              a main image, and additional images you can sift through,
 *              car details (make model etc.),
 *              description at the bottom
 */

import React, { useState } from "react";
import "../css/buyingCSS/viewModal.css";

/**
 * ViewModal
 * Modal component for viewing car listing details with images and other details
 *
 * @param {Object} props component props
 * @param {string[]} props.images array of the image paths
 * @param {Function} props.onClose closeing the modal
 * @param {string} [props.title] car title
 * @param {string|number} [props.year] year
 * @param {string|number} [props.price] price
 * @param {string} [props.description] description
 * @param {Object} [props.specs] - Object containing car spec labels and values
 *
 * @returns {JSX.Element|null}
 */
function ViewModal({
  images,
  onClose,
  title = "Car Listing",
  year = "",
  price = "",
  description = "",
  specs = {},
}) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!images || images.length === 0) return null;

  /**
   *
   * @param {*} e
   */
  const handlePrevImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) =>
      prevIndex > 0 ? prevIndex - 1 : images.length - 1
    );
  };

  const handleNextImage = (e) => {
    e.stopPropagation();
    setSelectedIndex((prevIndex) =>
      prevIndex < images.length - 1 ? prevIndex + 1 : 0
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="view-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>
            {year ? `${year}` : ""} {title}
          </h2>
          <button className="close-button" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="main-image-container">
            <button className="nav-button prev" onClick={handlePrevImage}>
              <i className="fas fa-chevron-left"></i>
            </button>

            <div className="main-image">
              <img
                src={`${process.env.REACT_APP_STATIC_BASE}${images[selectedIndex]}`}
                alt={`${title} - Image ${selectedIndex + 1}`}
              />
            </div>

            <button className="nav-button next" onClick={handleNextImage}>
              <i className="fas fa-chevron-right"></i>
            </button>
          </div>

          <div className="thumbnails-wrapper">
            <div className="thumbnails-container">
              {images.map((src, i) => (
                <div
                  key={i}
                  className={`thumbnail ${
                    i === selectedIndex ? "active-thumb" : ""
                  }`}
                  onClick={() => setSelectedIndex(i)}
                >
                  <img
                    src={`${process.env.REACT_APP_STATIC_BASE}${src}`}
                    alt={`Thumbnail ${i + 1}`}
                  />
                  {i === 0 && <span className="main-badge">Main</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="car-price-section">
          <h3 className="car-price">
            <i className="fas fa-tag"></i> ${Number(price).toLocaleString()} CAD
          </h3>
        </div>

        <div className="car-details-section">
          <div className="car-specs-grid">
            {specs.Make && (
              <div className="spec-item">
                <i className="fas fa-car"></i>
                <span className="spec-label">Make:</span>
                <span className="spec-value">{specs.Make}</span>
              </div>
            )}
            {specs.Model && (
              <div className="spec-item">
                <i className="fas fa-info-circle"></i>
                <span className="spec-label">Model:</span>
                <span className="spec-value">{specs.Model}</span>
              </div>
            )}
            {specs.Kilometers && (
              <div className="spec-item">
                <i className="fas fa-tachometer-alt"></i>
                <span className="spec-label">Kilometers:</span>
                <span className="spec-value">{specs.Kilometers}</span>
              </div>
            )}
            {specs.Transmission && (
              <div className="spec-item">
                <i className="fas fa-cogs"></i>
                <span className="spec-label">Transmission:</span>
                <span className="spec-value">{specs.Transmission}</span>
              </div>
            )}
            {specs.Drive && (
              <div className="spec-item">
                <i className="fas fa-compact-disc"></i>
                <span className="spec-label">Drive:</span>
                <span className="spec-value">{specs.Drive}</span>
              </div>
            )}
            {specs.Fuel && (
              <div className="spec-item">
                <i className="fas fa-gas-pump"></i>
                <span className="spec-label">Fuel:</span>
                <span className="spec-value">{specs.Fuel}</span>
              </div>
            )}
            {specs.Body && (
              <div className="spec-item">
                <i className="fas fa-car-side"></i>
                <span className="spec-label">Body:</span>
                <span className="spec-value">{specs.Body}</span>
              </div>
            )}
            {specs.Exterior && (
              <div className="spec-item">
                <i className="fas fa-paint-brush"></i>
                <span className="spec-label">Exterior:</span>
                <span className="spec-value">{specs.Exterior}</span>
              </div>
            )}
            {specs.Location && (
              <div className="spec-item">
                <i className="fas fa-map-marker-alt"></i>
                <span className="spec-label">Location:</span>
                <span className="spec-value">{specs.Location}</span>
              </div>
            )}
          </div>

          {description && (
            <div className="car-description">
              <h4>
                <i className="fas fa-file-alt"></i> Description
              </h4>
              <p>{description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ViewModal;
