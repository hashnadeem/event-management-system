# EventPulse — Event Management System

A responsive frontend **Event Management System** built with **React**, **Redux Toolkit**, **React Router v6**, and the **Ticketmaster Discovery API v2**. Users can discover live events worldwide, filter by category, city, and date, inspect venue details and seatmaps, and manage personal event registrations.

---

## Key Features

1. **User Authentication & Session Persistence (`authSlice`)**
   - Client-side registration and login with inline validation (email format, password rules, duplicate account check).
   - Persistent multi-user accounts (`ems_users`) and active session state (`ems_current_user`) stored in `localStorage` and synchronized with Redux Toolkit.
   - Protected routes (`ProtectedRoute`) that guard personal dashboards and redirect unauthenticated users to `/login`.

2. **Live Event Exploration (`eventsSlice` + Ticketmaster Discovery API v2)**
   - Fetches real-time events from the Ticketmaster Discovery API (`/discovery/v2/events.json`).
   - **Rate-Limit Friendly Search:** 400ms debounced keyword and city inputs to stay within Ticketmaster's `2 requests/sec` rate limit.
   - **Multi-Criteria Filtering:** Filter by classification segment (`Music`, `Sports`, `Arts & Theatre`, `Film`, `Miscellaneous`), city, starting date, and sort order (`Date`, `Name`, `Relevance`).
   - **Windowed Pagination:** Navigate across result pages with live total event counts.

3. **Comprehensive Event Details (`/events/:id`)**
   - Displays full event schedule, classification/genre badges, ticket status, price ranges, venue address, box office/parking notes, featured attraction lineup, Google Maps link, and venue seatmap preview (`seatmap.staticUrl`).

4. **Event Registration & "My Events" Dashboard (`registrationsSlice`)**
   - Logged-in users can register for events with unique confirmation codes (`REG-XXXXXX`).
   - Prevents duplicate registrations for the same user and event.
   - Supports cancelling upcoming registrations and toggling completed/attended status.
   - Separates user registrations into **Upcoming Events** and **Completed Events** tabs.

---

## Project Structure

```text
event-management-system/
├── public/
│   └── index.html
├── src/
│   ├── api/
│   │   └── ticketmasterApi.js         # Ticketmaster Discovery API v2 client & normalizer
│   ├── app/
│   │   └── store.js                   # Redux Toolkit configureStore setup
│   ├── components/
│   │   ├── CategoryStrip.jsx          # Classification segment filter tabs
│   │   ├── EventCard.jsx              # Reusable event card with status & registration action
│   │   ├── Footer.jsx                 # Application footer
│   │   ├── LoadingSkeleton.jsx        # Shimmer loading placeholders for grids & details
│   │   ├── Navbar.jsx                 # Sticky navigation header with session controls
│   │   ├── Pagination.jsx             # Page navigation controls
│   │   ├── ProtectedRoute.jsx         # Auth guard for protected routes
│   │   ├── SearchFilterBar.jsx        # Debounced keyword/city search, date & sort filters
│   │   └── ToastAlert.jsx             # Dismissible toast notification banner
│   ├── features/
│   │   ├── auth/
│   │   │   └── authSlice.js           # User accounts & active session slice
│   │   ├── events/
│   │   │   └── eventsSlice.js         # Async thunks, filters & pagination slice
│   │   └── registrations/
│   │       └── registrationsSlice.js  # Per-user event registrations slice
│   ├── pages/
│   │   ├── EventDetailsPage.jsx       # Single event view with venue, lineup & seatmap
│   │   ├── EventsPage.jsx             # Main event discovery & filtering page
│   │   ├── HomePage.jsx               # Hero search, category cards & featured events
│   │   ├── LoginPage.jsx              # User login view
│   │   ├── MyEventsPage.jsx           # Upcoming vs. Completed registered events dashboard
│   │   ├── NotFoundPage.jsx           # 404 fallback page
│   │   └── RegisterPage.jsx           # User sign-up view
│   ├── styles/
│   │   └── index.css                  # Global stylesheet & responsive breakpoints
│   ├── utils/
│   │   ├── dateUtils.js               # Date comparison & formatting utilities
│   │   └── validators.js              # Form validation helpers
│   ├── App.js                         # Application router configuration
│   └── index.js                       # React root with Redux Provider
├── .env.example                       # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

---

## Getting Started

### 1. Prerequisites
- **Node.js** (v16 or newer) and **npm**
- A free **Ticketmaster Developer Consumer Key** from [developer.ticketmaster.com](https://developer.ticketmaster.com/)

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/hashnadeem/event-management-system.git
cd event-management-system
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (you can copy `.env.example`):

```bash
cp .env.example .env
```

Add your Ticketmaster Consumer Key inside `.env`:

```env
REACT_APP_TICKETMASTER_API_KEY=your_ticketmaster_consumer_key_here
```

> **Note:** `.env` is listed in `.gitignore` so your private API key is never committed to version control.

### 4. Run the Application

Start the development server:

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Build for Production

```bash
npm run build
```
