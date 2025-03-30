import React from "react";
import "./css/card.css";
import main_tile from "./images/main_tile.png";

function Card({}) {
  return (
    <div className="main-tile">
      <img src={main_tile} alt="Main Tile" className="main-tile-image" />
      <div className="main-tile-content">
        <h3 className="main-tile-title">
          <strong>Power. Prestige. Price.</strong>
        </h3>
        <p className="main-tile-subtitle">
          <strong>Explore premium performance at low prices</strong>
        </p>
      </div>
    </div>
  );
}

export default Card;
