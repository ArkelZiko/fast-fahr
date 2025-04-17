import React, { useState, useEffect } from "react";
import BuyListingCard from "../components/buyingComponents/BuyListingCard"; // (or SellListingCard if you prefer the same card in both pages)
import "../components/css/buyingCSS/buyingpage.css";
import listings from "../components/data/listings.js";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings.js";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NavBar from "../components/Navbar";

function BuyingPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/fetch/get_listings.php`) //no longer using listings.js info now coming from the db
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFilteredListings(data); //defaults to date added since thats how it was stored
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const applyFilters = (filters) => {
    const filtered = filterListings(listings, filters);
    setFilteredListings(filtered);

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
                image={`${process.env.REACT_APP_STATIC_BASE}/${car.image_path}`}
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