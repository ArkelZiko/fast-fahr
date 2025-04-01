import React, { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Card from "../components/Card";
import Filters from "../components/Filters";
import ListingCard from "../components/ListingCard";
import listings from "../components/data/listings";
import Footer from "../components/Footer";

function HomePage() {
  const [filteredListings, setFilteredListings] = useState(listings);

  const applyFilters = (filters) => {
    const filtered = listings.filter((car) => {
      if (filters.make && car.make !== filters.make) return false;
      if (filters.model && car.model !== filters.model) return false;
      if (filters.priceMin && parseFloat(car.price) < filters.priceMin) return false;
      if (filters.priceMax && parseFloat(car.price) > filters.priceMax) return false;
      if (filters.mileageMin && parseFloat(car.mileage.replace(",", "")) < filters.mileageMin)
        return false;
      if (filters.mileageMax && parseFloat(car.mileage.replace(",", "")) > filters.mileageMax)
        return false;
      if (filters.yearMin && parseInt(car.year) < parseInt(filters.yearMin)) return false;
      if (filters.yearMax && parseInt(car.year) > parseInt(filters.yearMax)) return false;
      return true;
    });
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
      <Filters onApplyFilters={applyFilters} onClearFilters={clearFilters} />
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
      <Footer />
    </div>
  );
}

export default HomePage;
