import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents, resetFilters } from '../features/events/eventsSlice';
import EventCard from '../components/EventCard';
import CategoryStrip from '../components/CategoryStrip';
import SearchFilterBar from '../components/SearchFilterBar';
import Pagination from '../components/Pagination';
import LoadingSkeleton from '../components/LoadingSkeleton';

function EventsPage() {
  const dispatch = useDispatch();
  const { items, filters, pageInfo, loading, error } = useSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [
    dispatch,
    filters.keyword,
    filters.classificationName,
    filters.city,
    filters.startDateTime,
    filters.sort,
    filters.page,
  ]);

  return (
    <section className="events-page">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">Ticketmaster Discovery API</span>
          <h1>Explore Live Events</h1>
          <p>Browse upcoming concerts, sports matches, theatre shows, and community festivals.</p>
        </div>
        {pageInfo.totalElements > 0 && (
          <div className="results-counter">
            Showing <strong>{items.length}</strong> of{' '}
            <strong>{pageInfo.totalElements.toLocaleString()}</strong> events
          </div>
        )}
      </div>

      <CategoryStrip />
      <SearchFilterBar />

      {error && (
        <div className="error-state-card" role="alert">
          <h3>Could not load events</h3>
          <p>{error}</p>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => dispatch(fetchEvents())}
          >
            Try Again
          </button>
        </div>
      )}

      {loading && <LoadingSkeleton variant="grid" count={6} />}

      {!loading && !error && items.length === 0 && (
        <div className="empty-state-card">
          <h3>No matching events found</h3>
          <p>Try adjusting your search keywords or clearing active filters.</p>
          <button
            type="button"
            className="btn btn-outline"
            onClick={() => dispatch(resetFilters())}
          >
            Reset Filters
          </button>
        </div>
      )}

      {!loading && !error && items.length > 0 && (
        <>
          <div className="events-grid">
            {items.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
          <Pagination />
        </>
      )}
    </section>
  );
}

export default EventsPage;
