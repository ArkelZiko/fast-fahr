import Header from "../components/Header";
import NavBar from "../components/Navbar";
import Card from "../components/Card";
import Filters from "../components/Filters";
import ListingCard from "../components/ListingCard";
import listings from "../components/data/listings";

function HomePage() {
  return (
    <div className="home-page">
      <Header />
      <NavBar />
      <Card />
      <Filters />
      <div className="listing-grid">
        {listings.map((car) => (
          <ListingCard
            key={car.id}
            title={car.title}
            image={car.image}
            price={car.price}
            mileage={car.mileage}
            year={car.year}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;
