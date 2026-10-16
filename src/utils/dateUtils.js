export function isEventInPast(eventSnapshot = {}) {
  const rawDate = eventSnapshot.dateTime || eventSnapshot.localDate;
  if (!rawDate) return false;

  const eventTime = new Date(rawDate).getTime();
  if (Number.isNaN(eventTime)) return false;

  return eventTime < Date.now();
}

export function isRegistrationCompleted(registration) {
  if (!registration) return false;
  if (registration.markedCompleted) return true;
  return isEventInPast(registration.eventSnapshot);
}

export function formatShortTimestamp(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return '';

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}
