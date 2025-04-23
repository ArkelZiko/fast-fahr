/**
 * File:         NewsArticleCard.js
 * Authors:      Yusuf Alam, Goshanraj Govindaraj, Gureet Kharod, Arkel Ziko
 * MACIDs:       alamy1, govindag, kharodg, zikoa
 * Date:         March 21st, 2025
 * Description:  Component for displaying a single news article preview card.
 *               Shows title, image (with placeholder), source, date, excerpt,
 *               and a link to the full article.
*/

import React from 'react';
import './css/newsarticlecard.css';

/**
 * Renders a card displaying information about a news article.
 * @param {object} props - Component properties.
 * @param {string} props.title - The title of the news article.
 * @param {string} [props.imageUrl] - The URL of the article's image.
 * @param {string} props.excerpt - A short summary or excerpt of the article.
 * @param {string} [props.source] - The source/publisher of the article.
 * @param {string|Date} [props.date] - The publication date of the article.
 * @param {string} props.link - The URL to the full news article.
 * @returns {JSX.Element} The news article card component.
*/
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