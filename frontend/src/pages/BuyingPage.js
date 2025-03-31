import React, { useState } from 'react';
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import FilterListings from "../components/buyingComponents/FilterListings";
import BuyListingCard from "../components/buyingComponents/BuyListingCard";
// (or SellListingCard if you prefer the same card in both pages)
import listings from "../components/data/listings.js";
import "../components/css/buyingCSS/buyingpage.css";
import Footer from "../components/Footer";

function BuyingPage() {
  const [myListings, setMyListings] = useState(listings);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  //filtering logici which is borrowed from selllistings
  const handleFilterListings = (filterData) => {
    const filteredListings = listings.filter(listing => {
      if (filterData.make && listing.make !== filterData.make) return false;
      if (filterData.model && listing.model !== filterData.model) return false;
      if (filterData.year && String(listing.year) !== filterData.year) return false;
      if (filterData.priceMin && parseFloat(listing.price) < filterData.priceMin) return false;
      if (filterData.priceMax && parseFloat(listing.price) > filterData.priceMax) return false;
      if (filterData.kmsMin && parseFloat(listing.mileage) < filterData.kmsMin) return false;
      if (filterData.kmsMax && parseFloat(listing.mileage) > filterData.kmsMax) return false;
      return true;
    });
    setMyListings(filteredListings);
    closeModal();
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
        <section className="my-listings-section">
          {myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map((listing) => (
                <BuyListingCard
                  key={listing.id}
                  title={listing.title}
                  image={listing.image}
                  price={listing.price}
                  mileage={listing.mileage}
                  year={listing.year}
                  onView={() => alert(`Viewing listing ${listing.id}`)}
                  onContact={() => alert(`Contacting seller for listing ${listing.id}`)}
                />
              ))}
            </div>
          ) : (
            <p className="no-listings-message">No listings match your filters.</p>
          )}
        </section>
      </div>
      <Footer />

      {/* --- Filter Modal --- */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FilterListings onSubmit={handleFilterListings} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyingPage;
