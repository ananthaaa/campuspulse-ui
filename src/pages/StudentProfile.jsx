import React, { useContext, useState } from 'react';
import { motion } from 'framer-motion';
import { RoleContext } from '../context/RoleContext';
import { RsvpContext } from '../context/RsvpContext';
import PageShell from '../components/layout/PageShell';
import usersData from '../data/users.json';
import RSVPTicket from '../components/ui/RSVPTicket';
import { User, LogIn } from 'lucide-react';

const StudentProfile = () => {
  const { currentRole, toggleRole } = useContext(RoleContext);
  const { userRsvps, events } = useContext(RsvpContext);
  
  // Fake login state
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const studentUser = usersData.find(u => u.id === 'student-1');

  if (!isLoggedIn) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto mt-20">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-bg-surface p-8 rounded-2xl border border-border-subtle text-center"
          >
            <div className="w-16 h-16 bg-bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-display font-bold text-text-primary mb-2">Student Login</h1>
            <p className="text-text-secondary mb-8">Sign in to view your RSVPs and tickets.</p>
            
            <div className="space-y-4">
              <input 
                type="text" 
                placeholder="Student ID or Email" 
                className="w-full bg-bg-primary border border-border-subtle rounded-full px-6 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                defaultValue="alex.rivera@campus.edu"
              />
              <input 
                type="password" 
                placeholder="Password" 
                className="w-full bg-bg-primary border border-border-subtle rounded-full px-6 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                defaultValue="password123"
              />
              <button 
                onClick={() => setIsLoggedIn(true)}
                className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-medium rounded-full px-6 py-3 flex items-center justify-center gap-2 transition-colors mt-4"
              >
                <span>Sign In</span>
                <LogIn className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        </div>
      </PageShell>
    );
  }

  // Find actual event details for user's RSVPs
  const myTickets = Object.entries(userRsvps).map(([eventId, rsvpInfo]) => {
    const event = events.find(e => e.id === eventId);
    return { event, ...rsvpInfo };
  });

  return (
    <PageShell>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-6 mb-12 bg-bg-surface p-8 rounded-3xl border border-border-subtle">
          <img 
            src={studentUser.avatar} 
            alt={studentUser.name} 
            className="w-24 h-24 rounded-full border-2 border-accent"
          />
          <div className="text-center md:text-left flex-grow">
            <h1 className="text-3xl md:text-4xl font-display font-bold text-text-primary">{studentUser.name}</h1>
            <p className="text-text-secondary">Computer Science, Class of 2026</p>
          </div>
          <div className="bg-bg-primary p-4 rounded-xl border border-border-subtle flex flex-col items-center">
            <span className="text-text-tertiary text-xs uppercase tracking-wider mb-2">Developer Mode</span>
            <button 
              onClick={toggleRole}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${currentRole === 'admin' ? 'bg-accent text-accent-contrast' : 'bg-bg-surface border border-border-subtle text-text-primary'}`}
            >
              {currentRole === 'admin' ? 'Admin Active' : 'Switch to Admin'}
            </button>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-display font-bold text-text-primary">My Tickets & RSVPs</h2>
            <span className="bg-bg-surface border border-border-subtle text-text-secondary px-3 py-1 rounded-full text-sm">
              {myTickets.length}
            </span>
          </div>

          {myTickets.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {myTickets.map((ticket, index) => (
                <RSVPTicket 
                  key={index} 
                  event={ticket.event} 
                  rsvpStatus={ticket.rsvpStatus} 
                  ticketNumber={ticket.ticketNumber} 
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-bg-surface rounded-2xl border border-border-subtle border-dashed">
              <p className="text-text-secondary">You haven't RSVP'd to any events yet.</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default StudentProfile;
