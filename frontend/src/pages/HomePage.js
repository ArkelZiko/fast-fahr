import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Card from "../components/Card";
import Filters from "../components/Filters";
import filterListings from "../components/filterListingsComponent/filterListings";
import ListingCard from "../components/ListingCard";
import Footer from "../components/Footer";

function HomePage() {
  const [allListings, setAllListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const res = await fetch("http://localhost/fastfahr/backend/apis/fetch/get_listings.php", {
          credentials: "include", // if your endpoint requires cookies
        });
        const data = await res.json();
        console.log("Fetched listings from backend:", data);
        setAllListings(data);
        setFilteredListings(data);
      } catch (err) {
        console.error("Error fetching listings:", err);
      }
    };

    fetchListings();
  }, []);

  const applyFilters = (filters) => {
    const filtered = filterListings(allListings, filters);
    setFilteredListings(filtered);
  };

  const clearFilters = () => {
    setFilteredListings(allListings);
  };

  return (
    <div className="home-page">
      <Header />
      <NavBar />
      <Card />
      <Filters onApplyFilters={applyFilters} onClearFilters={clearFilters} />

      <div className="home-content-wrapper">
        <div className="listing-grid">
          {filteredListings.length > 0 ? (
            filteredListings.map((car) => (
              <ListingCard
                key={car.id}
                title={car.title}
                image={`/images/${car.image}`} // Assumes images are stored in public/images folder
                price={car.price}
                mileage={car.mileage}
                year={car.year}
              />
            ))
          ) : (
            <p style={{ padding: "2rem", textAlign: "center" }}>
              No listings loaded. Try refreshing or check your filters.
            </p>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default HomePage;
