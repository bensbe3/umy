import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Article, ArticleCategory } from '../../lib/supabase';
import { Calendar, Clock, User as UserIcon, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { SEOHead } from '../SEOHead';
import './DecryptMundiPage.css';

export function DecryptMundiPage() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  const ITEMS_PER_PAGE = 9;

  useEffect(() => {
    fetchCategories();
    fetchArticles();
  }, [selectedCategory, page]);

  const fetchCategories = async () => {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('article_categories')
        .select('*')
        .order('display_order');

      if (error) throw error;
      setCategories(data || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchArticles = async () => {
    if (!supabase) return;

    try {
      let query = supabase
        .from('decryptmundi_articles')
        .select('*', { count: 'exact' })
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .range((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE - 1);

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error, count } = await query;

      if (error) throw error;

      if (page === 1) {
        setArticles(data || []);
      } else {
        setArticles(prev => [...prev, ...(data || [])]);
      }

      setHasMore(count ? (page * ITEMS_PER_PAGE) < count : false);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    setPage(prev => prev + 1);
  };

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
    setArticles([]);
    setLoading(true);
  };

  // Split articles: first 2 for featured section, rest for regular grid
  const featuredArticles = articles.slice(0, 2);
  const regularArticles = articles.slice(2);

  // Helper to strip HTML and get first line
  const getFirstLine = (html: string, maxLength: number = 150) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    const text = tmp.textContent || tmp.innerText || '';
    return text.substring(0, maxLength) + (text.length > maxLength ? '...' : '');
  };

  return (
    <>
      <SEOHead
        title="DécryptMundi - Analysis & Commentary | Youth Parliament Morocco"
        description="In-depth analysis, commentary, and investigative journalism from Youth Parliament Morocco's editorial team."
        keywords="Morocco, youth parliament, political analysis, commentary, journalism, DécryptMundi"
        type="website"
      />

      <div className="decryptmundi-page">
        <div className="decryptmundi-header-spacer"></div>
        
        {/* Hero Section */}
        <section className="decryptmundi-hero">
          <div className="decryptmundi-hero-content">
            <h1 className="decryptmundi-hero-title">DécryptMundi</h1>
            <p className="decryptmundi-hero-subtitle">
              In-depth analysis, investigative journalism, and expert commentary on politics, economy, society, and global affairs from Morocco's youth perspective.
            </p>
          </div>
        </section>

        {/* Category Filters */}
        <div className="category-filters">
          <div className="category-filters-container">
            <button
              className={`category-filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => handleCategoryChange('all')}
            >
              All Articles
            </button>
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-filter-btn ${selectedCategory === category.slug ? 'active' : ''}`}
                onClick={() => handleCategoryChange(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {loading && page === 1 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <>
            {/* Featured Section - Top 2 Articles (60% / 40%) */}
            {featuredArticles.length > 0 && (
              <section className="featured-article-section">
                <div className="featured-article">
                  {/* Latest Article (60% left) */}
                  {featuredArticles[0] && (
                    <div className="featured-article-main">
                      {featuredArticles[0].featured_image_url && (
                        <Link
                          to={featuredArticles[0].slug ? `/decryptmundi/${featuredArticles[0].slug}` : `/decryptmundi/${featuredArticles[0].id}`}
                        >
                          <img
                            src={featuredArticles[0].featured_image_url}
                            alt={featuredArticles[0].title}
                            className="featured-article-image"
                          />
                        </Link>
                      )}
                      
                      <div className="featured-article-content">
                        {featuredArticles[0].category && (
                          <span className="featured-article-category">{featuredArticles[0].category}</span>
                        )}
                        
                        <h2 className="featured-article-title">{featuredArticles[0].title}</h2>
                        
                        {featuredArticles[0].excerpt && (
                          <p className="featured-article-excerpt">{featuredArticles[0].excerpt}</p>
                        )}
                        
                        <div className="featured-article-meta">
                          {featuredArticles[0].author_name && (
                            <span className="featured-article-author">
                              <UserIcon size={16} />
                              {featuredArticles[0].author_name}
                            </span>
                          )}
                          
                          {featuredArticles[0].published_at && (
                            <span className="featured-article-date">
                              <Calendar size={16} />
                              {format(new Date(featuredArticles[0].published_at), 'MMM dd, yyyy')}
                            </span>
                          )}
                          
                          {featuredArticles[0].read_time_minutes && (
                            <span className="featured-article-read-time">
                              <Clock size={16} />
                              {featuredArticles[0].read_time_minutes} min read
                            </span>
                          )}
                        </div>

                        <Link
                          to={featuredArticles[0].slug ? `/decryptmundi/${featuredArticles[0].slug}` : `/decryptmundi/${featuredArticles[0].id}`}
                          className="featured-article-read-btn"
                        >
                          Read Full Article
                          <ArrowRight size={18} />
                        </Link>
                      </div>
                    </div>
                  )}

                  {/* Second Article (40% right) */}
                  {featuredArticles[1] && (
                    <div className="featured-article-secondary">
                      {featuredArticles[1].featured_image_url && (
                        <Link
                          to={featuredArticles[1].slug ? `/decryptmundi/${featuredArticles[1].slug}` : `/decryptmundi/${featuredArticles[1].id}`}
                        >
                          <img
                            src={featuredArticles[1].featured_image_url}
                            alt={featuredArticles[1].title}
                            className="secondary-article-image"
                          />
                        </Link>
                      )}
                      
                      {featuredArticles[1].category && (
                        <span className="secondary-article-category">{featuredArticles[1].category}</span>
                      )}
                      
                      <Link
                        to={featuredArticles[1].slug ? `/decryptmundi/${featuredArticles[1].slug}` : `/decryptmundi/${featuredArticles[1].id}`}
                        style={{ textDecoration: 'none' }}
                      >
                        <h3 className="secondary-article-title">{featuredArticles[1].title}</h3>
                      </Link>
                      
                      {/* First line of content */}
                      <p className="secondary-article-first-line">
                        {getFirstLine(featuredArticles[1].excerpt || featuredArticles[1].content)}
                      </p>
                      
                      <div className="secondary-article-meta">
                        {featuredArticles[1].author_name && (
                          <span>By {featuredArticles[1].author_name}</span>
                        )}
                        
                        {featuredArticles[1].published_at && (
                          <span>{format(new Date(featuredArticles[1].published_at), 'MMM dd')}</span>
                        )}
                        
                        {featuredArticles[1].read_time_minutes && (
                          <span>{featuredArticles[1].read_time_minutes} min</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Regular Articles Grid */}
            <section className="articles-section">
              <div className="articles-section-header">
                <h2 className="articles-section-title">Latest Analysis</h2>
              </div>

              {regularArticles.length > 0 ? (
                <>
                  <div className="articles-grid">
                    {regularArticles.map(article => (
                      <ArticleCard key={article.id} article={article} />
                    ))}
                  </div>

                  {hasMore && (
                    <div className="load-more-container">
                      <button
                        onClick={loadMore}
                        className="load-more-btn"
                        disabled={loading}
                      >
                        {loading ? 'Loading...' : 'Load More Articles'}
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="articles-empty">
                  <h3 className="articles-empty-title">No articles yet</h3>
                  <p className="articles-empty-text">
                    Check back soon for new analysis and commentary.
                  </p>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}

function ArticleCard({ article }: { article: Article }) {
  const articlePath = article.slug ? `/decryptmundi/${article.slug}` : `/decryptmundi/${article.id}`;

  return (
    <article className="article-card">
      <Link 
        to={articlePath}
        className="article-card-image-link"
      >
        {article.featured_image_url && (
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="article-card-image"
          />
        )}
      </Link>
      
      <div className="article-card-content">
        {article.category && (
          <span className="article-card-category">{article.category}</span>
        )}
        
        <Link to={articlePath} style={{ textDecoration: 'none' }}>
          <h3 className="article-card-title">{article.title}</h3>
        </Link>
        
        {article.excerpt && (
          <p className="article-card-excerpt">{article.excerpt}</p>
        )}
        
        <div className="article-card-meta">
          {article.author_name && (
            <span className="article-card-author">{article.author_name}</span>
          )}
          
          {article.published_at && (
            <span className="article-card-date">
              {format(new Date(article.published_at), 'MMM dd, yyyy')}
            </span>
          )}
          
          {article.read_time_minutes && (
            <span className="article-card-read-time">
              {article.read_time_minutes} min
            </span>
          )}
        </div>
      </div>
    </article>
  );
}