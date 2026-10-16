const BASE_URL = 'https://app.ticketmaster.com/discovery/v2';
const API_KEY = process.env.REACT_APP_TICKETMASTER_API_KEY;

// Pick a crisp 16:9 image so event cards and banners stay uniform
function selectBestImage(images = []) {
  if (!Array.isArray(images) || images.length === 0) {
    return 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=900&q=80';
  }

  const wideHD = images.find((img) => img.ratio === '16_9' && img.width >= 640);
  if (wideHD) return wideHD.url;

  const anyWide = images.find((img) => img.ratio === '16_9');
  if (anyWide) return anyWide.url;

  return images[0].url;
}

export function normalizeEvent(raw = {}) {
  const venueRaw = raw._embedded?.venues?.[0] || {};
  const classification = raw.classifications?.[0] || {};
  const start = raw.dates?.start || {};

  const city = venueRaw.city?.name || '';
  const state = venueRaw.state?.stateCode || venueRaw.state?.name || '';
  const country = venueRaw.country?.name || venueRaw.country?.countryCode || '';
  const locationParts = [city, state, country].filter(Boolean);

  const attractions = (raw._embedded?.attractions || []).map((attr) => ({
    id: attr.id,
    name: attr.name,
    url: attr.url || null,
    imageUrl: selectBestImage(attr.images),
  }));

  return {
    id: raw.id,
    name: raw.name || 'Untitled Event',
    url: raw.url || '',
    info: raw.info || '',
    pleaseNote: raw.pleaseNote || '',
    ticketLimit: raw.ticketLimit?.info || '',
    imageUrl: selectBestImage(raw.images),
    localDate: start.localDate || '',
    localTime: start.localTime || '',
    dateTime: start.dateTime || (start.localDate ? `${start.localDate}T00:00:00` : ''),
    timezone: raw.dates?.timezone || '',
    status: raw.dates?.status?.code || 'onsale',
    category: classification.segment?.name || 'Event',
    genre: classification.genre?.name && classification.genre.name !== 'Undefined' ? classification.genre.name : '',
    subGenre:
      classification.subGenre?.name && classification.subGenre.name !== 'Undefined'
        ? classification.subGenre.name
        : '',
    venue: {
      name: venueRaw.name || 'Venue TBA',
      address: venueRaw.address?.line1 || '',
      city,
      state,
      country,
      postalCode: venueRaw.postalCode || '',
      latitude: venueRaw.location?.latitude || null,
      longitude: venueRaw.location?.longitude || null,
      boxOfficeInfo: venueRaw.boxOfficeInfo?.openHoursDetail || '',
      parkingDetail: venueRaw.parkingDetail || '',
      fullLocation: locationParts.length > 0 ? locationParts.join(', ') : 'Location TBA',
    },
    priceRanges: Array.isArray(raw.priceRanges) ? raw.priceRanges : [],
    seatmapUrl: raw.seatmap?.staticUrl || null,
    attractions,
  };
}

export async function fetchEventsFromApi(params = {}) {
  if (!API_KEY) {
    throw new Error('Missing Ticketmaster API key. Please set REACT_APP_TICKETMASTER_API_KEY in your .env file.');
  }

  const query = new URLSearchParams({
    apikey: API_KEY,
    size: String(params.size || 12),
    page: String(params.page || 0),
    sort: params.sort || 'date,asc',
  });

  if (params.keyword && params.keyword.trim()) {
    query.set('keyword', params.keyword.trim());
  }
  if (params.classificationName && params.classificationName !== 'All') {
    query.set('classificationName', params.classificationName);
  }
  if (params.city && params.city.trim()) {
    query.set('city', params.city.trim());
  }
  if (params.startDateTime) {
    query.set('startDateTime', params.startDateTime);
  }

  const response = await fetch(`${BASE_URL}/events.json?${query.toString()}`);

  if (response.status === 429) {
    throw new Error('Ticketmaster rate limit reached. Please wait a moment and try again.');
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch events (HTTP ${response.status}).`);
  }

  const data = await response.json();
  const rawEvents = data._embedded?.events || [];
  const page = data.page || {
    size: params.size || 12,
    totalElements: 0,
    totalPages: 0,
    number: 0,
  };

  // Ticketmaster only supports paging up to 1000 items (size * page < 1000)
  const maxSafePages = Math.min(page.totalPages || 0, Math.floor(996 / (page.size || 12)));

  return {
    events: rawEvents.map(normalizeEvent),
    pageInfo: {
      size: page.size || 12,
      totalElements: page.totalElements || 0,
      totalPages: maxSafePages,
      number: page.number || 0,
    },
  };
}

export async function fetchEventDetailsFromApi(eventId) {
  if (!API_KEY) {
    throw new Error('Missing Ticketmaster API key. Please set REACT_APP_TICKETMASTER_API_KEY in your .env file.');
  }

  const query = new URLSearchParams({ apikey: API_KEY });
  const response = await fetch(`${BASE_URL}/events/${encodeURIComponent(eventId)}.json?${query.toString()}`);

  if (response.status === 429) {
    throw new Error('Ticketmaster rate limit reached. Please wait a moment and try again.');
  }

  if (response.status === 404) {
    throw new Error('The requested event could not be found.');
  }

  if (!response.ok) {
    throw new Error(`Failed to load event details (HTTP ${response.status}).`);
  }

  const data = await response.json();
  return normalizeEvent(data);
}
