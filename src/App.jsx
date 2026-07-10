import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';

// Providers
import { RsvpProvider } from './context/RsvpContext';
import { NavModeProvider } from './context/NavModeContext';
import { RoleProvider } from './context/RoleContext';

// Layout
import NavBar from './components/layout/NavBar';
import Footer from './components/layout/Footer';

// Pages
import Home from './pages/Home';
import EventDiscovery from './pages/EventDiscovery';
import EventDetail from './pages/EventDetail';
import RsvpConfirmation from './pages/RsvpConfirmation';
import Navigate from './pages/Navigate';
import ClubDirectory from './pages/ClubDirectory';
import ClubProfile from './pages/ClubProfile';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminEventForm from './pages/admin/AdminEventForm';
import AdminVenueUpload from './pages/admin/AdminVenueUpload';

function App() {
  return (
    <RoleProvider>
      <RsvpProvider>
        <NavModeProvider>
          <Router>
            <div className="flex flex-col min-h-screen bg-bg-neobrutalist selection:bg-accent-yellow selection:text-black">
              {/* Header Navigation */}
              <NavBar />

              {/* Main Content Area */}
              <main className="grow">
                <Routes>
                  {/* Student Flow */}
                  <Route path="/" element={<Home />} />
                  <Route path="/discover" element={<EventDiscovery />} />
                  <Route path="/event/:id" element={<EventDetail />} />
                  <Route path="/rsvp-confirmation/:id" element={<RsvpConfirmation />} />
                  <Route path="/navigate" element={<Navigate />} />
                  <Route path="/clubs" element={<ClubDirectory />} />
                  <Route path="/club/:id" element={<ClubProfile />} />

                  {/* Admin Flow */}
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/event-form" element={<AdminEventForm />} />
                  <Route path="/admin/venue-upload" element={<AdminVenueUpload />} />
                </Routes>
              </main>

              {/* Footer Banner & newsletter */}
              <Footer />
            </div>
          </Router>
        </NavModeProvider>
      </RsvpProvider>
    </RoleProvider>
  );
}

export default App;
