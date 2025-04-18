import React, { useState, useEffect } from "react";
import BuyListingCard from "../components/buyingComponents/BuyListingCard";
import "../components/css/buyingCSS/buyingpage.css";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings.js";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { fetchBookmarks, toggleBookmark } from "../hooks/useBookmarks";

function BuyingPage() {
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch listings from backend
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/fetch/get_listings.php`)
      .then((res) => res.json())
      .then((data) => {
        setListings(data);
        setFilteredListings(data);
      })
      .catch((error) => console.error("Error fetching listings:", error));
  }, []);

  // Fetch user's bookmarked listing IDs
  useEffect(() => {
    fetchBookmarks()
      .then((data) => {
        setBookmarkedIds(new Set(data.map((post) => post.id)));
      })
      .catch((error) => console.error("Error fetching bookmarks:", error));
  }, []);

  // Toggle bookmark state for a given post ID
  const handleBookmark = async (id) => {
    try {
      const newState = await toggleBookmark(id, bookmarkedIds.has(id));
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        newState ? next.add(id) : next.delete(id);
        return next;
      });
    } catch (e) {
      console.error(e);
      alert(e.message);
    }
  };

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
                isBookmarked={bookmarkedIds.has(car.id)}
                onBookmark={() => handleBookmark(car.id)}
              />
            ))
          ) : (
            <p>No cars found matching the filters.</p>
          )}
        </div>
      </div>
      <Footer />

      {/* Filter Modal */}
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
