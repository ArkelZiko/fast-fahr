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
    if (make) setModels(getModelsForMake(make));
    else setModels([]);
  }, [make]);

  const handleClearFilters = () => {
    setMake("");
    setModel("");
    setYearMin("");
    setYearMax("");
    setPrice([0, 200000]);
    setMileage([0, 200000]);
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
    <form className={`filters-bar ${isModal ? "modal-form" : ""}`} onSubmit={handleSubmit}>
      {isModal && (
        <div className="modal-header">
          <h2>Filter Listings</h2>
          <button type="button" className="close-modal-btn" onClick={onClose}>×</button>
        </div>
      )}

      <div className="filters-grid">
        <div className="filter-group">
          <label>Make</label>
          <select value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Select Make</option>
            <option value="Audi">Audi</option>
            <option value="BMW">BMW</option>
            <option value="Mercedes-Benz">Mercedes-Benz</option>
            <option value="Porsche">Porsche</option>
            <option value="Volkswagen">Volkswagen</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Model</label>
          <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
            <option value="">Select Model</option>
            {models.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Min Year</label>
          <select value={yearMin} onChange={(e) => setYearMin(e.target.value)}>
            <option value="">Min Year</option>
            {getYearOptions().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        <div className="slider-container filter-group">
          <label>Price Range: ${price[0].toLocaleString()} - ${price[1].toLocaleString()}</label>
          <div className="dual-slider" style={{ "--left-thumb": `${(price[0] / 200000) * 100}%`, "--right-thumb": `${(price[1] / 200000) * 100}%` }}>
            <input type="range" min="0" max="200000" step="1000" value={price[0]} onChange={(e) => setPrice([Math.min(Number(e.target.value), price[1] - 1000), price[1]])} />
            <input type="range" min="0" max="200000" step="1000" value={price[1]} onChange={(e) => setPrice([price[0], Math.max(Number(e.target.value), price[0] + 1000)])} />
          </div>
        </div>

        <div className="slider-container filter-group">
          <label>Mileage: {mileage[0].toLocaleString()}km - {mileage[1].toLocaleString()}km</label>
          <div className="dual-slider" style={{ "--left-thumb": `${(mileage[0] / 200000) * 100}%`, "--right-thumb": `${(mileage[1] / 200000) * 100}%` }}>
            <input type="range" min="0" max="200000" step="1000" value={mileage[0]} onChange={(e) => setMileage([Math.min(Number(e.target.value), mileage[1] - 1000), mileage[1]])} />
            <input type="range" min="0" max="200000" step="1000" value={mileage[1]} onChange={(e) => setMileage([mileage[0], Math.max(Number(e.target.value), mileage[0] + 1000)])} />
          </div>
        </div>

        <div className="filter-group">
          <label>Max Year</label>
          <select value={yearMax} onChange={(e) => setYearMax(e.target.value)}>
            <option value="">Max Year</option>
            {getYearOptions().map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="button"
        className={`more-filters ${showAdvancedFilters ? "expanded" : ""}`}
        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
      >
        {showAdvancedFilters ? "Fewer Filters" : "More Filters"}
        <span className="arrow-icon">▼</span>
      </button>

      {showAdvancedFilters && (
        <div className={`advanced-filters-wrapper ${showAdvancedFilters ? "show" : ""}`}>
          <div className="advanced-filters-grid">
            {[
              ["Transmission", transmission, setTransmission, ["Automatic", "Manual"]],
              ["Drive Type", driveType, setDriveType, ["FWD", "RWD", "AWD"]],
              ["Exterior Color", exteriorColor, setExteriorColor, ["Black", "White", "Silver", "Gray", "Blue", "Red", "Green", "Brown", "Beige", "Orange", "Gold", "Purple", "Other"]],
              ["Fuel Type", fuelType, setFuelType, ["Gasoline", "Diesel", "Electric", "Hybrid"]],
              ["Body Type", bodyType, setBodyType, ["Sedan", "SUV", "Coupe", "Convertible", "Hatchback", "Wagon", "Truck", "Other"]],
              ["Province", province, setProvince, ["ON", "QC", "BC", "AB", "MB", "NB", "NS", "PE", "SK", "NL"]],
            ].map(([label, value, setter, options]) => (
              <div key={label} className="filter-group">
                <label>{label}</label>
                <select value={value} onChange={(e) => setter(e.target.value)}>
                  <option value="">Any</option>
                  {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}

            <div className="filter-group">
              <label>City</label>
              <input type="text" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Enter City" />
            </div>
          </div>
        </div>
      )}

      <div className="filter-actions">
        <button type={isModal ? "submit" : "button"} className="apply-btn" onClick={!isModal ? handleSubmit : undefined}>Apply Filters</button>
        {onClearFilters && (
          <button type="button" className="filter-clear" onClick={() => { handleClearFilters(); if (onClearFilters) onClearFilters(); }}>Clear Filters</button>
        )}
      </div>
    </form>
  );
}

export default Filters;
