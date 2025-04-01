// src/pages/BookmarksPage.js (or your file path)
import React, { useState, useEffect } from 'react'; // Keep useState & useEffect for future data loading
import Header from "../components/Header";
import NavBar from "../components/Navbar";
// Use the standard ListingCard component for displaying bookmarks
import ListingCard from "../components/ListingCard";
// Import sample data - will use later to demonstrate population
import sampleListingsData from "../components/data/listings.js";
import "../components/css/buyingCSS/buyingpage.css"; // Use buying page CSS for consistent layout
import Footer from "../components/Footer";

function BookmarksPage() {
  // State to hold the user's bookmarked listings where we first
  // initialize as empty array to show the "no bookmarks" message for now
  const [bookmarkedListings, setBookmarkedListings] = useState([]);

  return (
    // Using 'buying-page' class for identical styling from buyingpage.css
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="buying-content-wrapper">
        <div className="my-listings-header">
          <h2>My Bookmarks</h2>
        </div>

        <section className="my-listings-section">
          {bookmarkedListings.length > 0 ? (
            <div className="my-listings-grid">
              {/* Map over the bookmarks state */}
              {bookmarkedListings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  title={listing.title}
                  image={listing.image}
                  price={listing.price}
                  mileage={listing.mileage}
                  year={listing.year}
                />
              ))}
            </div>
          ) : (
            // Display message when state is empty
            <p className="no-listings-message">You have no bookmarks active.</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default BookmarksPage;