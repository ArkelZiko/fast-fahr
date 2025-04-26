/**
 * File:         SellingPage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 10th, 2025 (Assumed date for initial Selling Page)
 * Description:  Page component for users to manage their own listings.
 *               Fetches and displays only the listings created by the logged-in user.
 *               Allows users to create new listings via a modal form and delete
 *               their existing listings via a confirmation modal. Includes
 *               placeholder for edit functionality.
 */

import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard.js";
import NavBar from "../components/Navbar";
import ViewModal from "../components/buyingComponents/ViewModal";
import "../components/css/sellingCSS/sellingpage.css";
import CreateListingForm from "../components/sellingComponents/CreateListingForm.js";
import DeleteListingModal from "../components/sellingComponents/DeleteListingModal.js";
import { useAuth } from "../hooks/useAuth";

/**
 * Renders the Selling page, displaying and managing the user's own listings.
 * @returns {JSX.Element|null} The SellingPage component or null if redirecting.
 */
function SellingPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
  const navigate = useNavigate();

  const [myListings, setMyListings] = useState([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [selectedListing, setSelectedListing] = useState(null);
  const [viewerImages, setViewerImages] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!authLoading) {
      if (!requireAuth()) {
        if (isMounted) setPageLoading(false);
        return;
      }

      setFetchError("");
      setPageLoading(true);
      fetch(`${process.env.REACT_APP_API_BASE}/listings/get_listings.php`, {
        credentials: "include",
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
        .then((allListingsData) => {
          if (isMounted) {
            if (Array.isArray(allListingsData)) {
              const userSpecificListings = allListingsData.filter(
                (listing) => listing.user_id === currentUser.id
              );
              setMyListings(userSpecificListings);
            } else {
              setFetchError("Failed to load listings data.");
              setMyListings([]);
            }
          }
        })
        .catch((error) => {
          if (isMounted) {
            setFetchError(`Failed to load listings: ${error.message}`);
            setMyListings([]);
          }
        })
        .finally(() => {
          if (isMounted) setPageLoading(false);
        });
    }
    return () => {
      isMounted = false;
    };
  }, [authLoading, currentUser, requireAuth]);

  const openCreateModal = () => {
    if (!currentUser) {
      requireAuth();
      return;
    }
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const openDeleteConfirmModal = useCallback(
    (id, title) => {
      if (!currentUser) {
        requireAuth();
        return;
      }
      setListingToDelete({ id, title });
      setDeleteError("");
      setIsDeleteModalOpen(true);
    },
    [currentUser, requireAuth]
  );

  const closeDeleteConfirmModal = useCallback(() => {
    if (isDeleting) return;
    setIsDeleteModalOpen(false);
    setListingToDelete(null);
    setDeleteError("");
  }, [isDeleting]);

  const handleConfirmDelete = useCallback(async () => {
    if (!currentUser || !listingToDelete) return;

    setIsDeleting(true);
    setDeleteError("");

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/listings/delete_listings.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ listing_id: listingToDelete.id }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.error || `Failed to delete listing (HTTP ${response.status})`
        );
      }

      setMyListings((currentListings) =>
        currentListings.filter((listing) => listing.id !== listingToDelete.id)
      );
      closeDeleteConfirmModal();
    } catch (error) {
      setDeleteError(error.message || "An error occurred during deletion.");
    } finally {
      setIsDeleting(false);
    }
  }, [currentUser, requireAuth, listingToDelete, closeDeleteConfirmModal]);

  const handleEditListing = useCallback(
    (id) => {
      if (!currentUser) {
        requireAuth();
        return;
      }
      alert(
        `Edit action for listing ${id} triggered (simulation). Implement edit functionality.`
      );
    },
    [currentUser, requireAuth]
  );

  const handleView = useCallback((listing) => {
    fetch(
      `${process.env.REACT_APP_API_BASE}/listings/image_listings.php?post_id=${listing.id}`,
      {
        credentials: "include",
      }
    )
      .then((res) => res.json())
      .then((images) => {
        setSelectedListing(listing);
        setViewerImages(images);
        setIsViewerOpen(true);
      })
      .catch(() => alert("Failed to load images."));
  }, []);

  const handlePublishListing = useCallback(
    async (formData) => {
      if (!currentUser) {
        requireAuth();
        return;
      }
      try {
        alert("Listing submitted (simulation)! Implement API call.");

        const simulatedNewListing = {
          id: Date.now(),
          user_id: currentUser.id,
          title: formData.get("title") || "New Listing",
          image_path: "/images/default-car.png",
          price: formData.get("price") || 0,
          mileage: formData.get("mileage") || 0,
          year: formData.get("year") || new Date().getFullYear(),
        };
        setMyListings((prevListings) => [simulatedNewListing, ...prevListings]);
        closeCreateModal();
      } catch (error) {
        alert(`Failed to publish listing: ${error.message}. Please try again.`);
      }
    },
    [currentUser, requireAuth, closeCreateModal]
  );

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
    <div className="page-wrapper">
      <Header />
      <NavBar />
      <div className="page-content">
        <div className="selling-page">
          <div className="selling-content-wrapper">
            <div className="my-listings-header">
              <h2>My Listings</h2>
              <button
                className="create-listing-btn-trigger"
                onClick={openCreateModal}
              >
                <i className="fas fa-plus"></i> Create Listing
              </button>
            </div>

            {fetchError && <div className="error-banner">{fetchError}</div>}

            <section className="my-listings-section">
              {!fetchError && myListings.length > 0 ? (
                <div className="my-listings-grid">
                  {myListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      title={listing.title}
                      image={
                        listing.image_path
                          ? `${process.env.REACT_APP_STATIC_BASE}${listing.image_path}`
                          : "/images/default-car.png"
                      }
                      price={listing.price}
                      mileage={listing.mileage}
                      year={listing.year}
                      onView={() => handleView(listing)}
                      onEdit={() => handleEditListing(listing.id)}
                      onDelete={() =>
                        openDeleteConfirmModal(listing.id, listing.title)
                      }
                      context="selling"
                    />
                  ))}
                </div>
              ) : !fetchError ? (
                <p className="no-listings-message">
                  You haven't created any listings yet.
                </p>
              ) : null}
            </section>

            {isCreateModalOpen && (
              <div className="modal-overlay" onClick={closeCreateModal}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <CreateListingForm
                    onSubmit={handlePublishListing}
                    onClose={closeCreateModal}
                  />
                </div>
              </div>
            )}

            {isDeleteModalOpen && listingToDelete && (
              <DeleteListingModal
                listingTitle={listingToDelete.title}
                onClose={closeDeleteConfirmModal}
                onConfirmDelete={handleConfirmDelete}
                isLoading={isDeleting}
                error={deleteError}
              />
            )}
          </div>

          {isViewerOpen && selectedListing && (
            <ViewModal
              images={viewerImages}
              onClose={() => setIsViewerOpen(false)}
              title={selectedListing.title}
              year={selectedListing.year}
              price={selectedListing.price}
              description={selectedListing.description}
              specs={{
                Make: selectedListing.make,
                Model: selectedListing.model,
                Kilometers: Number(selectedListing.mileage).toLocaleString(),
                Transmission: selectedListing.transmission,
                Drive: selectedListing.driveType,
                Fuel: selectedListing.fuelType,
                Body: selectedListing.bodyType,
                Exterior: selectedListing.exteriorColor,
                Location: `${selectedListing.city}, ${selectedListing.province}`,
              }}
            />
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SellingPage;
