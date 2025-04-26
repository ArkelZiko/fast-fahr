/**
 * File:         BuyingPage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 20th, 2025 (Date reflects latest functional version provided)
 * Description:  Page component for displaying available car listings for purchase.
 *               Fetches all listings, allows filtering via a modal, displays listings
 *               using ListingCard, handles bookmarking, contacting seller (via MessagesPage),
 *               and viewing listing details via a modal. Adapts functionality based on
 *               user login status (redirects interaction attempts if not logged in).
 */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ViewModal from "../components/buyingComponents/ViewModal";
import "../components/css/buyingCSS/buyingpage.css";
import filterListings from "../components/filterListingsComponent/filterListings";
import FilterModal from "../components/FilterModal";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard";
import NavBar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { fetchBookmarks, toggleBookmark } from "../hooks/useBookmarks";

/**
 * Renders the Buying page, displaying car listings available for purchase.
 * Includes filtering, bookmarking, contacting, and viewing functionality.
 * Allows public viewing but redirects interactions for non-logged-in users.
 * @returns {JSX.Element} The BuyingPage component.
 */
function BuyingPage() {
  const { currentUser, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [viewerImages, setViewerImages] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    if (!authLoading) {
      setPageLoading(false);
    }
  }, [authLoading]);

  useEffect(() => {
    if (!authLoading) {
      let isMounted = true;
      setFetchError("");
      setPageLoading(true);

      fetch(`${process.env.REACT_APP_API_BASE}/listings/get_listings.php`, {
        credentials: "omit",
      })
        .then((res) => {
          if (!res.ok) {
            return res.text().then((text) => {
              throw new Error(
                `HTTP error! status: ${res.status}, response: ${text}`
              );
            });
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
          if (isMounted)
            setFetchError(`Failed to load listings: ${error.message}`);
        })
        .finally(() => {
          if (isMounted) setPageLoading(false);
        });

      return () => {
        isMounted = false;
      };
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
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  const handleBookmark = useCallback(
    async (id) => {
      if (!currentUser) {
        navigate("/login");
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
    },
    [currentUser, navigate, bookmarkedIds]
  );

  const handleContact = useCallback(
    (creatorUserId, creatorUsername) => {
      if (!currentUser) {
        navigate("/login");
        return;
      }
      navigate("/messages", {
        state: {
          openAddContactModal: true,
          prefillUsername: creatorUsername,
        },
      });
    },
    [currentUser, navigate]
  );

  // --- HANDKLE THE VIEW BUTTON STUFF ---
  const handleView = useCallback((car) => {
    fetch(
      `${process.env.REACT_APP_API_BASE}/listings/image_listings.php?post_id=${car.id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setViewerImages(data);
          setSelectedCar(car);
          setIsViewerOpen(true);
        } else {
          alert("Failed to load images.");
        }
      })
      .catch(() => alert("Failed to load images."));
  }, []);

  const openFilterModal = () => setIsFilterModalOpen(true);
  const closeFilterModal = () => setIsFilterModalOpen(false);

  const applyFilters = useCallback(
    (filters) => {
      const filtered = filterListings(listings, filters);
      setFilteredListings(filtered);
      closeFilterModal();
    },
    [listings]
  );

  const clearFilters = useCallback(() => {
    setFilteredListings(listings);
    closeFilterModal();
  }, [listings]);

  if (pageLoading) {
    return (
      <div className="buying-page">
        <Header /> <NavBar />{" "}
        <div className="loading-page">Loading Listings...</div> <Footer />
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
          <button
            className="create-listing-btn-trigger"
            onClick={openFilterModal}
          >
            <i className="fas fa-filter"></i> Filter Listings
          </button>
        </div>

        {fetchError && <div className="error-banner">{fetchError}</div>}

        <div className="my-listings-grid">
          {!fetchError && filteredListings.length > 0 ? (
            filteredListings.map((car) => (
              <ListingCard
                key={car.id}
                title={car.title}
                image={
                  car.image_path
                    ? `${process.env.REACT_APP_STATIC_BASE}${car.image_path}`
                    : "/images/default-car.png"
                }
                price={car.price}
                mileage={car.mileage}
                year={car.year}
                isBookmarked={!!currentUser && bookmarkedIds.has(car.id)}
                onBookmarkToggle={(next) => handleBookmark(car.id)}
                onContact={() =>
                  handleContact(car.user_id, car.creator_username)
                }
                onView={() => handleView(car)}
                context="buying"
              />
            ))
          ) : !fetchError ? (
            <p className="no-listings-message">
              No cars found matching the current filters.
            </p>
          ) : null}
        </div>
      </div>

      {isFilterModalOpen && (
        <div className="modal-overlay" onClick={closeFilterModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <FilterModal
              onApplyFilters={applyFilters}
              onClearFilters={clearFilters}
              isModal
              onClose={closeFilterModal}
            />
          </div>
        </div>
      )}

      {isViewerOpen && (
        <ViewModal
          images={viewerImages}
          onClose={() => setIsViewerOpen(false)}
          title={selectedCar.title}
          year={selectedCar.year}
          price={selectedCar.price}
          description={selectedCar.description}
          specs={{
            Make: selectedCar.make,
            Model: selectedCar.model,
            Kilometers: `${Number(selectedCar.mileage).toLocaleString()} km`,
            Transmission: selectedCar.transmission,
            Drive: selectedCar.driveType,
            Body: selectedCar.bodyType,
            Exterior: selectedCar.exteriorColor,
            Fuel: selectedCar.fuelType,
            Location: `${selectedCar.city}, ${selectedCar.province}`,
          }}
        />
      )}

      <Footer />
    </div>
  );
}

export default BuyingPage;
