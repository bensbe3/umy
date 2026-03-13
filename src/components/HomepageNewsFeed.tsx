import { useEffect, useState } from 'react';
import { supabase, Actualite } from '../lib/supabase';
import { Calendar, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { Link } from 'react-router-dom';
import './HomepageNewsFeed.css';

const COMMISSION_COLORS: Record<string, string> = {
  ir: '#0ea5e9',
  mp: '#8B0000',
  sd: '#d4af37',
  orientation: '#6366f1',
};

const COMMISSION_NAMES: Record<string, string> = {
  ir: 'International Relations',
  mp: 'Moroccan Politics',
  sd: 'Social Development',
  orientation: 'Orientation',
};

const POSTS_PER_PAGE = 20;

type CommissionFilter = 'UMY' | 'orientation' | 'ir' | 'mp' |'sd' ;

const FILTER_OPTIONS: { value: CommissionFilter; label: string }[] = [
  { value: 'UMY', label: 'UMY' },
  { value: 'orientation', label: 'Orientation' },
  { value: 'ir', label: 'International Relations' },
  { value: 'mp', label: 'Moroccan Politics' },
  { value: 'sd', label: 'Social Development' },
];

export function HomepageNewsFeed() {
  const [allActualites, setAllActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CommissionFilter>('UMY');

  const actualites =
    filter === 'UMY'
      ? allActualites
      : allActualites.filter((a) => a.commission_id === filter);

  useEffect(() => {
    fetchAllActualites();
  }, []);

  const fetchAllActualites = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('commission_actualites')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(POSTS_PER_PAGE);

      if (error) throw error;
      setAllActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="news-feed-section" id="news-actualities" aria-label="News and Actualities">
        <div className="container">
          <div className="news-feed-header">
            <h2>Latest News</h2>
          </div>
          <p>Loading news...</p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="news-feed-section news-feed-section--carousel"
      id="news-actualities"
      aria-label="News and Actualities - slide through latest posts"
      tabIndex={0}
    >
      <div className="container">
        <div className="news-feed-header">
          <div className="section-label">Latest Updates</div>
          <h2 className="section-title-center">News &amp; Actualities</h2>
          <p className="section-description">
            Stay updated with the latest news and actualities.
          </p>
        </div>

        <div className="news-filter">
          <span className="news-filter-label">Show:</span>
          <div className="news-filter-options">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                className={`news-filter-btn ${filter === opt.value ? 'active' : ''}`}
                onClick={() => setFilter(opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {actualites.length === 0 ? (
          <p className="news-no-posts">No posts in this category yet.</p>
        ) : (
          <div className="news-carousel-track">
            {actualites.map((actualite) => {
              const commissionColor = COMMISSION_COLORS[actualite.commission_id] || '#0ea5e9';
              const commissionName = COMMISSION_NAMES[actualite.commission_id] || 'Commission';

              return (
                <article key={actualite.id} className="news-card news-card--slide">
                  <div
                    className="news-commission-tag"
                    style={{ backgroundColor: commissionColor }}
                  >
                    {commissionName}
                  </div>
                  <div className="news-card-image-wrap">
                    {actualite.image_url ? (
                      <img
                        src={actualite.image_url}
                        alt={actualite.title}
                        className="news-image"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="news-image-placeholder" />
                    )}
                  </div>
                  <div className="news-content">
                    <h3>{actualite.title}</h3>
                    <div
                      className="news-excerpt"
                      dangerouslySetInnerHTML={{
                        __html:
                          actualite.content.length > 150
                            ? actualite.content.substring(0, 150) + '...'
                            : actualite.content,
                      }}
                    />
                    <div className="news-meta">
                      {actualite.published_at && (
                        <span>
                          <Calendar size={14} />
                          {format(new Date(actualite.published_at), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/actualite/${actualite.id}`}
                      className="news-link"
                      style={{ color: commissionColor }}
                    >
                      Read More <ArrowRight size={16} />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}