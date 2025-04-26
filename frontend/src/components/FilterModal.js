/**
 * File:         Filters.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 22nd, 2025
 * Description:  Component providing filtering options for car listings.
 *               Includes dropdowns for make, model, year, and sliders for
 *               price and mileage ranges. Can be used standalone or within a modal.
 */

import React, { useEffect, useState } from "react";
import "./css/filtermodal.css";
import { getModelsForMake, getYearOptions } from "./data/selling";

/**
 * Renders filter controls for listings.
 * @param {object} props - Component properties.
 * @param {function} props.onApplyFilters - Callback function to apply selected filters.
 * @param {function} [props.onClearFilters] - Optional callback function to clear filters.
 * @param {boolean} [props.isModal=false] - Flag indicating if component is rendered in a modal.
 * @param {function} [props.onClose] - Optional callback function to close the modal (if isModal is true).
 * @returns {JSX.Element} The Filters component.
 */
function Filters({ onApplyFilters, onClearFilters, isModal = false, onClose }) {
  const [make, setMake] = useState("");
  const [models, setModels] = useState([]);
  const [model, setModel] = useState("");
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [price, setPrice] = useState([0, 200000]);
  const [mileage, setMileage] = useState([0, 200000]);
  const [transmission, setTransmission] = useState("");
  const [driveType, setDriveType] = useState("");
  const [exteriorColor, setExteriorColor] = useState("");
  const [fuelType, setFuelType] = useState("");
  const [bodyType, setBodyType] = useState("");
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  useEffect(() => {
    if (make) {
      setModels(getModelsForMake(make));
    } else {
      setModels([]);
    }
  }, [make]);

  /**
   * Clears all filters and resets to default values
   */
  const handleClearFilters = () => {
    setMake("");
    setModel("");
    setYearMin("");
    setYearMax("");
    setPrice([0, 200000]);
    setMileage([0, 200000]);
    setTransmission("");
    setDriveType("");
    setExteriorColor("");
    setFuelType("");
    setBodyType("");
    setProvince("");
    setCity("");
    onApplyFilters({});
  };

  const handleSubmit = (event) => {
    if (event) event.preventDefault();
    const filterData = {
      make,
      model,
      priceMin: price[0],
      priceMax: price[1],
      mileageMin: mileage[0],
      mileageMax: mileage[1],
      yearMin,
      yearMax,
      transmission,
      driveType,
      exteriorColor,
      fuelType,
      bodyType,
      province,
      city,
    };
    onApplyFilters(filterData);
    if (isModal && onClose) onClose();
  };

  return (
    <form
      className={`filters-bar ${isModal ? "modal-form" : ""}`}
      onSubmit={handleSubmit}
    >
      {isModal && (
        <div className="modal-header">
          <h2>Filter Listings</h2>
          <button type="button" className="close-modal-btn" onClick={onClose}>
            ×
          </button>
        </div>
      )}

      <div className="filters-grid">
        {/* Make (brand) DROPDOWN*/}
        <div className="filter-group">
          <label>Make</label>
          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Any </option>
            <option value="Audi">Audi</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Porsche">Porsche</option>
            <option value="Volkswagen">Volkswagen</option>
          </select>
        </div>

        {/* Model Dropdown */}
        <div className="filter-group">
          <label>Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make}
          >
            <option value="">Any</option>
            {models.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Min Dropdown */}
        <div className="filter-group">
          <label>Min Year</label>
          <select value={yearMin} onChange={(e) => setYearMin(e.target.value)}>
            <option value="">Any</option>
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Price Range SLIDER */}
        <div className="filter-group">
          <label>
            Price Range: ${price[0].toLocaleString()} - $
            {price[1].toLocaleString()}
          </label>
          <div
            className="dual-slider"
            style={{
              "--left-thumb": `${(price[0] / 200000) * 100}%`,
              "--right-thumb": `${(price[1] / 200000) * 100}%`,
            }}
          >
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={price[0]}
              onChange={(e) =>
                setPrice([
                  Math.min(Number(e.target.value), price[1] - 1000),
                  price[1],
                ])
              }
            />
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={price[1]}
              onChange={(e) =>
                setPrice([
                  price[0],
                  Math.max(Number(e.target.value), price[0] + 1000),
                ])
              }
            />
          </div>
        </div>

        {/* Mileage Range [ or kilometerage (thats a word)] SLIDER */}
        <div className="filter-group">
          <label>
            Mileage: {mileage[0].toLocaleString()}km -{" "}
            {mileage[1].toLocaleString()}km
          </label>
          <div
            className="dual-slider"
            style={{
              "--left-thumb": `${(mileage[0] / 200000) * 100}%`,
              "--right-thumb": `${(mileage[1] / 200000) * 100}%`,
            }}
          >
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={mileage[0]}
              onChange={(e) =>
                setMileage([
                  Math.min(Number(e.target.value), mileage[1] - 1000),
                  mileage[1],
                ])
              }
            />
            <input
              type="range"
              min="0"
              max="200000"
              step="1000"
              value={mileage[1]}
              onChange={(e) =>
                setMileage([
                  mileage[0],
                  Math.max(Number(e.target.value), mileage[0] + 1000),
                ])
              }
            />
          </div>
        </div>

        {/* Year Max DROPDOWN */}
        <div className="filter-group">
          <label>Max</label>
          <select value={yearMax} onChange={(e) => setYearMax(e.target.value)}>
            <option value="">Any</option>
            {getYearOptions().map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="filter-top-row">
        <button
          type="button"
          className={`more-filters ${showAdvancedFilters ? "expanded" : ""}`}
          onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
        >
          {showAdvancedFilters ? "Fewer Filters" : "More Filters"}
          <span className="arrow-icon">▼</span>
        </button>

        {!showAdvancedFilters && (
          <div className="action-buttons">
            <button
              type={isModal ? "submit" : "button"}
              className="apply-btn"
              onClick={!isModal ? handleSubmit : undefined}
            >
              Apply Filters
            </button>
            {onClearFilters && (
              <button
                type="button"
                className="filter-clear"
                onClick={() => {
                  handleClearFilters();
                  if (onClearFilters) onClearFilters();
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        )}
      </div>

      {showAdvancedFilters && (
        <div
          className={`advanced-filters-wrapper ${
            showAdvancedFilters ? "show" : ""
          }`}
        >
          <div className="advanced-filters-grid">
            {/* Transmission Dropdown */}
            <div className="filter-group">
              <label>Transmission</label>
              <select
                value={transmission}
                onChange={(e) => setTransmission(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Automatic">Automatic</option>
                <option value="Manual">Manual</option>
              </select>
            </div>

            {/* Drive Type Dropdown */}
            <div className="filter-group">
              <label>Drive Type</label>
              <select
                value={driveType}
                onChange={(e) => setDriveType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="FWD">FWD</option>
                <option value="RWD">RWD</option>
                <option value="AWD">AWD</option>
              </select>
            </div>

            {/* Exterior Color Dropdown */}
            <div className="filter-group">
              <label>Exterior Color</label>
              <select
                value={exteriorColor}
                onChange={(e) => setExteriorColor(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Black">Black</option>
                <option value="White">White</option>
                <option value="Silver">Silver</option>
                <option value="Gray">Gray</option>
                <option value="Blue">Blue</option>
                <option value="Red">Red</option>
                <option value="Green">Green</option>
                <option value="Brown">Brown</option>
                <option value="Beige">Beige</option>
                <option value="Orange">Orange</option>
                <option value="Gold">Gold</option>
                <option value="Purple">Purple</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Fuel Type Dropdown */}
            <div className="filter-group">
              <label>Fuel Type</label>
              <select
                value={fuelType}
                onChange={(e) => setFuelType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Gasoline">Gasoline</option>
                <option value="Diesel">Diesel</option>
                <option value="Electric">Electric</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            {/* Body Type Dropdown */}
            <div className="filter-group">
              <label>Body Type</label>
              <select
                value={bodyType}
                onChange={(e) => setBodyType(e.target.value)}
              >
                <option value="">Any</option>
                <option value="Sedan">Sedan</option>
                <option value="SUV">SUV</option>
                <option value="Coupe">Coupe</option>
                <option value="Convertible">Convertible</option>
                <option value="Hatchback">Hatchback</option>
                <option value="Wagon">Wagon</option>
                <option value="Truck">Truck</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Province Dropdown */}
            <div className="filter-group">
              <label>Province</label>
              <select
                value={province}
                onChange={(e) => setProvince(e.target.value)}
              >
                <option value="">Any</option>
                <option value="ON">Ontario</option>
                <option value="QC">Quebec</option>
                <option value="BC">British Columbia</option>
                <option value="AB">Alberta</option>
                <option value="MB">Manitoba</option>
                <option value="NB">New Brunswick</option>
                <option value="NS">Nova Scotia</option>
                <option value="PE">Prince Edward Island</option>
                <option value="SK">Saskatchewan</option>
                <option value="NL">Newfoundland and Labrador</option>
              </select>
            </div>

            {/* City Text Input */}
            <div className="filter-group">
              <label>City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Enter City"
              />
            </div>
          </div>
        </div>
      )}

      {/* Apply and Clear BUTTONS */}

      {showAdvancedFilters && (
        <div className="filter-actions bottom-actions">
          <button
            type={isModal ? "submit" : "button"}
            className="apply-btn"
            onClick={!isModal ? handleSubmit : undefined}
          >
            Apply Filters
          </button>
          {onClearFilters && (
            <button
              type="button"
              className="filter-clear"
              onClick={() => {
                handleClearFilters();
                if (onClearFilters) onClearFilters();
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      )}
    </form>
  );
}

export default Filters;
