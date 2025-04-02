import React, { useState } from "react";
import BuyListingCard from "../components/buyingComponents/BuyListingCard"; // (or SellListingCard if you prefer the same card in both pages)
import "../components/css/buyingCSS/buyingpage.css";
import listings from "../components/data/listings.js";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings.js";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NavBar from "../components/Navbar";

function BuyingPage() {
  const [filteredListings, setFilteredListings] = useState(listings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);


  const applyFilters = (filters) => {
    const filtered = filterListings(listings, filters);
    setFilteredListings(filtered); // for HomePage

    closeModal();
  };

  const clearFilters = () => {
    setFilteredListings(listings);
  };

  return (
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="buying-content-wrapper">
        <div className="my-listings-header">
          <h2>Current Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openModal}>
            <i className="fas fa-filter"></i> Filter Listings
          </button>
        </div>
        <div className="my-listings-grid">
          {filteredListings.length > 0 ? (
            filteredListings.map((car) => (
              <BuyListingCard
                key={car.id}
                title={car.title}
                image={car.image}
                price={car.price}
                mileage={car.mileage}
                year={car.year}
              />
            ))
          ) : (
            <p>No cars found matching the filters.</p>
          )}
        </div>
      </div>
      <Footer />

      {/* --- Filter Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Filters
              onApplyFilters={applyFilters} 
              onClearFilters={clearFilters} 
              isModal
              onClose={closeModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyingPage;