function SellingPage() {
  const { currentUser, isLoading: authLoading, requireAuth } = useAuth();
  const [myListings, setMyListings] = useState(userListingsData);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!requireAuth()) {
        // Redirecting...
      } else {
        // TODO: Fetch user-specific listings using currentUser.id
      }
    }
  }, [authLoading, requireAuth, currentUser]);

  const openModal = () => {
    if (!currentUser) { requireAuth(); return; }
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const handleDeleteListing = (id) => {
    if (!currentUser) { requireAuth(); return; }
    setMyListings(currentListings => currentListings.filter(listing => listing.id !== id));
    alert(`Listing ${id} deleted (simulation).`);
  };

  const handleEditListing = (id) => {
    if (!currentUser) { requireAuth(); return; }
    alert(`Edit action for listing ${id} triggered (simulation).`);
  };

  const handlePublishListing = async (formData) => {
    if (!currentUser) { requireAuth(); return; }

    try {
      const response = await fetch("http://localhost/fastfahr/backend/apis/create/create.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...formData, user_id: currentUser.user_id }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        alert("Listing created!");
        setMyListings(prev => [...prev, { id: result.post_id, ...formData }]);
        closeModal();
      } else {
        throw new Error(result.error || "Unknown error");
      }
    } catch (err) {
      console.error("Failed to create listing:", err.message);
      alert("Error: " + err.message);
    }
  };

  // ✅ This entire return block should stay INSIDE the SellingPage function
  if (authLoading) {
    return (
      <div className="selling-page">
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
    return null;
  }

  return (
    <div className="selling-page">
      <Header />
      <NavBar />
      <div className="selling-content-wrapper">

        <div className="my-listings-header">
          <h2>My Current Listings</h2>
          <button className="create-listing-btn-trigger" onClick={openModal}>
            <i className="fas fa-plus"></i> Create Listing
          </button>
        </div>

        <section className="my-listings-section">
          {myListings.length > 0 ? (
            <div className="my-listings-grid">
              {myListings.map((listing) => (
                <SellListingCard
                  key={listing.id}
                  title={listing.title} image={listing.image} price={listing.price}
                  mileage={listing.mileage} year={listing.year}
                  onEdit={() => handleEditListing(listing.id)}
                  onDelete={() => handleDeleteListing(listing.id)}
                />
              ))}
            </div>
          ) : (
            <p className="no-listings-message">You have no active listings.</p>
          )}
        </section>

        {isModalOpen && (
          <div className="modal-overlay" onClick={closeModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <CreateListingForm
                onSubmit={handlePublishListing}
                onClose={closeModal}
              />
            </div>
          </div>
        )}

      </div>
      <Footer />
    </div>
  );
}

export default SellingPage;
