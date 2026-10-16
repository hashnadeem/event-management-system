import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilters } from '../features/events/eventsSlice';

const CATEGORY_ICONS = {
  All: '✨',
  Music: '🎵',
  Sports: '🏟️',
  'Arts & Theatre': '🎭',
  Film: '🎬',
  Miscellaneous: '🎪',
};

function CategoryStrip() {
  const dispatch = useDispatch();
  const { categories, filters } = useSelector((state) => state.events);

  const handleSelectCategory = (category) => {
    dispatch(setFilters({ classificationName: category }));
  };

  return (
    <div className="category-strip" role="tablist" aria-label="Event Categories">
      {categories.map((cat) => {
        const isActive = filters.classificationName === cat;
        return (
          <button
            key={cat}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => handleSelectCategory(cat)}
            className={isActive ? 'category-chip active' : 'category-chip'}
          >
            <span className="category-chip-icon">{CATEGORY_ICONS[cat] || '🎟️'}</span>
            <span>{cat}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryStrip;
