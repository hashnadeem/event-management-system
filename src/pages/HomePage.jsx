import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, setFilters, resetFilters } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import LoadingSkeleton from '../components/LoadingSkeleton';

const SHOWCASE_CATEGORIES = [
  {
    name: 'Music',
    icon: '🎵',
    desc: 'Live concerts, stadium tours, and music festivals',
  },
  {
    name: 'Sports',
    icon: '🏟️',
    desc: 'Championship games, tournaments, and arena matchups',
  },
  {
    name: 'Arts & Theatre',
    icon: '🎭',
    desc: 'Broadway shows, stand-up comedy, and cultural performances',
  },
  {
    name: 'Film',
    icon: '🎬',
    desc: 'Premieres, screenings, and film festival showcases',
  },
];

function HomePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [heroQuery, setHeroQuery] = useState('');

  const { items, loading, error } = useSelector((state) => state.events);
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth);
  const userKey = currentUser?.email || currentUser?.id || null;
  const userRegistrations = useSelector((state) =>
    userKey ? state.registrations.byUser[userKey] || [] : []
  );

  useEffect(() => {
    if (items.length === 0 && !loading) {
      dispatch(fetchEvents({ page: 0, size: 12, sort: 'date,asc' }));
    }
  }, [dispatch, items.length, loading]);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    dispatch(
      setFilters({
        keyword: heroQuery.trim(),
        classificationName: 'All',
        page: 0,
      })
    );
    navigate('/events');
  };

  const handleCategoryJump = (categoryName) => {
    dispatch(
      setFilters({
        classificationName: categoryName,
        keyword: '',
        page: 0,
      })
    );
    navigate('/events');
  };

  const handleViewAllEvents = () => {
    dispatch(resetFilters());
    navigate('/events');
  };

  const featuredEvents = items.slice(0, 6);

  return (
    <div className="home-page">
      <section className="hero-banner">
        <div className="hero-content">
          <span className="hero-badge">Powered by Ticketmaster Discovery API v2</span>
          <h1>Discover & Reserve Unforgettable Live Events</h1>
          <p>
            Explore thousands of real-time concerts, sports matchups, theatre productions, and
            festivals happening around the world.
          </p>

          <form className="hero-search-form" onSubmit={handleHeroSearch}>
            <input
              type="text"
              placeholder="Search by artist, team, event name, or venue..."
              value={heroQuery}
              onChange={(e) => setHeroQuery(e.target.value)}
              aria-label="Search events"
            />
            <button type="submit" className="btn btn-primary">
              Search Events
            </button>
          </form>

          {isAuthenticated && currentUser && (
            <div className="hero-user-strip">
              <span>
                Signed in as <strong>{currentUser.name}</strong> • You have{' '}
                <strong>{userRegistrations.length}</strong> registered{' '}
                {userRegistrations.length === 1 ? 'event' : 'events'}.
              </span>
              <Link to="/my-events" className="hero-user-link">
                Manage My Events →
              </Link>
            </div>
          )}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Browse by Classification</span>
            <h2>Explore Top Categories</h2>
          </div>
        </div>

        <div className="category-showcase-grid">
          {SHOWCASE_CATEGORIES.map((cat) => (
            <button
              key={cat.name}
              type="button"
              className="category-showcase-card"
              onClick={() => handleCategoryJump(cat.name)}
            >
              <span className="showcase-icon">{cat.icon}</span>
              <h3>{cat.name}</h3>
              <p>{cat.desc}</p>
              <span className="showcase-cta">Browse {cat.name} →</span>
            </button>
          ))}
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <div>
            <span className="section-eyebrow">Live Feed</span>
            <h2>Featured Upcoming Events</h2>
            <p>Real-time upcoming events fetched directly from Ticketmaster.</p>
          </div>
          <button type="button" onClick={handleViewAllEvents} className="btn btn-outline">
            View All Events →
          </button>
        </div>

        {error && (
          <div className="error-state-card">
            <h3>Could not load featured events</h3>
            <p>{error}</p>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => dispatch(fetchEvents({ page: 0, size: 12 }))}
            >
              Retry
            </button>
          </div>
        )}

        {loading && <LoadingSkeleton variant="grid" count={6} />}

        {!loading && !error && featuredEvents.length > 0 && (
          <div className="events-grid">
            {featuredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

export default HomePage;
