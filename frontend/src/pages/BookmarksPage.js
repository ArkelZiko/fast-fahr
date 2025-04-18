import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { fetchBookmarks, toggleBookmark } from "../hooks/useBookmarks";

import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import "../components/css/buyingCSS/buyingpage.css";
import Footer from "../components/Footer";

export default function BookmarksPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();

  const [bookmarkedListings, setBookmarkedListings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ─────────────────────────────── Fetch bookmarks ────────────────────────── */
  useEffect(() => {
    if (authLoading) return; // wait for auth hook

    if (!currentUser) {
      requireAuth(); // redirect to login
      return;
    }

    (async () => {
      try {
        const data = await fetchBookmarks(currentUser.id);
        setBookmarkedListings(data); // array of full listing objects
      } catch (err) {
        console.error("fetchBookmarks error:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [authLoading, currentUser, requireAuth]);

  /* ─────────────────────── Toggle / remove bookmark locally ────────────────── */
  const handleBookmarkToggle = async (listingId, nextState) => {
    try {
      await toggleBookmark(listingId, !nextState);

      setBookmarkedListings((prev) =>
        nextState ? prev : prev.filter((l) => l.id !== listingId)
      );
    } catch (err) {
      console.error("toggleBookmark error:", err);
      alert("Couldn’t update bookmark – try again.");
    }
  };

  if (authLoading || loading) {
    return (
      <div className="buying-page" style={{ textAlign: "center", padding: 50 }}>
        Loading bookmarks…
      </div>
    );
  }
  if (!currentUser) return null; // already redirected

  /* ────────────────────────────────── UI ───────────────────────────────────── */
  return (
    <div
      className="buying-page"
      style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}
    >
      <Header />
      <NavBar />

      <div className="buying-content-wrapper" style={{ flexGrow: 1 }}>
        <div className="my-listings-header">
          <h2>My Bookmarks</h2>
        </div>

        {bookmarkedListings.length ? (
          <div className="my-listings-grid">
            {bookmarkedListings.map((listing) => (
              <ListingCard
                key={listing.id}
                title={listing.title}
                image={listing.image_path}
                price={listing.price}
                mileage={listing.mileage}
                year={listing.year}
                isBookmarked={true} // always true on this page
                onBookmark={(next) => handleBookmarkToggle(listing.id, next)}
              />
            ))}
          </div>
        ) : (
          <p className="no-listings-message">You have no bookmarks active.</p>
        )}
      </div>

      <Footer />
    </div>
  );
}
