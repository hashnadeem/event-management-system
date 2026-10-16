import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  cancelRegistration,
  toggleCompletedStatus,
} from '../features/registrations/registrationsSlice';
import { isRegistrationCompleted, formatShortTimestamp } from '../utils/dateUtils';
import EventCard from '../components/EventCard';

function MyEventsPage() {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('upcoming');

  const { currentUser } = useSelector((state) => state.auth);
  const userKey = currentUser?.email || currentUser?.id || null;

  const registrations = useSelector((state) =>
    userKey ? state.registrations.byUser[userKey] || [] : []
  );

  const upcomingRegistrations = registrations.filter((reg) => !isRegistrationCompleted(reg));
  const completedRegistrations = registrations.filter((reg) => isRegistrationCompleted(reg));

  const displayedList =
    activeTab === 'upcoming' ? upcomingRegistrations : completedRegistrations;

  const handleCancel = (eventId) => {
    if (!userKey) return;
    dispatch(cancelRegistration({ userKey, eventId }));
  };

  const handleToggleCompleted = (eventId) => {
    if (!userKey) return;
    dispatch(toggleCompletedStatus({ userKey, eventId }));
  };

  return (
    <section className="my-events-page">
      <div className="section-header">
        <div>
          <span className="section-eyebrow">Personal Dashboard</span>
          <h1>My Registered Events</h1>
          <p>
            Track your upcoming event passes and review completed events for{' '}
            <strong>{currentUser?.name || currentUser?.email}</strong>.
          </p>
        </div>

        <div className="my-events-stats">
          <div className="stat-pill">
            <span className="stat-count">{registrations.length}</span>
            <span className="stat-label">Total</span>
          </div>
          <div className="stat-pill">
            <span className="stat-count">{upcomingRegistrations.length}</span>
            <span className="stat-label">Upcoming</span>
          </div>
          <div className="stat-pill">
            <span className="stat-count">{completedRegistrations.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      <div className="tabs-bar" role="tablist" aria-label="Registered event status tabs">
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'upcoming'}
          className={activeTab === 'upcoming' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('upcoming')}
        >
          Upcoming Events ({upcomingRegistrations.length})
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'completed'}
          className={activeTab === 'completed' ? 'tab-btn active' : 'tab-btn'}
          onClick={() => setActiveTab('completed')}
        >
          Completed Events ({completedRegistrations.length})
        </button>
      </div>

      {displayedList.length === 0 ? (
        <div className="empty-state-card">
          <h3>
            {activeTab === 'upcoming'
              ? 'No upcoming event registrations'
              : 'No completed events yet'}
          </h3>
          <p>
            {activeTab === 'upcoming'
              ? 'Explore live concerts, sports, and theatre events to reserve your spot.'
              : 'Events you have attended or marked as completed will appear here.'}
          </p>
          <Link to="/events" className="btn btn-primary">
            Explore Events
          </Link>
        </div>
      ) : (
        <div className="events-grid">
          {displayedList.map((reg) => {
            const completed = isRegistrationCompleted(reg);
            return (
              <div key={reg.registrationId || reg.eventId} className="my-event-wrapper">
                <div className="my-event-meta-header">
                  <span className="confirmation-badge">{reg.registrationId}</span>
                  <span className="registered-date-label">
                    Booked {formatShortTimestamp(reg.registeredAt)}
                  </span>
                </div>

                <EventCard
                  event={reg.eventSnapshot}
                  actionSlot={
                    <div className="my-event-card-actions">
                      <button
                        type="button"
                        className="btn btn-outline btn-sm"
                        onClick={() => handleToggleCompleted(reg.eventId)}
                        title={
                          completed
                            ? 'Move back to Upcoming Events'
                            : 'Mark this event as attended/completed'
                        }
                      >
                        {completed ? 'Move to Upcoming' : 'Mark Completed'}
                      </button>

                      {!completed && (
                        <button
                          type="button"
                          className="btn btn-danger btn-sm"
                          onClick={() => handleCancel(reg.eventId)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  }
                />
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default MyEventsPage;
