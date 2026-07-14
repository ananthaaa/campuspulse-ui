import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import { RsvpContext } from '../context/RsvpContext';
import { NotificationContext } from '../context/NotificationContext';
import mockSpeakers from '../data/speakers.json';
import mockClubs from '../data/clubs.json';
import SeatMeter from '../components/ui/SeatMeter';
import { Calendar, Clock, MapPin, ArrowLeft, Ticket, CheckCircle2, ChevronRight, Users } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, userRsvps, submitRsvp } = useContext(RsvpContext);
  const { addNotification } = useContext(NotificationContext);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto text-center mt-20">
          <h3 className="font-display font-bold text-3xl text-text-primary mb-4">Event Not Found</h3>
          <p className="text-text-secondary mb-8">
            The event you are looking for does not exist or has been deleted.
          </p>
          <Link to="/discover" className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle px-6 py-3 rounded-full text-text-primary hover:text-accent transition-colors">
            <ArrowLeft size={16} />
            Back to Discover
          </Link>
        </div>
      </PageShell>
    );
  }

  const speakers = mockSpeakers.filter((spk) => event.speakerIds.includes(spk.id));
  const club = mockClubs.find((c) => c.id === event.organizerId);
  const userRsvp = userRsvps[event.id];

  const handleRsvpAction = () => {
    if (userRsvp) {
      navigate(`/student/rsvp-confirmation/${event.id}`);
    } else {
      const res = submitRsvp(event.id);
      if (res.rsvpStatus === "RSVP'd") {
        addNotification("Successfully registered for event!", "success");
      } else {
        addNotification("Added to waitlist.", "info");
      }
      navigate(`/student/rsvp-confirmation/${event.id}`);
    }
  };

  return (
    <PageShell>
      <div className="mb-6">
        <Link
          to="/student/events"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Events
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Main details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl overflow-hidden relative"
          >
            <div className="aspect-[21/9] w-full">
              <img src={event.coverImage} alt={event.title} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent"></div>
            
            <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full">
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs uppercase tracking-wider font-medium">{event.category}</span>
                <span className="px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-xs uppercase tracking-wider font-medium">{event.faculty}</span>
              </div>
              <h1 className="font-display font-bold text-4xl md:text-5xl lg:text-6xl text-white tracking-tight leading-tight mb-6">
                {event.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-sm text-white/80">
                <div className="flex items-center gap-2"><Calendar size={18} /><span>{event.date}</span></div>
                <div className="flex items-center gap-2"><Clock size={18} /><span>{event.time}</span></div>
                <div className="flex items-center gap-2"><MapPin size={18} /><span>Room {event.venueId === 'science-hall-a' ? 'A' : '202'}</span></div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-text-primary">About The Event</h2>
              <p className="text-text-secondary leading-relaxed text-lg">
                {event.description}
              </p>
            </div>
            
            <div className="space-y-6">
              <h2 className="font-display font-bold text-2xl text-text-primary">Schedule Timeline</h2>
              <div className="space-y-6 border-l border-border-subtle ml-3 pl-6 relative">
                {event.schedule.map((item, idx) => (
                  <div key={idx} className="relative">
                    <span className="absolute -left-[30px] top-1 w-3 h-3 bg-accent rounded-full ring-4 ring-bg-primary" />
                    <span className="text-accent text-xs font-bold tracking-widest uppercase block mb-1">{item.time}</span>
                    <h3 className="font-display font-bold text-lg text-text-primary mb-1">{item.title}</h3>
                    <p className="text-text-secondary text-sm">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: RSVP & Organizers */}
        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-bg-surface border border-border-subtle rounded-3xl p-8 space-y-8"
          >
            <SeatMeter total={event.seatsTotal} available={event.seatsAvailable} />
            
            <button
              onClick={handleRsvpAction}
              className={`w-full flex items-center justify-center gap-2 py-4 rounded-full font-medium transition-colors ${userRsvp ? 'bg-bg-surface-alt border border-success text-success hover:bg-success/10' : event.seatsAvailable > 0 ? 'bg-accent hover:bg-accent-hover text-accent-contrast' : 'bg-bg-surface-alt border border-border-subtle text-text-primary hover:bg-bg-primary'}`}
            >
              {userRsvp ? (
                <><CheckCircle2 size={18} /> View Ticket Confirmation</>
              ) : event.seatsAvailable > 0 ? (
                <><Ticket size={18} /> RSVP & Get Ticket</>
              ) : (
                <><Users size={18} /> Join Waitlist</>
              )}
            </button>
          </motion.div>

          {club && (
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6">
              <h3 className="text-text-tertiary text-xs font-bold uppercase tracking-widest mb-4">Hosted By</h3>
              <Link to={`/club/${club.id}`} className="flex items-center gap-4 group">
                <div className={`w-14 h-14 rounded-full bg-gradient-to-br ${club.bgGrad} flex items-center justify-center font-display font-bold text-xl text-bg-primary`}>
                  {club.logo}
                </div>
                <div>
                  <h4 className="font-display font-bold text-lg text-text-primary group-hover:text-accent transition-colors flex items-center gap-1">
                    {club.name} <ChevronRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity transform -translate-x-2 group-hover:translate-x-0" />
                  </h4>
                  <p className="text-text-secondary text-sm">View Organizer Profile</p>
                </div>
              </Link>
            </div>
          )}

          {speakers.length > 0 && (
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6">
              <h3 className="text-text-tertiary text-xs font-bold uppercase tracking-widest mb-4">Featured Speakers</h3>
              <div className="space-y-4">
                {speakers.map((spk) => (
                  <div key={spk.id} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center font-display font-bold text-white" style={{ backgroundColor: spk.avatarColor }}>
                      {spk.avatarText}
                    </div>
                    <div>
                      <h4 className="font-display font-bold text-text-primary">{spk.name}</h4>
                      <p className="text-text-secondary text-sm">{spk.role}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default EventDetail;
