import { createSlice } from '@reduxjs/toolkit';

const USERS_STORAGE_KEY = 'ems_users';
const SESSION_STORAGE_KEY = 'ems_current_user';

const loadRegisteredUsers = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const loadCurrentUser = () => {
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const initialUser = loadCurrentUser();

const initialState = {
  users: loadRegisteredUsers(),
  currentUser: initialUser,
  isAuthenticated: Boolean(initialUser),
  authError: null,
  authSuccess: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    registerUser(state, action) {
      const { name, email, password } = action.payload;
      const normalizedEmail = email.trim().toLowerCase();

      const exists = state.users.some((u) => u.email.toLowerCase() === normalizedEmail);
      if (exists) {
        state.authError = 'An account with this email address already exists.';
        state.authSuccess = null;
        return;
      }

      const newUser = {
        id: `usr_${Date.now()}`,
        name: name.trim(),
        email: normalizedEmail,
        password,
        createdAt: new Date().toISOString(),
      };

      state.users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(state.users));

      const sessionProfile = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        createdAt: newUser.createdAt,
      };

      state.currentUser = sessionProfile;
      state.isAuthenticated = true;
      state.authError = null;
      state.authSuccess = `Welcome, ${newUser.name}! Your account has been created.`;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionProfile));
    },

    loginUser(state, action) {
      const { email, password } = action.payload;
      const normalizedEmail = email.trim().toLowerCase();

      const matchedUser = state.users.find(
        (u) => u.email.toLowerCase() === normalizedEmail && u.password === password
      );

      if (!matchedUser) {
        state.authError = 'Invalid email or password. Please check your credentials.';
        state.authSuccess = null;
        return;
      }

      const sessionProfile = {
        id: matchedUser.id,
        name: matchedUser.name,
        email: matchedUser.email,
        createdAt: matchedUser.createdAt,
      };

      state.currentUser = sessionProfile;
      state.isAuthenticated = true;
      state.authError = null;
      state.authSuccess = `Welcome back, ${matchedUser.name}!`;
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionProfile));
    },

    logoutUser(state) {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.authError = null;
      state.authSuccess = 'You have been logged out.';
      localStorage.removeItem(SESSION_STORAGE_KEY);
    },

    clearAuthMessages(state) {
      state.authError = null;
      state.authSuccess = null;
    },
  },
});

export const { registerUser, loginUser, logoutUser, clearAuthMessages } = authSlice.actions;
export default authSlice.reducer;
