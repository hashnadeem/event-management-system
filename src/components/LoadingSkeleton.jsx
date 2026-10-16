import React from 'react';

function LoadingSkeleton({ variant = 'grid', count = 6 }) {
  if (variant === 'detail') {
    return (
      <div className="skeleton-detail-wrapper" aria-busy="true" aria-label="Loading event details">
        <div className="details-hero-card">
          <div className="skeleton-box skeleton-hero-media" />
          <div className="details-hero-content">
            <div className="skeleton-box skeleton-line-sm" />
            <div className="skeleton-box skeleton-line-lg" />
            <div className="skeleton-box skeleton-line-md" />
            <div className="skeleton-box skeleton-line-md" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="events-grid" aria-busy="true" aria-label="Loading events">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="event-card skeleton-card">
          <div className="skeleton-box skeleton-card-media" />
          <div className="event-card-body">
            <div className="skeleton-box skeleton-line-sm" />
            <div className="skeleton-box skeleton-line-lg" />
            <div className="skeleton-box skeleton-line-md" />
            <div className="skeleton-box skeleton-btn" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default LoadingSkeleton;
