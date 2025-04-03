import React from 'react';
import './css/newsarticlecard.css';

function NewsArticleCard({ title, imageUrl, excerpt, source, date, link }) {
  const displayImage = imageUrl || '/images/news/placeholder.jpg'; 

  return (
    <div className="news-article-card">
      <img src={displayImage} alt={title} className="news-article-image" />
      <div className="news-article-content">
        <h3 className="news-article-title">{title}</h3>
        {source && date && (
             <p className="news-article-meta">{source} • {new Date(date).toLocaleDateString()}</p>
        )}
        <p className="news-article-excerpt">{excerpt}</p>
        <a href={link} target="_blank" rel="noopener noreferrer" className="news-article-link">
          Read More
        </a>
      </div>
    </div>
  );
}

export default NewsArticleCard;