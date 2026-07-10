import React, { useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { RsvpContext } from '../context/RsvpContext';
import { NavModeContext } from '../context/NavModeContext';
import { CheckCircle2, AlertTriangle, MapPin, Calendar, Clock, ArrowLeft, Send } from 'lucide-react';

const RsvpConfirmation = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, userRsvps } = useContext(RsvpContext);
  const { startNavigation } = useContext(NavModeContext);

  const event = events.find((e) => e.id === id);
  const userRsvp = userRsvps[id];

  if (!event || !userRsvp) {
    return (
      <PageShell>
        <div className="border-3 border-black bg-white p-12 text-center neo-shadow max-w-lg mx-auto">
          <h3 className="font-display font-black text-xl uppercase mb-2">No RSVP Found</h3>
          <p className="text-sm font-semibold text-black/60 mb-6">
            You haven't RSVP'd to this event yet.
          </p>
          <Link to={`/event/${id}`}>
            <Button variant="primary">Go to Event Page</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  const isWaitlisted = userRsvp.rsvpStatus === 'Waitlisted';

  const handleLaunchNavigation = () => {
    startNavigation(event.id);
    navigate('/navigate');
  };

  return (
    <PageShell>
      {/* Back to details */}
      <div className="mb-6 flex">
        <Link
          to={`/event/${event.id}`}
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider hover:text-accent-yellow transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Event Details
        </Link>
      </div>

      <div className="max-w-2xl mx-auto space-y-8 select-none">
        
        {/* Banner Status */}
        {isWaitlisted ? (
          <div className="bg-pastel-peach border-3 border-black p-6 flex items-start gap-4 neo-shadow-sm">
            <div className="bg-white p-2 border-2 border-black">
              <AlertTriangle className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg uppercase mb-1">
                Waitlist Position Active
              </h2>
              <p className="text-xs font-semibold text-black/70 leading-relaxed">
                The event has reached maximum capacity. You are in position <strong className="text-black font-black">#{event.waitlistCount}</strong> on the waitlist. We will notify you immediately if a seat opens up.
              </p>
            </div>
          </div>
        ) : (
          <div className="bg-pastel-mint border-3 border-black p-6 flex items-start gap-4 neo-shadow-sm">
            <div className="bg-white p-2 border-2 border-black">
              <CheckCircle2 className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="font-display font-black text-lg uppercase mb-1">
                Seat RSVP Confirmed!
              </h2>
              <p className="text-xs font-semibold text-black/70 leading-relaxed">
                Your ticket has been generated and your seat is reserved. See ticket details below and prepare to navigate.
              </p>
            </div>
          </div>
        )}

        {/* Ticket Visualization */}
        <Card variant={isWaitlisted ? "white" : "yellow"} shadowSize="large" className="relative">
          {/* Decorative side cuts for ticket look */}
          <div className="absolute top-1/2 -left-4 w-8 h-8 bg-bg-neobrutalist border-3 border-black rounded-full z-10 translate-y-[-50%]" />
          <div className="absolute top-1/2 -right-4 w-8 h-8 bg-bg-neobrutalist border-3 border-black rounded-full z-10 translate-y-[-50%]" />
          
          <div className="p-8 space-y-8">
            {/* Ticket Top: Logo & Ticket ID */}
            <div className="flex justify-between items-center border-b-2 border-dashed border-black/20 pb-4">
              <span className="font-display font-black text-sm uppercase tracking-wider">
                CampusPulse Ticket
              </span>
              <Badge variant="dark" className="font-mono">
                {isWaitlisted ? "WAITLIST-ONLY" : userRsvp.ticketNumber}
              </Badge>
            </div>

            {/* Ticket Body: Title & Info */}
            <div className="space-y-6">
              <h1 className="font-display font-black text-2xl md:text-3xl uppercase tracking-tight leading-none text-center py-4">
                {event.title}
              </h1>

              <div className="grid grid-cols-2 gap-4 border-t border-b border-black/10 py-4 font-display font-bold text-xs uppercase tracking-wider">
                <div className="space-y-1">
                  <span className="text-black/40 font-black">Date</span>
                  <div className="flex items-center gap-1">
                    <Calendar size={14} />
                    <span>{event.date}</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-black/10 pl-4">
                  <span className="text-black/40 font-black">Time</span>
                  <div className="flex items-center gap-1">
                    <Clock size={14} />
                    <span>{event.time}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 font-display font-bold text-xs uppercase tracking-wider">
                <div className="space-y-1">
                  <span className="text-black/40 font-black">Venue</span>
                  <div className="flex items-center gap-1">
                    <MapPin size={14} />
                    <span>Room {event.venueId === 'science-hall-a' ? 'A' : '202'}</span>
                  </div>
                </div>
                <div className="space-y-1 border-l border-black/10 pl-4">
                  <span className="text-black/40 font-black">Seat Number</span>
                  <div className="text-lg font-black text-black">
                    {isWaitlisted ? "N/A" : `SEAT-${userRsvp.seatNumber}`}
                  </div>
                </div>
              </div>
            </div>

            {/* Ticket Bottom: Barcode representation */}
            <div className="border-t-2 border-dashed border-black/20 pt-6 flex flex-col items-center gap-3">
              {/* Mock Barcode */}
              <div className="h-10 bg-black w-full flex items-center justify-around overflow-hidden p-1">
                {[...Array(30)].map((_, idx) => (
                  <div
                    key={idx}
                    className="h-full bg-white"
                    style={{ width: `${(idx % 3 === 0 ? 4 : idx % 2 === 0 ? 2 : 1)}px` }}
                  />
                ))}
              </div>
              <span className="text-xxs font-mono font-bold tracking-widest text-black/50">
                *{event.id.toUpperCase()}*{userRsvp.timestamp.substring(11,19)}*
              </span>
            </div>
          </div>
        </Card>

        {/* What's Next Checklist (repurposed from Eventin plan checklist) */}
        <Card variant="white" shadowSize="medium" className="p-6">
          <h3 className="font-display font-black text-sm uppercase tracking-wider mb-4 border-b border-black/10 pb-2">
            What's Next Checklist
          </h3>
          
          <ul className="space-y-3 font-display font-bold text-xs uppercase tracking-wider text-black/75">
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-black bg-pastel-mint flex items-center justify-center font-black">✓</span>
              <span>Claimed seat and reserved ticket slot.</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-black bg-pastel-mint flex items-center justify-center font-black">✓</span>
              <span>Wait for event date ({event.date}).</span>
            </li>
            <li className="flex items-center gap-3">
              <span className={`w-5 h-5 border-2 border-black flex items-center justify-center font-black ${isWaitlisted ? 'bg-transparent text-transparent' : 'bg-pastel-yellow'}`}>
                {isWaitlisted ? '' : '•'}
              </span>
              <span>{isWaitlisted ? 'Wait for email verification of open seat.' : 'Launch navigation to science building block b.'}</span>
            </li>
            <li className="flex items-center gap-3">
              <span className="w-5 h-5 border-2 border-black flex items-center justify-center" />
              <span>Enter room {event.venueId === 'science-hall-a' ? 'A' : '202'} and show ticket barcode.</span>
            </li>
          </ul>
        </Card>

        {/* Action Button */}
        {!isWaitlisted && (
          <Button
            onClick={handleLaunchNavigation}
            variant="primary"
            className="w-full text-center py-4 text-base"
          >
            <MapPin size={18} />
            Launch Outdoor Navigator
          </Button>
        )}
      </div>
    </PageShell>
  );
};

export default RsvpConfirmation;
