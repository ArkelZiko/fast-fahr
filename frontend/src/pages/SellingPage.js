import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";

import Header from '../components/Header';
import NavBar from '../components/Navbar';
import SellListingCard from '../components/sellingComponents/SellListingCard.js';
import '../components/css/sellingCSS/sellingpage.css';
import CreateListingForm from '../components/sellingComponents/CreateListingForm.js';
import Footer from "../components/Footer";

function SellingPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (!authLoading) {
      if (!requireAuth()) {
        if (isMounted) setPageLoading(false);
        return;
      }

      setFetchError('');
      fetch(`${process.env.REACT_APP_API_BASE}/fetch/get_listings.php`, { credentials: 'include' })
        .then(res => {
          if (!res.ok) {
            return res.text().then(text => { throw new Error(`HTTP error! status: ${res.status}, response: ${text}`) });
          }
          return res.json();
        })
        .then(allListingsData => {
          if (isMounted) {
            if (Array.isArray(allListingsData)) {
              const userSpecificListings = allListingsData.filter(
                listing => listing.user_id === currentUser.id
              );
              setMyListings(userSpecificListings);
            } else {
              setFetchError("Failed to load listings data.");
              setMyListings([]);
            }
          }
        })
        .catch(error => {
          if (isMounted) {
              setFetchError(`Failed to load listings: ${error.message}`);
              setMyListings([]);
          }
        })
        .finally(() => {
          if (isMounted) setPageLoading(false);
        });
    }
    return () => { isMounted = false; };
  }, [authLoading, currentUser, requireAuth]);

  const openModal = () => {
    if (!currentUser) { requireAuth(); return; }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteListing = useCallback((id) => {
    if (!currentUser) { requireAuth(); return; }
    setMyListings(currentListings => currentListings.filter(listing => listing.id !== id));
    alert(`Listing ${id} deleted (simulation). Implement API call.`);
  }, [currentUser, requireAuth]);

  const handleEditListing = useCallback((id) => {
    if (!currentUser) { requireAuth(); return; }
    alert(`Edit action for listing ${id} triggered (simulation). Implement edit functionality.`);
  }, [currentUser, requireAuth]);

  const handlePublishListing = useCallback(async (formData) => {
    if (!currentUser) { requireAuth(); return; }
    try {

        alert('Listing submitted (simulation)! Implement API call.');

        const simulatedNewListing = {
            id: Date.now(),
            user_id: currentUser.id,
            title: formData.get('title') || 'New Listing',
            image_path: '/images/default-car.png',
            price: formData.get('price') || 0,
            mileage: formData.get('mileage') || 0,
            year: formData.get('year') || new Date().getFullYear(),
        };
        setMyListings(prevListings => [simulatedNewListing, ...prevListings]);

        closeModal();

    } catch (error) {
        alert(`Failed to publish listing: ${error.message}. Please try again.`);
    }
  }, [currentUser, requireAuth, closeModal]);


  if (authLoading || pageLoading) {
    return (
      <div className="selling-page">
        <Header /> <NavBar />
        <div className="loading-page">Loading your listings...</div>
        <Footer />
      </div>
    );
  }
  if (!currentUser) {
    return null;
  }

  return (
    <div className="selling-page">
      <Header />
      <NavBar />
      <div className="selling-content-wrapper">

        <div className="my-listings-header">
          <h2>My Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openModal}>
            <i className="fas fa-plus"></i> Create Listing
          </button>
        </div>

        {fetchError && <div className="error-banner">{fetchError}</div>}

        <section className="my-listings-section">
          {!fetchError && myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map((listing) => (
                <SellListingCard
                  key={listing.id}
                  title={listing.title}
                  image={listing.image_path ? `${process.env.REACT_APP_STATIC_BASE}${listing.image_path}` : '/images/default-car.png'}
                  price={listing.price}
                  mileage={listing.mileage}
                  year={listing.year}
                  onEdit={() => handleEditListing(listing.id)}
                  onDelete={() => handleDeleteListing(listing.id)}
                />
              ))}
            </div>
          ) : !fetchError ? (
            <p className="no-listings-message">You haven't created any listings yet.</p>
          ) : null }
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