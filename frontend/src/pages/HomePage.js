import Card from "../components/Card";
import listings from "../components/data/listings";
import Filters from "../components/Filters";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ListingCard from "../components/ListingCard";
import NavBar from "../components/Navbar";

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
      <Footer />
    </div>
  );
}

export default HomePage;
