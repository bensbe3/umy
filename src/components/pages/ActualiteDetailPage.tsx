import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase, Actualite } from '../../lib/supabase';
import { Calendar, ArrowLeft, X } from 'lucide-react';
import { format } from 'date-fns';
import './ActualiteDetailPage.css';

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
      
      // Increment view count
      if (data) {
        await supabase
          .from('commission_actualites')
          .update({ views_count: (data.views_count || 0) + 1 })
          .eq('id', data.id);
      }
    } catch (err: any) {
      console.error('Error fetching actualité:', err);
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

  return (
    <div className="actualite-detail-page">
      <div className="actualite-detail-header-spacer"></div>

      {/* Back Button */}
      <div className="actualite-detail-container">
        <button
          onClick={() => navigate(`/commissions#${actualite.commission_id}`)}
          className="btn-back"
        >
          <ArrowLeft size={18} />
          Back to {commissionName}
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
