import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth"; // Import useAuth

import Header from '../components/Header';
import NavBar from '../components/Navbar';
import SellListingCard from '../components/sellingComponents/SellListingCard.js';
import userListingsData from '../components/data/listings.js';
import '../components/css/sellingCSS/sellingpage.css';
import CreateListingForm from '../components/sellingComponents/CreateListingForm.js';
import Footer from "../components/Footer";


function SellingPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();

  const [myListings, setMyListings] = useState(userListingsData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!requireAuth()) {
        // Redirecting...
      } else {
        // TODO: Fetch user-specific listings using currentUser.id
      }
    }
  }, [authLoading, requireAuth, currentUser]);


  const openModal = () => {
    if (!currentUser) { requireAuth(); return; }
    setIsModalOpen(true);
  }
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteListing = (id) => {
    if (!currentUser) { requireAuth(); return; }
    // TODO: API call to delete
    setMyListings(currentListings => currentListings.filter(listing => listing.id !== id));
    alert(`Listing ${id} deleted (simulation).`);
  };

  const handleEditListing = (id) => {
    if (!currentUser) { requireAuth(); return; }
    // TODO: Implement edit
    alert(`Edit action for listing ${id} triggered (simulation).`);
  };

  const handlePublishListing = (formData) => {
    if (!currentUser) { requireAuth(); return; }
    // TODO: API call to create
    console.log("Submitting listing data:", formData);
    alert('Listing submitted (simulation)!');
    closeModal();
  };


  if (authLoading) {
    return (
      <div className="selling-page">
        <Header />
        <NavBar />
        <div className="loading-page" style={{ textAlign: 'center', padding: '50px' }}>
            Checking authentication...
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return null; // Prevent rendering if not logged in (should be redirected)
  }

  // Render page only if authenticated
  return (
    <div className="selling-page">
      <Header />
      <NavBar />
      <div className="selling-content-wrapper">

        <div className="my-listings-header">
          <h2>My Current Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openModal}>
            <i className="fas fa-plus"></i> Create Listing
          </button>
        </div>

        <section className="my-listings-section">
          {myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map((listing) => (
                <SellListingCard
                  key={listing.id}
                  title={listing.title} image={listing.image} price={listing.price}
                  mileage={listing.mileage} year={listing.year}
                  onEdit={() => handleEditListing(listing.id)}
                  onDelete={() => handleDeleteListing(listing.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-listings-message">You have no active listings.</p>
          )}
        </section>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
             <div className="modal-content" onClick={e => e.stopPropagation()}>
               <CreateListingForm
                 onSubmit={handlePublishListing}
                 onClose={closeModal}
               />
             </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default SellingPage;