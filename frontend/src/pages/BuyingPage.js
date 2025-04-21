import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../hooks/useAuth";
import BuyListingCard from "../components/buyingComponents/BuyListingCard";
import "../components/css/buyingCSS/buyingpage.css";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings.js";
import Footer from "../components/Footer";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import { fetchBookmarks, toggleBookmark } from "../hooks/useBookmarks";

function BuyingPage() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    if (!authLoading) {
      setPageLoading(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading) {
        let isMounted = true;
        setFetchError('');
        setPageLoading(true);

        fetch(`${process.env.REACT_APP_API_BASE}/listings/get_listings.php`, { credentials: 'omit' })
            .then((res) => {
                if (!res.ok) {
                    return res.text().then(text => { throw new Error(`HTTP error! status: ${res.status}, response: ${text}`) });
                }
                return res.json();
            })
            .then((data) => {
                if (isMounted) {
                    if (Array.isArray(data)) {
                        setListings(data);
                        setFilteredListings(data);
                    } else {
                        setFetchError("Failed to load listings: Invalid data format.");
                        setListings([]);
                        setFilteredListings([]);
                    }
                }
            })
            .catch((error) => {
                if (isMounted) setFetchError(`Failed to load listings: ${error.message}`);
            })
            .finally(() => {
                if (isMounted) setPageLoading(false);
            });

        return () => { isMounted = false; };
    }
  }, [authLoading]); 

  useEffect(() => {
    let isMounted = true;
    if (currentUser) {
      fetchBookmarks()
        .then((data) => {
          if (isMounted) {
            if (Array.isArray(data)) {
              setBookmarkedIds(new Set(data.map((post) => post.id)));
            } else {
              setBookmarkedIds(new Set());
            }
          }
        })
        .catch((error) => {
          if (isMounted) setBookmarkedIds(new Set());
        });
    } else {
      if (isMounted) setBookmarkedIds(new Set());
    }
    return () => { isMounted = false; };
  }, [currentUser]);


  const handleBookmark = useCallback(async (id) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const isCurrentlyBookmarked = bookmarkedIds.has(id);
    try {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        isCurrentlyBookmarked ? next.delete(id) : next.add(id);
        return next;
      });
      await toggleBookmark(id, isCurrentlyBookmarked);
    } catch (e) {
      setBookmarkedIds((prev) => {
        const next = new Set(prev);
        isCurrentlyBookmarked ? next.add(id) : next.delete(id);
        return next;
      });
    }
  }, [currentUser, navigate, bookmarkedIds]);

  const handleContact = useCallback((creatorUserId, creatorUsername) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }
    navigate('/messages', {
      state: {
        openAddContactModal: true,
        prefillUsername: creatorUsername
      }
    });
  }, [currentUser, navigate]);

  // --- HANDKLE THE VIEW BUTTON STUFF ---
  const handleView = useCallback((listingId, title = 'Listing') => {
    alert(`Viewing details for ${title} (ID: ${listingId})`);
  }, []);


  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const applyFilters = useCallback((filters) => {
    const filtered = filterListings(listings, filters);
    setFilteredListings(filtered);
    closeFilterModal();
  }, [listings]);

  const clearFilters = useCallback(() => {
    setFilteredListings(listings);
    closeFilterModal();
  }, [listings]);

  if (pageLoading) {
    return (
      <div className="buying-page">
        <Header /> <NavBar /> <div className="loading-page">Loading Listings...</div> <Footer />
      </div>
    );
  }

  return (
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="buying-content-wrapper">
        <div className="my-listings-header">
          <h2>Current Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openFilterModal}>
            <i className="fas fa-filter"></i> Filter Listings
          </button>
        </div>

        {fetchError && <div className="error-banner">{fetchError}</div>}

        <div className="my-listings-grid">
          {!fetchError && filteredListings.length > 0 ? (
            filteredListings.map((car) => (
              <BuyListingCard
                key={car.id}
                title={car.title}
                image={car.image_path ? `${process.env.REACT_APP_STATIC_BASE}${car.image_path}` : '/images/default-car.png'}
                price={car.price}
                mileage={car.mileage}
                year={car.year}
                isBookmarked={!!currentUser && bookmarkedIds.has(car.id)}
                onBookmark={() => handleBookmark(car.id)}
                onContact={() => handleContact(car.user_id, car.creator_username)}
                onView={() => handleView(car.id, car.title)}
              />
            ))
          ) : !fetchError ? (
            <p className="no-listings-message">No cars found matching the current filters.</p>
          ) : null }
        </div>
      </div>
      <Footer />

      {isFilterModalOpen && (
        <div className="modal-overlay" onClick={closeFilterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <Filters
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              isModal
              onClose={closeFilterModal}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyingPage;