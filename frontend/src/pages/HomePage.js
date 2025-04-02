import React, { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Card from "../components/Card";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings";
import ListingCard from "../components/ListingCard";
import listings from "../components/data/listings";
import Footer from "../components/Footer";

function HomePage() {
  const [filteredListings, setFilteredListings] = useState(listings);

  const applyFilters = (filters) => {
    const filtered = filterListings(listings, filters);
    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setFilteredListings(listings);
  };

  return (
    <div className="home-page">
      <Header />
      <NavBar />
      <Card />
      <Filters 
        onApplyFilters={applyFilters} 
        onClearFilters={clearFilters} 
      />
      <div className="home-cotent-wrapper">
        <div className="listing-grid">
          {filteredListings.length > 0 ? (
            filteredListings.map((car) => (
              <ListingCard
                key={car.id}
                title={car.title}
                image={car.image}
                price={car.price}
                mileage={car.mileage}
                year={car.year}
              />
            ))
          ) : (
            <p>No cars found matching the filters.</p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
