import React, { useEffect, useState } from "react";
import ViewModal from "../components/buyingComponents/ViewModal";
import "../components/css/buyingCSS/buyingpage.css";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard";
import NavBar from "../components/Navbar";
import { useAuth } from "../hooks/useAuth";
import { fetchBookmarks, toggleBookmark } from "../hooks/useBookmarks";

export default function BookmarksPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();

  const [bookmarkedListings, setBookmarkedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedListing, setSelectedListing] = useState(null);
  const [viewerImages, setViewerImages] = useState([]);
  const [isViewerOpen, setIsViewerOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (authLoading) return;

    if (!currentUser) {
      requireAuth();
      if (isMounted) setLoading(false);
      return;
    }

    setLoading(true);
    setError("");
    fetchBookmarks()
      .then((data) => {
        if (isMounted) {
          if (Array.isArray(data)) {
            setBookmarkedListings(data);
          } else {
            setError("Failed to load bookmarks: Invalid data format.");
            setBookmarkedListings([]);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(`Failed to load bookmarks: ${err.message}`);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [authLoading, currentUser, requireAuth]);

  const handleBookmarkToggle = async (listingId, nextState) => {
    if (nextState) {
    }
    try {
      await toggleBookmark(listingId, true);
      setBookmarkedListings((prev) => prev.filter((l) => l.id !== listingId));
    } catch (err) {
      alert("Couldn’t remove bookmark – try again.");
    }
  };

  const handleView = (listing) => {
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
  };

  if (authLoading || loading) {
    return (
      <div>
        <Header />
        <NavBar />
        <div
          className="loading-page"
          style={{ textAlign: "center", padding: 50 }}
        >
          Loading bookmarks…
        </div>
        <Footer />
      </div>
    );
  }
  if (!currentUser) return null;

  return (
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="buying-content-wrapper">
        <div className="my-listings-header">
          <h2>My Bookmarks</h2>
        </div>

        {error && <div className="error-banner">{error}</div>}

        {!error && bookmarkedListings.length > 0 ? (
          <div className="my-listings-grid">
            {bookmarkedListings.map((listing) => (
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
                isBookmarked={true}
                onBookmarkToggle={(next) =>
                  handleBookmarkToggle(listing.id, next)
                }
                onView={() => handleView(listing)}
                context="bookmarks"
              />
            ))}
          </div>
        ) : !error ? (
          <p className="no-listings-message">You have no bookmarks saved.</p>
        ) : null}
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
            kilomterers: Number(selectedListing.mileage).toLocaleString(),
            Transmission: selectedListing.transmission,
            Drive: selectedListing.driveType,
            Fuel: selectedListing.fuelType,
            Body: selectedListing.bodyType,
            Exterior: selectedListing.exteriorColor,
            Location: `${selectedListing.city}, ${selectedListing.province}`,
          }}
        />
      )}

      <Footer />
    </div>
  );
}
