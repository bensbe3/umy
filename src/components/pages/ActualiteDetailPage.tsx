import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, Actualite } from '../../lib/supabase';
import { Calendar, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import './ActualiteDetailPage.css';

const BASE_URL = 'https://unitedmoroccanyouth.org';

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

export function ActualiteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [actualite, setActualite] = useState<Actualite | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchActualite(id);
    }
  }, [id]);

  // ✅ Inject NewsArticle JSON-LD schema
  useEffect(() => {
    if (!actualite) return;

    const commissionName = COMMISSION_NAMES[actualite.commission_id] || 'Commission';

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-actualite-schema', 'true');
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'NewsArticle',
      headline: actualite.title,
      description: (() => {
        const tmp = document.createElement('div');
        tmp.innerHTML = actualite.content;
        return (tmp.textContent || tmp.innerText || '').substring(0, 160);
      })(),
      image:
        actualite.image_url || `${BASE_URL}/images/logoUmy.png`,
      datePublished: actualite.published_at,
      dateModified: actualite.updated_at,
      articleSection: commissionName,
      publisher: {
        '@type': 'Organization',
        name: 'United Moroccan Youth',
        logo: {
          '@type': 'ImageObject',
          url: `${BASE_URL}/images/logoUmy.png`,
        },
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': `${BASE_URL}/actualite/${actualite.id}`,
      },
    });

    document.querySelector('script[data-actualite-schema]')?.remove();
    document.head.appendChild(script);

    // Also update page title & description for this page (no SEOHead used here)
    document.title = `${actualite.title} | United Moroccan Youth`;
    const descMeta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (descMeta) {
      const tmp = document.createElement('div');
      tmp.innerHTML = actualite.content;
      descMeta.setAttribute(
        'content',
        (tmp.textContent || tmp.innerText || '').substring(0, 160)
      );
    }

    return () => {
      document.querySelector('script[data-actualite-schema]')?.remove();
    };
  }, [actualite]);

  const fetchActualite = async (actualiteId: string) => {
    if (!supabase) {
      setError('Database connection unavailable');
      setLoading(false);
      return;
    }

    try {
      const { data, error: fetchError } = await supabase
        .from('commission_actualites')
        .select('*')
        .eq('id', actualiteId)
        .eq('status', 'published')
        .single();

      if (fetchError) {
        if (fetchError.code === 'PGRST116') {
          setError('Actualité not found');
        } else {
          setError(fetchError.message);
        }
        setLoading(false);
        return;
      }

      setActualite(data);

      if (data) {
        await supabase
          .from('commission_actualites')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load actualité');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="actualite-detail-page">
        <div className="actualite-detail-header-spacer"></div>
        <div className="actualite-detail-container">
          <div className="actualite-loading">
            <div className="loading-spinner"></div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !actualite) {
    return (
      <div className="actualite-detail-page">
        <div className="actualite-detail-header-spacer"></div>
        <div className="actualite-detail-container">
          <div className="actualite-error">
            <h1>Actualité Not Found</h1>
            <p>{error || 'The actualité you are looking for does not exist.'}</p>
            <Link to="/commissions" className="btn-back">
              <ArrowLeft size={18} />
              Back to Commissions
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const commissionColor = COMMISSION_COLORS[actualite.commission_id] || '#0ea5e9';
  const commissionName = COMMISSION_NAMES[actualite.commission_id] || 'Commission';
  const isOrientation = actualite.commission_id === 'orientation';

  return (
    <div className="actualite-detail-page">
      <div className="actualite-detail-header-spacer"></div>

      {/* Back Button */}
      <div className="actualite-detail-container">
        <button
          onClick={() => navigate(isOrientation ? '/' : `/commissions#${actualite.commission_id}`)}
          className="btn-back"
        >
          <ArrowLeft size={18} />
          Back to {isOrientation ? 'News & Actualities' : commissionName}
        </button>
      </div>

      {/* Main Content */}
      <article className="actualite-detail-container">
        {/* Commission Badge */}
        <div className="actualite-commission-badge" style={{ backgroundColor: commissionColor }}>
          {commissionName}
        </div>

        {/* Title */}
        <h1 className="actualite-detail-title">{actualite.title}</h1>

        {/* Meta */}
        <div className="actualite-detail-meta">
          {actualite.published_at && (
            <span className="actualite-detail-date">
              <Calendar size={16} />
              {format(new Date(actualite.published_at), 'MMMM dd, yyyy')}
            </span>
          )}
        </div>

        {/* Featured Image */}
        {actualite.image_url && (
          <div className="actualite-detail-image-container">
            <img
              src={actualite.image_url}
              alt={actualite.title}
              className="actualite-detail-image"
            />
          </div>
        )}

        {/* Content */}
        <div
          className="actualite-detail-content"
          dangerouslySetInnerHTML={{ __html: actualite.content }}
        />
      </article>
    </div>
  );
}