import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEventById, clearSelectedEvent } from '../features/events/eventsSlice';
import LoadingSkeleton from '../components/LoadingSkeleton';

function formatFullDate(localDate, localTime) {
  if (!localDate) return 'Date to be announced';
  const parsed = new Date(`${localDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return localDate;

  const datePart = parsed.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  if (!localTime) return datePart;

  const [hoursStr, minutesStr] = localTime.split(':');
  const hours = Number(hoursStr);
  const minutes = minutesStr || '00';
  if (Number.isNaN(hours)) return datePart;

  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours % 12 || 12;
  return `${datePart} at ${hour12}:${minutes} ${period}`;
}

function EventDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { selectedEvent: event, detailLoading, detailError } = useSelector((state) => state.events);

  useEffect(() => {
    if (id) {
      dispatch(fetchEventById(id));
    }
    return () => {
      dispatch(clearSelectedEvent());
    };
  }, [dispatch, id]);

  if (detailLoading) {
    return (
      <section className="event-details-page">
        <LoadingSkeleton variant="detail" />
      </section>
    );
  }

  if (detailError) {
    return (
      <section className="event-details-page">
        <div className="error-state-card" role="alert">
          <h3>Unable to load event</h3>
          <p>{detailError}</p>
          <div className="not-found-actions">
            <button type="button" className="btn btn-outline" onClick={() => navigate('/events')}>
              ← Back to Events
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(fetchEventById(id))}
            >
              Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  if (!event) {
    return null;
  }

  const venue = event.venue || {};
  const mapQuery =
    venue.latitude && venue.longitude
      ? `${venue.latitude},${venue.longitude}`
      : encodeURIComponent(`${venue.name || ''} ${venue.fullLocation || ''}`.trim());
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapQuery}`;

  const primaryPrice = event.priceRanges?.[0];

  return (
    <section className="event-details-page">
      <div className="details-top-nav">
        <Link to="/events" className="back-link">
          ← Back to Explore Events
        </Link>
      </div>

      <div className="details-hero-card">
        <div className="details-hero-media">
          <img src={event.imageUrl} alt={event.name} />
          <div className="details-hero-badges">
            <span className="category-pill">{event.category}</span>
            {event.genre && <span className="category-pill">{event.genre}</span>}
            {event.subGenre && <span className="category-pill">{event.subGenre}</span>}
          </div>
        </div>

        <div className="details-hero-content">
          <span className="details-date-eyebrow">
            {formatFullDate(event.localDate, event.localTime)}
          </span>
          <h1>{event.name}</h1>

          <div className="details-meta-list">
            <div className="details-meta-item">
              <span className="meta-label">Venue</span>
              <strong>{venue.name}</strong>
              <span>
                {[venue.address, venue.fullLocation, venue.postalCode].filter(Boolean).join(' • ')}
              </span>
            </div>

            <div className="details-meta-item">
              <span className="meta-label">Ticket Status & Pricing</span>
              <strong>
                {primaryPrice
                  ? `${primaryPrice.currency || 'USD'} ${primaryPrice.min} – ${primaryPrice.max}`
                  : 'Standard Event Admission'}
              </strong>
              <span>Status: {(event.status || 'onsale').toUpperCase()}</span>
            </div>
          </div>

          <div className="details-cta-row">
            {event.url && (
              <a
                href={event.url}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                Official Ticketmaster Listing ↗
              </a>
            )}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              Open Venue in Maps ↗
            </a>
          </div>
        </div>
      </div>

      <div className="details-columns">
        <div className="details-main-col">
          {(event.info || event.pleaseNote || event.ticketLimit) && (
            <div className="details-panel">
              <h2>Event Information & Guidelines</h2>
              {event.info && <p className="details-text">{event.info}</p>}
              {event.pleaseNote && (
                <div className="details-note-box">
                  <strong>Please Note:</strong>
                  <p>{event.pleaseNote}</p>
                </div>
              )}
              {event.ticketLimit && (
                <p className="details-ticket-limit">
                  <strong>Ticket Limit:</strong> {event.ticketLimit}
                </p>
              )}
            </div>
          )}

          {event.attractions?.length > 0 && (
            <div className="details-panel">
              <h2>Featured Lineup & Attractions</h2>
              <div className="attractions-grid">
                {event.attractions.map((item) => (
                  <div key={item.id || item.name} className="attraction-chip">
                    <img src={item.imageUrl} alt={item.name} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="details-side-col">
          <div className="details-panel">
            <h2>Venue & Location</h2>
            <p className="venue-title">{venue.name}</p>
            {venue.address && <p className="venue-line">{venue.address}</p>}
            <p className="venue-line">{venue.fullLocation}</p>
            {venue.boxOfficeInfo && (
              <div className="venue-extra">
                <strong>Box Office:</strong>
                <p>{venue.boxOfficeInfo}</p>
              </div>
            )}
            {venue.parkingDetail && (
              <div className="venue-extra">
                <strong>Parking:</strong>
                <p>{venue.parkingDetail}</p>
              </div>
            )}
          </div>

          {event.seatmapUrl && (
            <div className="details-panel">
              <h2>Venue Seatmap</h2>
              <div className="seatmap-frame">
                <img src={event.seatmapUrl} alt={`Seatmap for ${venue.name}`} />
              </div>
            </div>
          )}
        </aside>
      </div>
    </section>
  );
}

export default EventDetailsPage;
