// src/pages/SellingPage.js
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import NavBar from '../components/Navbar';
import SellListingCard from '../components/sellingComponents/SellListingCard.js';
import userListingsData from '../components/data/listings.js';
import '../components/css/sellingCSS/sellingpage.css';
import CreateListingForm from '../components/sellingComponents/CreateListingForm.js';

function SellingPage() {
  const [myListings, setMyListings] = useState(userListingsData); // State for user's listings
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

  // --- Event Handlers ---

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Delete Listing dummy function for now as an example
  const handleDeleteListing = (id) => {
    setMyListings(currentListings => currentListings.filter(listing => listing.id !== id));
    alert(`Listing ${id} deleted (simulation).`);

    // IN A REAL APP WE CALL AN API TO DELETE AND REMOVE FROM DATABASE!
  };

  // Edit listing dummy function for now as an exaple
  const handleEditListing = (id) => {
    alert(`Edit action for listing ${id} triggered (simulation). Open edit form/modal here.`);
    // In a real app, likely open the modal pre-filled with listing 'id' data
  };

  // Handle form submission from modal dummy function for now
  const handlePublishListing = (formData) => {
    // In a real app, send formData to the backend API
    alert('Listing submitted (simulation)! Check console.');
    // Add to UI or refetch listings after success  with AJAX!!!
    closeModal(); // Close the modal after submission
  };

  return (
    <div className="selling-page">
      <Header />
      <NavBar />
      <div className="selling-content-wrapper">

        {/* --- Header for the Listings Section --- */}
        <div className="my-listings-header">
          <h2>My Current Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openModal}>
            <i className="fas fa-plus"></i> Create Listing
          </button>
        </div>

        {/* --- Listings Grid --- */}
        <section className="my-listings-section">
          {myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map((listing) => (
                <SellListingCard
                  key={listing.id}
                  title={listing.title}
                  image={listing.image}
                  price={listing.price}
                  mileage={listing.mileage}
                  year={listing.year}
                  onEdit={() => handleEditListing(listing.id)}
                  onDelete={() => handleDeleteListing(listing.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-listings-message">You have no active listings.</p>
          )}
        </section>

        {/* --- Create Listing Modal --- */}
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
    </div>
  );
}

export default SellingPage;