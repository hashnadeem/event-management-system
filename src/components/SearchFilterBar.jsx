import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters, resetFilters } from '../features/events/eventsSlice';

function SearchFilterBar() {
  const dispatch = useDispatch();
  const { filters } = useSelector((state) => state.events);

  const [keywordInput, setKeywordInput] = useState(filters.keyword);
  const [cityInput, setCityInput] = useState(filters.city);

  // Sync local inputs when filters are reset externally
  useEffect(() => {
    setKeywordInput(filters.keyword);
  }, [filters.keyword]);

  useEffect(() => {
    setCityInput(filters.city);
  }, [filters.city]);

  // Debounce keyword & city inputs by 400ms to stay well within Ticketmaster's 2 req/sec limit
  useEffect(() => {
    const timer = setTimeout(() => {
      if (keywordInput !== filters.keyword || cityInput !== filters.city) {
        dispatch(
          setFilters({
            keyword: keywordInput,
            city: cityInput,
          })
        );
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [keywordInput, cityInput, filters.keyword, filters.city, dispatch]);

  const handleDateChange = (e) => {
    const rawDate = e.target.value;
    const isoDate = rawDate ? `${rawDate}T00:00:00Z` : '';
    dispatch(setFilters({ startDateTime: isoDate }));
  };

  const handleSortChange = (e) => {
    dispatch(setFilters({ sort: e.target.value }));
  };

  const handleReset = () => {
    setKeywordInput('');
    setCityInput('');
    dispatch(resetFilters());
  };

  const dateValue = filters.startDateTime ? filters.startDateTime.slice(0, 10) : '';
  const hasActiveFilters =
    Boolean(filters.keyword) ||
    Boolean(filters.city) ||
    Boolean(filters.startDateTime) ||
    filters.classificationName !== 'All' ||
    filters.sort !== 'date,asc';

  return (
    <div className="filter-panel">
      <div className="filter-grid">
        <div className="filter-field filter-field-search">
          <label htmlFor="search-keyword">Keyword Search</label>
          <input
            id="search-keyword"
            type="text"
            placeholder="Search artists, teams, concerts, or venues..."
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter-city">City</label>
          <input
            id="filter-city"
            type="text"
            placeholder="e.g. New York, London, Los Angeles"
            value={cityInput}
            onChange={(e) => setCityInput(e.target.value)}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter-date">Starting From Date</label>
          <input
            id="filter-date"
            type="date"
            value={dateValue}
            onChange={handleDateChange}
          />
        </div>

        <div className="filter-field">
          <label htmlFor="filter-sort">Sort By</label>
          <select id="filter-sort" value={filters.sort} onChange={handleSortChange}>
            <option value="date,asc">Date: Soonest First</option>
            <option value="date,desc">Date: Latest First</option>
            <option value="name,asc">Name: A – Z</option>
            <option value="relevance,desc">Relevance</option>
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="filter-active-bar">
          <span className="filter-active-label">Active filters applied</span>
          <button type="button" onClick={handleReset} className="btn btn-outline btn-sm">
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}

export default SearchFilterBar;
