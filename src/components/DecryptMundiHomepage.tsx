import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Article } from '../lib/supabase';
import { Calendar, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import './DecryptMundiHomepage.css';

export function DecryptMundiHomepage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLatestArticles();
  }, []);

  const fetchLatestArticles = async () => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('decryptmundi_articles')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(6);

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching DecryptMundi articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const scroll = (direction: 'left' | 'right') => {
    const container = document.getElementById('decryptmundi-slider');
    if (!container) return;

    const scrollAmount = 350;
    const newPosition = direction === 'left' 
      ? scrollPosition - scrollAmount 
      : scrollPosition + scrollAmount;

    container.scrollTo({
      left: newPosition,
      behavior: 'smooth'
    });
    setScrollPosition(newPosition);
  };

  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = () => {
    const container = document.getElementById('decryptmundi-slider');
    if (!container) return false;
    return scrollPosition < (container.scrollWidth - container.clientWidth - 10);
  };

  if (loading) {
    return (
      <section className="decryptmundi-homepage-section">
        <div className="container">
          <div style={{ textAlign: 'center', padding: '3rem 0' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) return null;

  return (
    <section className="decryptmundi-homepage-section">
      <div className="container">
        {/* Header */}
        <div className="decryptmundi-homepage-header">
          <div>
            <div className="section-label">Analysis & Commentary</div>
            <h2 className="section-title-center">DécryptMundi</h2>
            <p className="section-description">
              In-depth analysis and expert commentary on politics, economy, and global affairs from Morocco's youth perspective.
            </p>
          </div>
          <Link to="/decryptmundi" className="btn-view-all">
            View All Articles
            <ArrowRight className="btn-icon" />
          </Link>
        </div>

        {/* Slider Container */}
        <div className="decryptmundi-slider-wrapper">
          {/* Navigation Arrows */}
          <button
            className="slider-nav-arrow slider-nav-left"
            onClick={() => scroll('left')}
            disabled={!canScrollLeft}
            aria-label="Previous articles"
          >
            <ChevronLeft />
          </button>

          <button
            className="slider-nav-arrow slider-nav-right"
            onClick={() => scroll('right')}
            disabled={!canScrollRight()}
            aria-label="Next articles"
          >
            <ChevronRight />
          </button>

          {/* Articles Slider */}
          <div 
            id="decryptmundi-slider"
            className="decryptmundi-slider"
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
          >
            {articles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const articlePath = article.slug ? `/decryptmundi/${article.slug}` : `/decryptmundi/${article.id}`;

  return (
    <Link to={articlePath} className="decryptmundi-homepage-card">
      {/* Image Background */}
      <div className="card-image-wrapper">
        {article.featured_image_url ? (
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="card-image"
          />
        ) : (
          <div className="card-image-placeholder" />
        )}
        <div className="card-gradient-overlay" />
      </div>

      {/* Content Overlay */}
      <div className="card-content-overlay">
        {article.category && (
          <span className="card-category">{article.category}</span>
        )}

        <h3 className="card-title">{article.title}</h3>

        <div className="card-meta">
          {article.published_at && (
            <span className="card-date">
              <Calendar size={14} />
              {format(new Date(article.published_at), 'MMM dd, yyyy')}
            </span>
          )}
          {article.read_time_minutes && (
            <span className="card-read-time">
              {article.read_time_minutes} min read
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}