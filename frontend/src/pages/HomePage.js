import React from "react";
import Header from "../components/Header.js";
import NavBar from "../components/Navbar.js";
import Card from "../components/Card.js";
import NewsArticleCard from "../components/NewsArticleCard.js";
import Footer from "../components/Footer.js";
import sampleNewsData from "../components/data/sampleNewsData.js";
import '../components/css/homeCSS/homepage.css';

function HomePage() {

  return (
    <div className="home-page">
      <Header />
      <NavBar />
      <Card />


      {/* News Feed Section */}
      <div className="news-feed-section">
        <h2 className="section-title">German Auto News</h2>
        <div className="news-items-container">
          {sampleNewsData.length > 0 ? (
            sampleNewsData.map((article) => (
              <NewsArticleCard
                key={article.id}
                title={article.title}
                imageUrl={article.imageUrl}
                excerpt={article.excerpt}
                source={article.source}
                date={article.date}
                link={article.link}
              />
            ))
          ) : (
            <p style={{ padding: "2rem", textAlign: "center", gridColumn: "1 / -1" }}>
              No news articles available at the moment.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default HomePage;