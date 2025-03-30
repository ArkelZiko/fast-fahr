import React from "react";
import "./css/filters.css";

function Filters() {
  return (
    <div className="filters-bar">
      <div className="filters-left">
        <button className="filter-btn">Vehicle Make ⌄</button>
        <button className="filter-btn">Vehicle Type ⌄</button>
        <button className="filter-btn">Price ⌄</button>
        <button className="filter-btn">Year ⌄</button>
      </div>
      <button className="filter-clear">Clear Filters</button>
    </div>
  );
}

export default Filters;
