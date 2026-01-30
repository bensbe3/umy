import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase, Actualite } from '../lib/supabase';
import { format } from 'date-fns';
import { toast } from 'sonner';
import './ActualitesSection.css';

interface ActualitesSectionProps {
  commissionId: 'ir' | 'mp' | 'sd';
  commissionColor: string;
  commissionName: string;
}

export function ActualitesSection({
  commissionId,
  commissionColor,
  commissionName,
}: ActualitesSectionProps) {
  const [actualites, setActualites] = useState<Actualite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActualites();
  }, [commissionId]);

  const fetchActualites = async () => {
    try {
      if (!supabase) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('commission_actualites')
        .select('*')
        .eq('commission_id', commissionId)
        .eq('status', 'published')
        .order('published_at', { ascending: false })
        .limit(20); // Fetch up to 20 for scroll

      if (error) throw error;
      setActualites(data || []);
    } catch (error) {
      console.error('Error fetching actualites:', error);
      toast.error('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="actualites-section-editorial">
        <div className="loading-container">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  // Show latest 4, rest in scroll
  const visibleActualites = actualites.slice(0, 4);
  const scrollableActualites = actualites.slice(4);

  return (
    <div className="actualites-section-editorial" data-commission={commissionId}>
      {/* Section Header - Compact */}
      <div className="actualites-header-editorial" style={{ borderBottomColor: commissionColor }}>
        <h2 className="actualites-title-editorial" style={{ color: commissionColor }}>
          Actualités {commissionName}
        </h2>
      </div>

      {actualites.length === 0 ? (
        <div className="actualites-empty-editorial">
          <h3>No news posted yet</h3>
        </div>
      ) : (
        <div className="actualites-container-compact">
          {/* Latest 4 - Grid */}
          <div className="actualites-grid-compact">
            {visibleActualites.map(actualite => (
              <ActualiteCardCompact
                key={actualite.id}
                actualite={actualite}
                commissionId={commissionId}
                commissionColor={commissionColor}
              />
            ))}
          </div>

          {/* Scrollable Older Posts */}
          {scrollableActualites.length > 0 && (
            <div className="actualites-scroll-container">
              <div className="actualites-scroll-wrapper">
                {scrollableActualites.map(actualite => (
                  <ActualiteCardCompact
                    key={actualite.id}
                    actualite={actualite}
                    commissionId={commissionId}
                    commissionColor={commissionColor}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function ActualiteCardCompact({
  actualite,
  commissionId,
  commissionColor
}: {
  actualite: Actualite;
  commissionId: 'ir' | 'mp' | 'sd';
  commissionColor: string;
}) {
  // Use the actualité's own commission_id, not the prop (in case they differ)
  const actualCommissionId = actualite.commission_id || commissionId;
  
  // Strip HTML tags for preview
  const stripHtml = (html: string) => {
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const previewText = stripHtml(actualite.content).substring(0, 100) + '...';

  const handleClick = (e: React.MouseEvent) => {
    console.log('🖱️ Clicked actualité:', {
      title: actualite.title,
      actualite_commission_id: actualite.commission_id,
      section_commission_id: commissionId,
      using: actualCommissionId,
      url: `/commissions#${actualCommissionId}`
    });
    // Let the Link handle navigation, but ensure hash is processed
    setTimeout(() => {
      const element = document.getElementById(`commission-${actualCommissionId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        console.warn('⚠️ Commission element not found:', `commission-${actualCommissionId}`);
      }
    }, 100);
  };

  return (
    <Link
      to={`/actualite/${actualite.id}`}
      className="actualite-card-compact"
      style={{ borderColor: commissionColor, textDecoration: 'none' }}
      onClick={(e) => {
        console.log('🖱️ Clicked actualité:', {
          title: actualite.title,
          id: actualite.id,
          url: `/actualite/${actualite.id}`
        });
      }}
    >
      <div className="actualite-card-compact-image-wrapper">
        {actualite.image_url ? (
          <img
            src={actualite.image_url}
            alt={actualite.title}
            className="actualite-card-compact-image"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <div className="actualite-card-compact-placeholder" style={{ backgroundColor: commissionColor + '20' }}></div>
        )}
        
        {/* Text Overlay */}
        <div className="actualite-card-compact-overlay">
          <h4 className="actualite-card-compact-title">{actualite.title}</h4>
          <p className="actualite-card-compact-preview">{previewText}</p>
          <div className="actualite-card-compact-meta">
            {actualite.published_at && (
              <span className="actualite-card-compact-date">
                {format(new Date(actualite.published_at), 'MMM dd')}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
