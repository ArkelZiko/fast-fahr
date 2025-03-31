import React, { useEffect, useState } from 'react';
import '../css/sellingCSS/createlistingform.css'; // Or dedicated filter CSS if preferred
import { getModelsForMake, getYearOptions } from '../data/selling.js';

function FilterListings({ onSubmit, onClose }) {
  // Filter fields
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [kmsMin, setKmsMin] = useState('');
  const [kmsMax, setKmsMax] = useState('');

  // Dependent state for model options
  const [modelOptions, setModelOptions] = useState([]);

  // Define available options (adjust as needed)
  const makes = ['Audi', 'BMW', 'Mercedes-Benz', 'Porsche', 'Volkswagen'];
  const yearsOptions = getYearOptions(1990); // Only vehicles newer than 1990

  // Update model options when make changes
  useEffect(() => {
    if (make) {
      setModelOptions(getModelsForMake(make));
      setModel('');
    } else {
      setModelOptions([]);
      setModel('');
    }
  }, [make]);

  // Handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    const filterData = {
      make,
      model,
      year,
      priceMin: priceMin ? parseFloat(priceMin) : null,
      priceMax: priceMax ? parseFloat(priceMax) : null,
      kmsMin: kmsMin ? parseFloat(kmsMin) : null,
      kmsMax: kmsMax ? parseFloat(kmsMax) : null,
    };
    onSubmit(filterData);
  };

  return (
    <form className="create-listing-form" onSubmit={handleSubmit}>
      <div className="modal-header">
        <h2>Filter Listings</h2>
        <button type="button" className="close-modal-btn" onClick={onClose} aria-label="Close">
          ×
        </button>
      </div>

      {/* --- Basic Vehicle Info for Filtering --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="make">Make</label>
          <select id="make" name="make" value={make} onChange={(e) => setMake(e.target.value)}>
            <option value="">Any</option>
            {makes.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="model">Model</label>
          <select
            id="model"
            name="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!make || modelOptions.length === 0}
          >
            <option value="">{make ? 'Any' : '--'}</option>
            {modelOptions.map((mod) => (
              <option key={mod} value={mod}>
                {mod}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="year">Year</label>
          <select id="year" name="year" value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Any</option>
            {yearsOptions.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* --- Price Range --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="priceMin">Min Price ($)</label>
          <input
            type="number"
            id="priceMin"
            name="priceMin"
            value={priceMin}
            onChange={(e) => setPriceMin(e.target.value)}
            placeholder="e.g., 10000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="priceMax">Max Price ($)</label>
          <input
            type="number"
            id="priceMax"
            name="priceMax"
            value={priceMax}
            onChange={(e) => setPriceMax(e.target.value)}
            placeholder="e.g., 50000"
          />
        </div>
      </div>

      {/* --- Kilometers Range --- */}
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="kmsMin">Min Kilometers</label>
          <input
            type="number"
            id="kmsMin"
            name="kmsMin"
            value={kmsMin}
            onChange={(e) => setKmsMin(e.target.value)}
            placeholder="e.g., 10000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="kmsMax">Max Kilometers</label>
          <input
            type="number"
            id="kmsMax"
            name="kmsMax"
            value={kmsMax}
            onChange={(e) => setKmsMax(e.target.value)}
            placeholder="e.g., 50000"
          />
        </div>
      </div>

      {/* --- Form Actions --- */}
      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onClose}>
          Cancel
        </button>
        <button type="submit" className="publish-btn">
          <i className="fas fa-filter"></i> Apply Filters
        </button>
      </div>
    </form>
  );
}

export default FilterListings;
