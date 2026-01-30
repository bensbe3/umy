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
};

const COMMISSION_NAMES: Record<string, string> = {
  ir: 'International Relations',
  mp: 'Moroccan Politics',
  sd: 'Social Development',
};

export function HomepageNewsFeed() {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

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
        .limit(9);

      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="news-feed-section">
        <div className="container">
          <div className="news-feed-header">
            <h2>Latest News</h2>
          </div>
          <p>Loading news...</p>
        </div>
      </section>
    );
  }

  if (actualites.length === 0) {
    return null; // Don't show section if no news
  }

  return (
    <section className="news-feed-section">
      <div className="container">
        <div className="news-feed-header">
          <div className="section-label">Latest Updates</div>
          <h2 className="section-title-center">News & Actualités</h2>
          <p className="section-description">
            Stay updated with the latest news and updates from all our commissions.
          </p>
        </div>

        <div className="news-feed-grid">
          {actualites.map((actualite) => {
            const commissionColor = COMMISSION_COLORS[actualite.commission_id] || '#0ea5e9';
            const commissionName = COMMISSION_NAMES[actualite.commission_id] || 'Commission';

            return (
              <article key={actualite.id} className="news-card">
                <div
                  className="news-commission-tag"
                  style={{ backgroundColor: commissionColor }}
                >
                  {commissionName}
                </div>
                {actualite.image_url && (
                  <img
                    src={actualite.image_url}
                    alt={actualite.title}
                    className="news-image"
                    onError={(e) => {
                      console.error('Homepage image failed to load:', actualite.image_url);
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('Homepage image loaded:', actualite.image_url);
                    }}
                  />
                )}
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
                    onClick={(e) => {
                      console.log('🖱️ Clicked Read More:', {
                        title: actualite.title,
                        id: actualite.id,
                        url: `/actualite/${actualite.id}`
                      });
                    }}
                  >
                    Read More <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>

        <div className="news-feed-footer">
          <Link to="/commissions" className="view-all-button">
            View All Commissions
            <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </section>
  );
}
