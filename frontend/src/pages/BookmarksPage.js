import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth"; // Import useAuth

import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import sampleListingsData from "../components/data/listings.js"; // Placeholder
import "../components/css/buyingCSS/buyingpage.css";
import Footer from "../components/Footer";

function BookmarksPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();

  const [bookmarkedListings, setBookmarkedListings] = useState([]);
  const [isLoadingBookmarks, setIsLoadingBookmarks] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (!authLoading) {
      if (!requireAuth()) {
        return; // Redirecting...
      } else {
        // Fetch user's bookmarks once authenticated
        setIsLoadingBookmarks(true);
        // TODO: Replace with actual API call: fetch(`/api/bookmarks?userId=${currentUser.id}`)
        setTimeout(() => { // Simulate fetch
          if (isMounted) {
            const simulatedBookmarks = sampleListingsData.slice(0, 2);
            setBookmarkedListings(simulatedBookmarks);
            setIsLoadingBookmarks(false);
          }
        }, 1000);
      }
    }
    return () => { isMounted = false; };
  }, [authLoading, requireAuth, currentUser]);


  if (authLoading) {
    return (
      <div className="buying-page">
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
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="buying-content-wrapper">
        <div className="my-listings-header">
          <h2>My Bookmarks</h2>
        </div>

        <section className="my-listings-section">
          {isLoadingBookmarks ? (
             <p className="loading-message" style={{ textAlign: 'center', padding: '30px' }}>Loading bookmarks...</p>
          ) : bookmarkedListings.length > 0 ? (
            <div className="my-listings-grid">
              {bookmarkedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  title={listing.title} image={listing.image} price={listing.price}
                  mileage={listing.mileage} year={listing.year}
                />
              ))}
            </div>
          ) : (
            <p className="no-listings-message">You have no listings bookmarked yet.</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default BookmarksPage;