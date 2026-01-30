import { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  priority?: boolean;
  className?: string;
  fallback?: string;
}

/**
 * Optimized Image Component
 * - Lazy loading by default
 * - Responsive sizing
 * - Error handling with fallback
 * - Intersection Observer for performance
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  priority = false,
  className = '',
  fallback,
  ...props
}: OptimizedImageProps) {
  const [imageSrc, setImageSrc] = useState<string | null>(priority ? src : null);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (priority || !imgRef.current) {
      setImageSrc(src);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setImageSrc(src);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px',
        threshold: 0.01,
      }
    );

    observer.observe(imgRef.current);

    return () => {
      observer.disconnect();
    };
  }, [src, priority]);

  const handleError = () => {
    setHasError(true);
    if (fallback) {
      setImageSrc(fallback);
    }
  };

  if (hasError && !fallback) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
        aria-label={alt}
      >
        <span className="text-gray-400 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={imageSrc || undefined}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={handleError}
      style={{
        objectFit: 'cover',
        ...props.style,
      }}
      {...props}
    />
  );
}
