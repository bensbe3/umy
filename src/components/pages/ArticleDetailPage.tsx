import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase, Article } from '../../lib/supabase';
import { Calendar, Clock, User as UserIcon, ArrowLeft, Share2 } from 'lucide-react';
import { format } from 'date-fns';
import { SEOHead } from '../SEOHead';
import './ArticleDetailPage.css';
import '../pages/DecryptMundiPage.css';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarArticles, setSidebarArticles] = useState<Article[]>([]);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  useEffect(() => {
    const fetchSidebarArticles = async () => {
      if (!supabase || !article?.id) return;
      try {
        const { data } = await supabase
          .from('decryptmundi_articles')
          .select('*')
          .eq('status', 'published')
          .neq('id', article.id)
          .order('published_at', { ascending: false })
          .limit(5);
        setSidebarArticles(data || []);
      } catch (error) {
        console.error('Error fetching sidebar articles:', error);
      }
    };

    if (article?.id) {
      fetchSidebarArticles();
    }
  }, [article?.id]);

  const fetchArticle = async (articleSlug: string) => {
    if (!supabase) {
      setError('Database connection unavailable');
      setLoading(false);
      return;
    }

    console.log('🔍 Fetching article with slug:', articleSlug);

    try {
      // First try by slug
      let query = supabase
        .from('decryptmundi_articles')
        .select('*')
        .eq('slug', articleSlug)
        .eq('status', 'published');

      const { data: slugData, error: slugError } = await query.single();

      // If slug doesn't work, try by ID (in case slug is actually an ID)
      if (slugError && slugError.code === 'PGRST116') {
        console.log('⚠️ Article not found by slug, trying by ID...');
        const { data: idData, error: idError } = await supabase
          .from('decryptmundi_articles')
          .select('*')
          .eq('id', articleSlug)
          .eq('status', 'published')
          .single();

        if (idError) {
          console.error('❌ Error fetching by ID:', idError);
          setError('Article not found');
          setLoading(false);
          return;
        }

        console.log('✅ Article found by ID:', idData?.title);
        setArticle(idData);
        
        if (idData) {
          await supabase
            .from('decryptmundi_articles')
            .update({ views_count: (idData.views_count || 0) + 1 })
            .eq('id', idData.id);
        }
        setLoading(false);
        return;
      }

      if (slugError) {
        console.error('❌ Error fetching article:', slugError);
        setError(slugError.message || 'Failed to load article');
        setLoading(false);
        return;
      }

      console.log('✅ Article found by slug:', {
        title: slugData?.title,
        slug: slugData?.slug,
        id: slugData?.id,
        status: slugData?.status
      });
      
      if (!slugData) {
        setError('Article data is empty');
        setLoading(false);
        return;
      }

      setArticle(slugData);
      
      // Increment view count
      if (slugData) {
        await supabase
          .from('decryptmundi_articles')
          .update({ views_count: (slugData.views_count || 0) + 1 })
          .eq('id', slugData.id);
      }
    } catch (err: any) {
      console.error('❌ Exception fetching article:', err);
      setError(err.message || 'Failed to load article');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="article-detail-page">
        <div className="article-detail-header-spacer"></div>
        <div className="article-detail-container">
          <div className="article-loading">
            <div className="loading-spinner"></div>
            <p>Loading article...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-detail-page">
        <div className="article-detail-header-spacer"></div>
        <div className="article-detail-container">
          <div className="article-error">
            <h1>Article Not Found</h1>
            <p>{error || 'The article you are looking for does not exist or has been removed.'}</p>
            <div style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(139, 0, 0, 0.2)', border: '1px solid rgba(139, 0, 0, 0.5)' }}>
              <p style={{ fontSize: '0.875rem', marginBottom: '0.5rem' }}><strong>Debug Info:</strong></p>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0' }}>URL Slug: <code>{slug}</code></p>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0' }}>Error: <code>{error || 'No article found'}</code></p>
              <p style={{ fontSize: '0.75rem', margin: '0.25rem 0', color: '#f0d9c7' }}>
                Check browser console for detailed error messages.
              </p>
            </div>
            <Link to="/decryptmundi" className="btn-back" style={{ marginTop: '1.5rem' }}>
              <ArrowLeft size={18} />
              Back to Articles
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHead
        title={article.meta_title || article.title}
        description={article.meta_description || article.excerpt || 'Read the full article on Youth Parliament Morocco'}
        keywords={article.meta_keywords}
        image={article.featured_image_url || article.cover_image_url}
        url={`${window.location.origin}/decryptmundi/${article.slug}`}
        type="article"
        author={article.author_name}
        publishedTime={article.published_at}
        modifiedTime={article.updated_at}
      />

      <div className="decryptmundi-page article-detail-page">
        <div className="decryptmundi-header-spacer"></div>

        {/* Back Button */}
        <div className="article-detail-container">
          <Link to="/decryptmundi" className="btn-back">
            <ArrowLeft size={18} />
            Back to Articles
          </Link>
        </div>

        {/* Layout: Content (70%) + Sidebar (30%) */}
        <div className="decryptmundi-layout article-detail-layout">
          {/* Main Content (70%) */}
          <main className="decryptmundi-main article-detail-main">
            {/* Category & Meta */}
            <div className="article-meta">
              {article.category && (
                <span className="article-category">{article.category}</span>
              )}
              {article.published_at && (
                <span className="article-date">
                  <Calendar size={16} />
                  {format(new Date(article.published_at), 'MMMM dd, yyyy')}
                </span>
              )}
              {article.read_time_minutes && (
                <span className="article-read-time">
                  <Clock size={16} />
                  {article.read_time_minutes} min read
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="article-title">{article.title}</h1>

            {/* Author & Editor */}
            <div className="article-author-section">
              {article.author_name && (
                <div className="article-author">
                  <UserIcon size={20} />
                  <div>
                    <div className="article-author-name">{article.author_name}</div>
                    {article.author_bio && (
                      <div className="article-author-bio">{article.author_bio}</div>
                    )}
                  </div>
                </div>
              )}
              {article.editor_name && (
                <div className="article-editor">
                  <span className="article-editor-label">Edited by:</span>
                  <span className="article-editor-name">{article.editor_name}</span>
                </div>
              )}
            </div>

            {/* Introduction (Excerpt) */}
            {article.excerpt && (
              <div className="article-excerpt">{article.excerpt}</div>
            )}

            {/* Featured Image */}
            {article.featured_image_url && (
              <div className="article-featured-image-container">
                <img
                  src={article.featured_image_url}
                  alt={article.title}
                  className="article-featured-image"
                />
              </div>
            )}

            {/* Content with Drop Cap */}
            <div className="article-content-wrapper">
              <div
                className="article-content"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />
            </div>

            {/* Share Section */}
            <div className="article-share">
              <h3>Share this article</h3>
              <div className="article-share-buttons">
                <button
                  onClick={() => {
                    navigator.share?.({
                      title: article.title,
                      text: article.excerpt || '',
                      url: window.location.href
                    }).catch(() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard!');
                    });
                  }}
                  className="btn-share"
                >
                  <Share2 size={18} />
                  Share
                </button>
              </div>
            </div>
          </main>

          {/* Sidebar - Latest Articles (30%) */}
          <aside className="decryptmundi-sidebar article-detail-sidebar">
            <h2 className="sidebar-title">Latest Articles</h2>
            <div className="sidebar-articles">
              {sidebarArticles.length > 0 ? (
                sidebarArticles.map(sidebarArticle => (
                  <SidebarArticleCard key={sidebarArticle.id} article={sidebarArticle} />
                ))
              ) : (
                <p className="sidebar-empty">No more articles</p>
              )}
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}

function SidebarArticleCard({ article }: { article: Article }) {
  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    if (!html) return '';
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const previewText = stripHtml(article.excerpt || article.content).substring(0, 80) + '...';

  const articlePath = article.slug ? `/decryptmundi/${article.slug}` : `/decryptmundi/${article.id}`;
  
  return (
    <Link to={articlePath} className="sidebar-article-card">
      <div className="sidebar-article-image-wrapper">
        {article.featured_image_url ? (
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="sidebar-article-image"
          />
        ) : (
          <div className="sidebar-article-placeholder"></div>
        )}
        
        {/* Text Overlay */}
        <div className="sidebar-article-overlay">
          {article.category && (
            <span className="sidebar-article-category">{article.category}</span>
          )}
          <h3 className="sidebar-article-title">{article.title}</h3>
          <p className="sidebar-article-preview">{previewText}</p>
          <div className="sidebar-article-meta">
            {article.published_at && (
              <span className="sidebar-article-date">
                {format(new Date(article.published_at), 'MMM dd')}
              </span>
            )}
            {article.read_time_minutes && (
              <span className="sidebar-article-read-time">
                {article.read_time_minutes} min
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}