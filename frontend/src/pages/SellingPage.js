/**
 * File:         SellingPage.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         April 10th, 2025 (Updated April 23rd, 2025)
 * Description:  Page component for users to manage their own listings.
 *               Fetches, displays, allows creation, editing, and deletion of listings.
 */

import React, { useCallback, useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard.js";
import NavBar from "../components/Navbar";
import ViewModal from "../components/buyingComponents/ViewModal";
import "../components/css/sellingCSS/sellingpage.css";
import CreateListingForm from "../components/sellingComponents/CreateListingForm.js";
import DeleteListingModal from "../components/sellingComponents/DeleteListingModal.js";
import EditListingForm from "../components/sellingComponents/EditListingForm.js";
import { useAuth } from "../hooks/useAuth";

/**
 * Renders the Selling page, displaying and managing the user's own listings.
 * @returns {JSX.Element|null} The SellingPage component or null if redirecting.
 */
function SellingPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();

  const [myListings, setMyListings] = useState([]);
  const [pageLoading, setPageLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [listingToEdit, setListingToEdit] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [listingToDelete, setListingToDelete] = useState(null);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [viewerImages, setViewerImages] = useState([]);
  const [viewError, setViewError] = useState("");

  const fetchMyListings = useCallback(async () => {
    if (!currentUser) return;

    setFetchError("");
    setPageLoading(true);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/listings/get_listings.php`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `HTTP error! status: ${response.status}, response: ${errorText}`
        );
      }

      const allListingsData = await response.json();

      if (!Array.isArray(allListingsData)) {
        throw new Error("Invalid data format received for listings.");
      }

      const userSpecificListings = allListingsData.filter(
        (listing) => listing.user_id === currentUser.id
      );
      setMyListings(userSpecificListings);
    } catch (error) {
      setFetchError(`Failed to load listings: ${error.message}`);
      setMyListings([]);
    } finally {
      setPageLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    let isMounted = true;
    if (!authLoading) {
      if (!requireAuth()) {
        if (isMounted) setPageLoading(false);
        return () => {
          isMounted = false;
        };
      }
      if (currentUser && isMounted) {
        fetchMyListings();
      } else if (!currentUser && isMounted) {
        setPageLoading(false);
        setFetchError("User data not available.");
      }
    }
    return () => {
      isMounted = false;
    };
  }, [authLoading, currentUser, requireAuth, fetchMyListings]);

  const openCreateModal = () => {
    if (!requireAuth()) return;
    setIsCreateModalOpen(true);
  };
  const closeCreateModal = () => setIsCreateModalOpen(false);

  const handleListingCreated = (newListing) => {
    if (newListing && newListing.id) {
      setMyListings((prevListings) => [newListing, ...prevListings]);
      closeCreateModal();
    } else {
      closeCreateModal();
    }
  };

  const openEditModal = useCallback(
    (listing) => {
      if (!requireAuth()) return;
      setListingToEdit(listing);
      setIsEditModalOpen(true);
    },
    [requireAuth]
  );

  const closeEditModal = useCallback(() => {
    setIsEditModalOpen(false);
    setListingToEdit(null);
  }, []);

  const handleListingUpdated = useCallback(
    (updatedListing) => {
      if (updatedListing && updatedListing.id) {
        setMyListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === updatedListing.id ? updatedListing : listing
          )
        );
        closeEditModal();
      } else {
        closeEditModal();
      }
    },
    [closeEditModal]
  );

  const openDeleteConfirmModal = useCallback(
    (id, title) => {
      if (!requireAuth()) return;
      setListingToDelete({ id, title });
      setDeleteError("");
      setIsDeleteModalOpen(true);
    },
    [requireAuth]
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
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ listing_id: listingToDelete.id }),
        }
      );
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.error || `HTTP error ${response.status}`);
      }
      setMyListings((current) =>
        current.filter((listing) => listing.id !== listingToDelete.id)
      );
      closeDeleteConfirmModal();
    } catch (error) {
      setDeleteError(error.message || "Deletion error.");
    } finally {
      setIsDeleting(false);
    }
  }, [currentUser, listingToDelete, closeDeleteConfirmModal]);

  const handleView = useCallback((listing) => {
    fetch(
      `${process.env.REACT_APP_API_BASE}/listings/image_listings.php?post_id=${listing.id}`,
      { credentials: "include" }
    )
      .then((res) => res.json())
      .then((images) => {
        if (Array.isArray(images)) {
          setSelectedListing(listing);
          setViewerImages(images);
          setIsViewerOpen(true);
          setViewError("");
        } else {
          setViewError("Failed to load listing images.");
        }
      })
      .catch((error) => {
        setViewError("Failed to load listing images. Please try again.");
      });
  }, []);

  if (authLoading) {
    return (
      <div className="selling-page">
        <Header />
        <NavBar />
        <div className="loading-page">Checking auth...</div>
        <Footer />
      </div>
    );
  }
  if (!currentUser) {
    return (
      <div className="selling-page">
        <Header />
        <NavBar />
        <div className="loading-page">Redirecting...</div>
        <Footer />
      </div>
    );
  }
  if (pageLoading) {
    return (
      <div className="selling-page">
        <Header />
        <NavBar />
        <div className="loading-page">Loading listings...</div>
        <Footer />
      </div>
    );
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
            {viewError && <div className="error-banner">{viewError}</div>}

            <section className="my-listings-section">
              {!fetchError && myListings.length > 0 ? (
                <div className="my-listings-grid">
                  {myListings.map((listing) => (
                    <ListingCard
                      key={listing.id}
                      listing={listing}
                      title={listing.title}
                      image={
                        listing.image_path &&
                        listing.image_path !== "/images/default-car.png"
                          ? `${process.env.REACT_APP_STATIC_BASE || ""}${
                              listing.image_path
                            }`
                          : "/images/default-car.png"
                      }
                      price={listing.price}
                      mileage={listing.mileage}
                      year={listing.year}
                      onView={() => handleView(listing)}
                      onEdit={() => openEditModal(listing)}
                      onDelete={() =>
                        openDeleteConfirmModal(listing.id, listing.title)
                      }
                      context="selling"
                    />
                  ))}
                </div>
              ) : !fetchError ? (
                <p className="no-listings-message">
                  You haven't created any listings yet. Click "Create Listing"
                  to start!
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
                    onSubmitSuccess={handleListingCreated}
                    onClose={closeCreateModal}
                  />
                </div>
              </div>
            )}

            {isEditModalOpen && listingToEdit && (
              <div className="modal-overlay" onClick={closeEditModal}>
                <div
                  className="modal-content"
                  onClick={(e) => e.stopPropagation()}
                >
                  <EditListingForm
                    listingToEdit={listingToEdit}
                    onSubmitSuccess={handleListingUpdated}
                    onClose={closeEditModal}
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
