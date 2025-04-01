import React, { useState } from "react";
import { getModelsForMake, getYearOptions } from "../components/data/filter";
import "./css/filters.css";

function Filters({ onApplyFilters }) {
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [priceMin, setPriceMin] = useState("");
  const [priceMax, setPriceMax] = useState("");
  const [mileageMin, setMileageMin] = useState("");
  const [mileageMax, setMileageMax] = useState("");

  const handleApplyFilters = () => {
    onApplyFilters({
      make,
      model,
      year,
      priceMin,
      priceMax,
      mileageMin,
      mileageMax,
    });
  };

  const handleClearFilters = () => {
    setMake("");
    setModel("");
    setYear("");
    setPriceMin("");
    setPriceMax("");
    setMileageMin("");
    setMileageMax("");
    onApplyFilters({});
  };

  return (
    <div className="filters-bar">
      <div className="filters-left">
        {/* Make/Vehicle Type */}
        <select
          value={make}
          onChange={(e) => setMake(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Vehicle Make</option>
          <option value="Audi">Audi</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="Porsche">Porsche</option>
          <option value="Volkswagen">Volkswagen</option>
        </select>

        {/* Model - Dynamic based on Make */}
        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          disabled={!make}
          className="filter-dropdown"
        >
          <option value="">Vehicle Type</option>
          {getModelsForMake(make).map((model) => (
            <option key={model} value={model}>
              {model}
            </option>
          ))}
        </select>

        {/* Price Min */}
        <input
          type="number"
          placeholder="Min Price"
          value={priceMin}
          onChange={(e) => setPriceMin(e.target.value)}
          className="filter-input"
        />

        {/* Price Max */}
        <input
          type="number"
          placeholder="Max Price"
          value={priceMax}
          onChange={(e) => setPriceMax(e.target.value)}
          className="filter-input"
        />

        {/* Year */}
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="filter-dropdown"
        >
          <option value="">Year</option>
          {getYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Mileage Min */}
        <input
          type="number"
          placeholder="Min Mileage"
          value={mileageMin}
          onChange={(e) => setMileageMin(e.target.value)}
          className="filter-input"
        />

        {/* Mileage Max */}
        <input
          type="number"
          placeholder="Max Mileage"
          value={mileageMax}
          onChange={(e) => setMileageMax(e.target.value)}
          className="filter-input"
        />
      </div>

      <div className="filter-actions">
        <button onClick={handleApplyFilters} className="apply-btn">
          Apply Filters
        </button>
        <button onClick={handleClearFilters} className="filter-clear">
          Clear Filters
        </button>
      </div>
    </div>
  );
}

export default Filters;
