import React, { useState, useEffect } from "react";
import { getModelsForMake, getYearOptions } from "../components/data/filter";
import "./css/filters.css";

/**
 * Filters Component
 * @param {function} onApplyFilters - sends the filter data to be applied
 * @returns {JSX.Element} - rendering
 */
function Filters({ onApplyFilters }) {
  const [make, setMake] = useState("");
  const [models, setModels] = useState([]);
  const [model, setModel] = useState(""); 
  const [yearMin, setYearMin] = useState("");
  const [yearMax, setYearMax] = useState("");
  const [price, setPrice] = useState([0, 200000]);
  const [mileage, setMileage] = useState([0, 200000]);

  /**
   * Updates models based on selected make
   */
  useEffect(() => {
    if (make) {
      setModels(getModelsForMake(make));
    } else {
      setModels([]);
    }
  }, [make]);

  /**
   * Applies the selected (the whole poiint of this)
   */
  const handleApplyFilters = () => {
    const filterData = {
      make,
      model,
      priceMin: price[0],
      priceMax: price[1],
      mileageMin: mileage[0],
      mileageMax: mileage[1],
      yearMin,
      yearMax,
    };
    onApplyFilters(filterData);
  };

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
    onApplyFilters({});
  };

  return (
    <div className="filters-bar">
      <div className="filters-grid">
        {/* Make (brand) DROPDOWN*/}
        <select value={make} onChange={(e) => setMake(e.target.value)}>
          <option value="">Select Make</option>
          <option value="Audi">Audi</option>
          <option value="BMW">BMW</option>
          <option value="Mercedes-Benz">Mercedes-Benz</option>
          <option value="Porsche">Porsche</option>
          <option value="Volkswagen">Volkswagen</option>
        </select>

        {/* Model Dropdown (wont work until make is chosen) DROPDOWN */}
        <select value={model} onChange={(e) => setModel(e.target.value)} disabled={!make}>
          <option value="">Select Model</option>
          {models.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
        
        {/* Year Min DROPDOWN*/}
        <select value={yearMin} onChange={(e) => setYearMin(e.target.value)}>
          <option value="">Min Year</option>
          {getYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        
        {/* Price Range SLIDER */}
        <div className="slider-container">
          <label>Price Range: ${price[0]} - ${price[1]}</label>
          <div className="dual-slider">
            <input
              type="range"
              min="0"
              max="200000"
              value={price[0]}
              onChange={(e) =>
                setPrice([Math.min(Number(e.target.value), price[1] - 1000), price[1]])
              }
            />
            <input
              type="range"
              min="0"
              max="200000"
              value={price[1]}
              onChange={(e) =>
                setPrice([price[0], Math.max(Number(e.target.value), price[0] + 1000)])
              }
            />
          </div>
        </div>

        {/* Mileage Range [ or kilometerage (thats a word)] SLIDER */}
        <div className="slider-container">
          <label>Mileage Range (km): {mileage[0]} - {mileage[1]}</label>
          <div className="dual-slider">
            <input
              type="range"
              min="0"
              max="200000"
              value={mileage[0]}
              onChange={(e) =>
                setMileage([Math.min(Number(e.target.value), mileage[1] - 1000), mileage[1]])
              }
            />
            <input
              type="range"
              min="0"
              max="200000"
              value={mileage[1]}
              onChange={(e) =>
                setMileage([mileage[0], Math.max(Number(e.target.value), mileage[0] + 1000)])
              }
            />
          </div>
        </div>

        {/* Year Max DROPDOWN */}
        <select value={yearMax} onChange={(e) => setYearMax(e.target.value)}>
          <option value="">Max Year</option>
          {getYearOptions().map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        {/* Apply and Clear BUTTONS */}
        <div className="filter-actions">
          <button onClick={handleApplyFilters} className="apply-btn">
            Apply Filters
          </button>
          <button onClick={handleClearFilters} className="filter-clear">
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}

export default Filters;
