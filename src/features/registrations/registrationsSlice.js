import { createSlice } from '@reduxjs/toolkit';

const REGISTRATIONS_STORAGE_KEY = 'ems_registrations';

const loadRegistrationsMap = () => {
  try {
    const raw = localStorage.getItem(REGISTRATIONS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
};

const saveRegistrationsMap = (byUser) => {
  try {
    localStorage.setItem(REGISTRATIONS_STORAGE_KEY, JSON.stringify(byUser));
  } catch {
    // Ignore storage quota errors
  }
};

const initialState = {
  byUser: loadRegistrationsMap(),
  feedback: null,
};

const registrationsSlice = createSlice({
  name: 'registrations',
  initialState,
  reducers: {
    registerForEvent(state, action) {
      const { userKey, event } = action.payload;

      if (!userKey || !event?.id) {
        state.feedback = {
          type: 'error',
          text: 'Please log in to register for events.',
        };
        return;
      }

      const userList = state.byUser[userKey] || [];
      const alreadyRegistered = userList.some((reg) => reg.eventId === event.id);

      if (alreadyRegistered) {
        state.feedback = {
          type: 'warning',
          text: `You are already registered for "${event.name}".`,
        };
        return;
      }

      const confirmationCode = `REG-${Math.floor(100000 + Math.random() * 900000)}`;
      const registrationRecord = {
        registrationId: confirmationCode,
        userKey,
        eventId: event.id,
        registeredAt: new Date().toISOString(),
        markedCompleted: false,
        eventSnapshot: {
          id: event.id,
          name: event.name,
          imageUrl: event.imageUrl,
          localDate: event.localDate,
          localTime: event.localTime,
          dateTime: event.dateTime,
          category: event.category,
          genre: event.genre,
          status: event.status,
          url: event.url,
          venue: {
            name: event.venue?.name || 'Venue TBA',
            fullLocation: event.venue?.fullLocation || 'Location TBA',
          },
        },
      };

      state.byUser[userKey] = [registrationRecord, ...userList];
      saveRegistrationsMap(state.byUser);

      state.feedback = {
        type: 'success',
        text: `Successfully registered for "${event.name}" (${confirmationCode}).`,
      };
    },

    cancelRegistration(state, action) {
      const { userKey, eventId } = action.payload;
      if (!userKey || !eventId) return;

      const userList = state.byUser[userKey] || [];
      const target = userList.find((reg) => reg.eventId === eventId);

      state.byUser[userKey] = userList.filter((reg) => reg.eventId !== eventId);
      saveRegistrationsMap(state.byUser);

      state.feedback = {
        type: 'info',
        text: target
          ? `Registration cancelled for "${target.eventSnapshot?.name}".`
          : 'Registration cancelled.',
      };
    },

    toggleCompletedStatus(state, action) {
      const { userKey, eventId } = action.payload;
      if (!userKey || !eventId) return;

      const userList = state.byUser[userKey] || [];
      const item = userList.find((reg) => reg.eventId === eventId);
      if (!item) return;

      item.markedCompleted = !item.markedCompleted;
      saveRegistrationsMap(state.byUser);

      state.feedback = {
        type: 'success',
        text: item.markedCompleted
          ? `Marked "${item.eventSnapshot?.name}" as attended/completed.`
          : `Moved "${item.eventSnapshot?.name}" back to upcoming events.`,
      };
    },

    clearRegistrationFeedback(state) {
      state.feedback = null;
    },
  },
});

export const {
  registerForEvent,
  cancelRegistration,
  toggleCompletedStatus,
  clearRegistrationFeedback,
} = registrationsSlice.actions;

export default registrationsSlice.reducer;
