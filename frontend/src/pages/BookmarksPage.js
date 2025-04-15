import React, { useState, useEffect } from 'react';
import { useAuth } from "../hooks/useAuth";

import Header from "../components/Header";
import NavBar from "../components/Navbar";
import ListingCard from "../components/ListingCard";
import "../components/css/buyingCSS/buyingpage.css";
import Footer from "../components/Footer";

function BookmarksPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
  const [bookmarkedListings, setBookmarkedListings] = useState([]);

  useEffect(() => {
    if (!authLoading) {
      requireAuth();
    }
  }, [authLoading, requireAuth, currentUser]);


  const pageStyle = {
    display: 'flex',      
    flexDirection: 'column',
    flexGrow: 1            

  };

  // This style makes the content area expand to push the footer down
  const contentWrapperStyle = {
    flexGrow: 1 
  };



  if (authLoading) {
    return (
      <div className="buying-page" style={pageStyle}>
        <Header />
        <NavBar />
        <div className="loading-page" style={{ textAlign: 'center', padding: '50px', flexGrow: 1 /* Make loading fill space too */ }}>
            Checking authentication...
        </div>
        <Footer />
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="buying-page" style={pageStyle}>
      <Header />
      <NavBar />
      <div className="buying-content-wrapper" style={contentWrapperStyle}>
        <div className="my-listings-header">
          <h2>My Bookmarks</h2>
        </div>

        <section className="my-listings-section">
          {bookmarkedListings.length > 0 ? (
            <div className="my-listings-grid">
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
            <p className="no-listings-message">You have no bookmarks active.</p>
          )}
        </section>
      </div>
      <Footer />
    </div>
  );
}

export default BookmarksPage;