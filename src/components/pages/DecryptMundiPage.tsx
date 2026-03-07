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

  // Build alternating rows: Row 1 = 1 left + 2 right, Row 2 = 1 left + 1 right, repeat
  const articleRows: { type: 'A' | 'B'; articles: Article[] }[] = [];
  let idx = 0;
  while (idx < articles.length) {
    if (articleRows.length % 2 === 0) {
      articleRows.push({ type: 'A', articles: articles.slice(idx, idx + 3) });
      idx += 3;
    } else {
      articleRows.push({ type: 'B', articles: articles.slice(idx, idx + 2) });
      idx += 2;
    }
  }

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
        title="DécryptMundi - Analysis & Commentary | United Moroccan Youth"
        description="In-depth analysis, commentary, and investigative journalism from Youth Parliament Morocco's editorial team."
        keywords="Morocco, parliament, political analysis, commentary, journalism, DécryptMundi, United Moroccan Youth"
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
        {/* <div className="category-filters">
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
        </div> */}

        {loading && page === 1 ? (
          <div style={{ padding: '4rem', textAlign: 'center' }}>
            <div className="loading-spinner" style={{ margin: '0 auto' }}></div>
          </div>
        ) : (
          <>
            {/* Articles Grid - Alternating layout: Row A = 1 left + 2 right, Row B = 1 left + 1 right */}
            <section className="decryptmundi-articles-section">
              {articleRows.map((row, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`decryptmundi-article-row decryptmundi-article-row--${row.type}`}
                >
                  {/* Left column - 1 article */}
                  <div className="decryptmundi-row-left">
                    {row.articles[0] && (
                      <FeaturedArticleCard article={row.articles[0]} getFirstLine={getFirstLine} />
                    )}
                  </div>
                  {/* Right column - 2 articles (type A) or 1 article (type B) */}
                  <div className="decryptmundi-row-right">
                    {row.type === 'A' && row.articles[1] && (
                      <SecondaryArticleCard article={row.articles[1]} getFirstLine={getFirstLine} />
                    )}
                    {row.type === 'A' && row.articles[2] && (
                      <SecondaryArticleCard article={row.articles[2]} getFirstLine={getFirstLine} />
                    )}
                    {row.type === 'B' && row.articles[1] && (
                      <FeaturedArticleCard article={row.articles[1]} getFirstLine={getFirstLine} />
                    )}
                  </div>
                </div>
              ))}

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

              {articleRows.length === 0 && !loading && (
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

function FeaturedArticleCard({ article, getFirstLine }: { article: Article; getFirstLine: (html: string, max?: number) => string }) {
  const articlePath = article.slug ? `/decryptmundi/${article.slug}` : `/decryptmundi/${article.id}`;

  return (
    <div className="featured-article-main">
      {article.featured_image_url && (
        <Link to={articlePath}>
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="featured-article-image"
          />
        </Link>
      )}
      <div className="featured-article-content">
        {article.category && (
          <span className="featured-article-category">{article.category}</span>
        )}
        <h2 className="featured-article-title">{article.title}</h2>
        {article.excerpt && (
          <p className="featured-article-excerpt">{article.excerpt}</p>
        )}
        <div className="featured-article-meta">
          {article.author_name && (
            <span className="featured-article-author">
              <UserIcon size={16} />
              {article.author_name}
            </span>
          )}
          {article.published_at && (
            <span className="featured-article-date">
              <Calendar size={16} />
              {format(new Date(article.published_at), 'MMM dd, yyyy')}
            </span>
          )}
          {article.read_time_minutes && (
            <span className="featured-article-read-time">
              <Clock size={16} />
              {article.read_time_minutes} min read
            </span>
          )}
        </div>
        <Link to={articlePath} className="featured-article-read-btn">
          Read Full Article
          <ArrowRight size={18} />
        </Link>
      </div>
    </div>
  );
}

function SecondaryArticleCard({ article, getFirstLine }: { article: Article; getFirstLine: (html: string, max?: number) => string }) {
  const articlePath = article.slug ? `/decryptmundi/${article.slug}` : `/decryptmundi/${article.id}`;

  return (
    <div className="featured-article-secondary">
      {article.featured_image_url && (
        <Link to={articlePath}>
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="secondary-article-image"
          />
        </Link>
      )}
      {article.category && (
        <span className="secondary-article-category">{article.category}</span>
      )}
      <Link to={articlePath} style={{ textDecoration: 'none' }}>
        <h3 className="secondary-article-title">{article.title}</h3>
      </Link>
      <p className="secondary-article-first-line">
        {getFirstLine(article.excerpt || article.content)}
      </p>
      <div className="secondary-article-meta">
        {article.author_name && <span>By {article.author_name}</span>}
        {article.published_at && (
          <span>{format(new Date(article.published_at), 'MMM dd')}</span>
        )}
        {article.read_time_minutes && (
          <span>{article.read_time_minutes} min</span>
        )}
      </div>
    </div>
  );
}