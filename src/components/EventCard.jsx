import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { registerForEvent } from '../features/registrations/registrationsSlice';

function formatEventDate(localDate, localTime) {
  if (!localDate) return 'Date TBA';
  const parsed = new Date(`${localDate}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) return localDate;

  const datePart = parsed.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
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
  return `${datePart} • ${hour12}:${minutes} ${period}`;
}

function getStatusBadge(status) {
  const code = (status || 'onsale').toLowerCase();
  if (code === 'onsale') return { label: 'On Sale', className: 'status-badge status-onsale' };
  if (code === 'offsale') return { label: 'Off Sale', className: 'status-badge status-offsale' };
  if (code === 'cancelled' || code === 'canceled') {
    return { label: 'Cancelled', className: 'status-badge status-cancelled' };
  }
  return { label: code, className: 'status-badge status-default' };
}

function EventCard({ event, actionSlot }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const userKey = currentUser?.email || currentUser?.id || null;
  const userRegistrations = useSelector((state) =>
    userKey ? state.registrations.byUser[userKey] || [] : []
  );

  const isRegistered = userRegistrations.some((reg) => reg.eventId === event.id);
  const statusBadge = getStatusBadge(event.status);

  const handleQuickRegister = () => {
    if (!isAuthenticated || !userKey) {
      navigate('/login', { state: { from: location } });
      return;
    }
    dispatch(registerForEvent({ userKey, event }));
  };

  return (
    <article className="event-card">
      <Link to={`/events/${event.id}`} className="event-card-media">
        <img src={event.imageUrl} alt={event.name} loading="lazy" />
        <div className="event-card-badges">
          <span className="category-pill">{event.category}</span>
          <span className={statusBadge.className}>{statusBadge.label}</span>
        </div>
      </Link>

      <div className="event-card-body">
        <div className="event-card-date">{formatEventDate(event.localDate, event.localTime)}</div>
        <h3 className="event-card-title">
          <Link to={`/events/${event.id}`}>{event.name}</Link>
        </h3>
        <p className="event-card-venue">
          <strong>{event.venue?.name}</strong>
          <span>{event.venue?.fullLocation}</span>
        </p>

        {event.genre && (
          <div className="event-card-tags">
            <span className="genre-tag">{event.genre}</span>
            {event.subGenre && <span className="genre-tag">{event.subGenre}</span>}
          </div>
        )}

        <div className="event-card-footer">
          <Link to={`/events/${event.id}`} className="btn btn-outline btn-sm">
            View Details
          </Link>

          {actionSlot || (
            isRegistered ? (
              <span className="registered-pill">Registered ✓</span>
            ) : (
              <button
                type="button"
                className="btn btn-primary btn-sm"
                onClick={handleQuickRegister}
              >
                Register
              </button>
            )
          )}
        </div>
      </div>
    </article>
  );
}

export default EventCard;
