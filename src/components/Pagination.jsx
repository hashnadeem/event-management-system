import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPage } from '../features/events/eventsSlice';

function Pagination() {
  const dispatch = useDispatch();
  const { pageInfo, loading } = useSelector((state) => state.events);

  const currentPage = pageInfo.number || 0;
  const totalPages = pageInfo.totalPages || 0;

  if (totalPages <= 1) {
    return null;
  }

  const handlePageSelect = (nextPage) => {
    if (nextPage < 0 || nextPage >= totalPages || nextPage === currentPage || loading) {
      return;
    }
    dispatch(setPage(nextPage));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Build a compact window of page numbers around the active page
  const windowSize = 5;
  const half = Math.floor(windowSize / 2);
  let startPage = Math.max(0, currentPage - half);
  let endPage = Math.min(totalPages - 1, startPage + windowSize - 1);

  if (endPage - startPage + 1 < windowSize) {
    startPage = Math.max(0, endPage - windowSize + 1);
  }

  const pages = [];
  for (let i = startPage; i <= endPage; i += 1) {
    pages.push(i);
  }

  return (
    <nav className="pagination-bar" aria-label="Events pagination">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage === 0 || loading}
        onClick={() => handlePageSelect(currentPage - 1)}
      >
        ← Previous
      </button>

      <div className="pagination-pages">
        {startPage > 0 && (
          <>
            <button
              type="button"
              className="page-btn"
              onClick={() => handlePageSelect(0)}
              disabled={loading}
            >
              1
            </button>
            {startPage > 1 && <span className="page-ellipsis">…</span>}
          </>
        )}

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            className={p === currentPage ? 'page-btn active' : 'page-btn'}
            onClick={() => handlePageSelect(p)}
            disabled={loading}
          >
            {p + 1}
          </button>
        ))}

        {endPage < totalPages - 1 && (
          <>
            {endPage < totalPages - 2 && <span className="page-ellipsis">…</span>}
            <button
              type="button"
              className="page-btn"
              onClick={() => handlePageSelect(totalPages - 1)}
              disabled={loading}
            >
              {totalPages}
            </button>
          </>
        )}
      </div>

      <button
        type="button"
        className="btn btn-outline btn-sm"
        disabled={currentPage >= totalPages - 1 || loading}
        onClick={() => handlePageSelect(currentPage + 1)}
      >
        Next →
      </button>
    </nav>
  );
}

export default Pagination;
