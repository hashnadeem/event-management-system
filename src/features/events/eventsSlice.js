import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchEventsFromApi, fetchEventDetailsFromApi } from '../../api/ticketmasterApi';

export const EVENT_CATEGORIES = [
  'All',
  'Music',
  'Sports',
  'Arts & Theatre',
  'Film',
  'Miscellaneous',
];

const defaultFilters = {
  keyword: '',
  classificationName: 'All',
  city: '',
  startDateTime: '',
  sort: 'date,asc',
  page: 0,
  size: 12,
};

export const fetchEvents = createAsyncThunk(
  'events/fetchEvents',
  async (overrideParams, { getState, rejectWithValue }) => {
    try {
      const currentFilters = getState().events.filters;
      const mergedParams = { ...currentFilters, ...(overrideParams || {}) };
      return await fetchEventsFromApi(mergedParams);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to fetch events.');
    }
  }
);

export const fetchEventById = createAsyncThunk(
  'events/fetchEventById',
  async (eventId, { rejectWithValue }) => {
    try {
      return await fetchEventDetailsFromApi(eventId);
    } catch (error) {
      return rejectWithValue(error.message || 'Unable to load event details.');
    }
  }
);

const initialState = {
  items: [],
  selectedEvent: null,
  categories: EVENT_CATEGORIES,
  filters: { ...defaultFilters },
  pageInfo: {
    size: 12,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  },
  loading: false,
  detailLoading: false,
  error: null,
  detailError: null,
};

const eventsSlice = createSlice({
  name: 'events',
  initialState,
  reducers: {
    setFilters(state, action) {
      const nextFilters = { ...state.filters, ...action.payload };
      // Reset to first page whenever search/filter criteria change unless page was explicitly passed
      if (!Object.prototype.hasOwnProperty.call(action.payload, 'page')) {
        nextFilters.page = 0;
      }
      state.filters = nextFilters;
    },
    setPage(state, action) {
      state.filters.page = Math.max(0, Number(action.payload) || 0);
    },
    resetFilters(state) {
      state.filters = { ...defaultFilters };
    },
    clearSelectedEvent(state) {
      state.selectedEvent = null;
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEvents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEvents.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.events;
        state.pageInfo = action.payload.pageInfo;
      })
      .addCase(fetchEvents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to load events.';
      })
      .addCase(fetchEventById.pending, (state) => {
        state.detailLoading = true;
        state.detailError = null;
      })
      .addCase(fetchEventById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedEvent = action.payload;
      })
      .addCase(fetchEventById.rejected, (state, action) => {
        state.detailLoading = false;
        state.detailError = action.payload || 'Failed to load event details.';
      });
  },
});

export const { setFilters, setPage, resetFilters, clearSelectedEvent } = eventsSlice.actions;
export default eventsSlice.reducer;
