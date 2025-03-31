import { useState } from "react";
import Header from "../components/Header";
import NavBar from "../components/Navbar";

function BuyingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <div className="buying-page">
      <Header />
      <NavBar />
      <div className="my-listings-header">
        <h2>Current Listings</h2>
        <button className="create-listing-btn-trigger" onClick={openModal}>
          <i className="fas fa-plus"></i> Filter Listings
        </button>
      </div>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>Filter Options</h3>
            {/* Your filter inputs go here */}
            <button onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BuyingPage;
