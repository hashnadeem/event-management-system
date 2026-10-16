import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import EventsPage from './pages/EventsPage';
import NotFoundPage from './pages/NotFoundPage';

function PlaceholderView({ title, subtitle }) {
  return (
    <section className="page-section">
      <div className="section-header">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}

function App() {
  return (
    <Router>
      <div className="app-shell">
        <Navbar />
        <main className="main-container">
          <Routes>
            <Route
              path="/"
              element={
                <PlaceholderView
                  title="Discover Live Events Around You"
                  subtitle="Search concerts, sports, theatre, and festivals."
                />
              }
            />
            <Route path="/events" element={<EventsPage />} />
            <Route
              path="/my-events"
              element={
                <ProtectedRoute>
                  <PlaceholderView
                    title="My Registered Events"
                    subtitle="Manage your upcoming and completed event registrations."
                  />
                </ProtectedRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
