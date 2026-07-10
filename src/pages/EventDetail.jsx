import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { RsvpContext } from '../context/RsvpContext';
import mockSpeakers from '../data/speakers.json';
import mockClubs from '../data/clubs.json';
import { Calendar, Clock, MapPin, Users, ArrowLeft, Ticket, CheckCircle2, ChevronRight } from 'lucide-react';

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events, userRsvps, submitRsvp } = useContext(RsvpContext);

  const event = events.find((e) => e.id === id);

  if (!event) {
    return (
      <PageShell>
        <div className="border-3 border-black bg-white p-12 text-center neo-shadow max-w-lg mx-auto">
          <h3 className="font-display font-black text-xl uppercase mb-2">Event Not Found</h3>
          <p className="text-sm font-semibold text-black/60 mb-6">
            The event you are looking for does not exist or has been deleted.
          </p>
          <Link to="/discover">
            <Button variant="primary">Back to Discover</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  // Load speakers and club details
  const speakers = mockSpeakers.filter((spk) => event.speakerIds.includes(spk.id));
  const club = mockClubs.find((c) => c.id === event.organizerId);

  // Seat metrics
  const occupiedSeats = event.seatsTotal - event.seatsAvailable;
  const occupiedPercentage = Math.round((occupiedSeats / event.seatsTotal) * 100);

  // User RSVP status
  const userRsvp = userRsvps[event.id];

  const handleRsvpAction = () => {
    if (userRsvp) {
      navigate(`/rsvp-confirmation/${event.id}`);
    } else {
      submitRsvp(event.id);
      navigate(`/rsvp-confirmation/${event.id}`);
    }
  };

  return (
    <PageShell>
      {/* Back Button */}
      <div className="mb-6 flex">
        <Link
          to="/discover"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider hover:text-accent-yellow transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Events
        </Link>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Columns: Main details */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Header Card */}
          <Card variant="white" shadowSize="medium" className="p-6 md:p-8 flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-1/3 aspect-video md:aspect-square neo-border overflow-hidden">
              <img
                src={event.coverImage}
                alt={event.title}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="grow space-y-4">
              <div className="flex flex-wrap gap-2">
                <Badge variant="accent">{event.category}</Badge>
                <Badge variant="white">{event.faculty}</Badge>
              </div>
              
              <h1 className="font-display font-black text-2xl md:text-4xl uppercase leading-tight tracking-tight">
                {event.title}
              </h1>

              <div className="space-y-2 text-sm font-semibold text-black/70">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-black" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-black" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin size={16} className="text-black" />
                  <span>Science Building Block B / Room {event.venueId === 'science-hall-a' ? 'A' : '202'}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Description */}
          <Card variant="white" shadowSize="medium" className="p-6 md:p-8 space-y-4">
            <h2 className="font-display font-black text-xl uppercase border-b-2 border-black pb-2">
              About The Event
            </h2>
            <p className="text-sm font-semibold leading-relaxed text-black/80">
              {event.description}
            </p>
          </Card>

          {/* Schedule / Timeline */}
          <Card variant="white" shadowSize="medium" className="p-6 md:p-8 space-y-6">
            <h2 className="font-display font-black text-xl uppercase border-b-2 border-black pb-2">
              Schedule Timeline
            </h2>
            
            <div className="relative border-l-3 border-black pl-6 ml-3 space-y-8">
              {event.schedule.map((item, idx) => (
                <div key={idx} className="relative">
                  {/* Bullet Node */}
                  <span className="absolute -left-9 top-1 w-5 h-5 bg-accent-yellow border-3 border-black rounded-none" />
                  
                  <div>
                    <span className="font-display font-black text-xs uppercase bg-black text-white px-2 py-0.5 inline-block mb-1 shadow-[1px_1px_0px_0px_#000]">
                      {item.time}
                    </span>
                    <h3 className="font-display font-black text-base uppercase mb-1">
                      {item.title}
                    </h3>
                    <p className="text-xs font-semibold text-black/60">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Seat Status, Organizers & Action */}
        <div className="space-y-8">
          
          {/* Seat Availability & Action Card */}
          <Card variant="yellow" shadowSize="medium" className="p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="font-display font-black text-lg uppercase">
                Seat Availability
              </h3>
              
              {/* Seat metrics */}
              <div className="flex justify-between items-end font-display font-black">
                <span className="text-3xl">{occupiedSeats}</span>
                <span className="text-sm text-black/60">of {event.seatsTotal} booked</span>
              </div>
            </div>

            {/* Animated Seat Progress Bar */}
            <div className="w-full h-6 bg-white border-3 border-black relative rounded-none overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${occupiedPercentage}%` }}
                transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                className="h-full bg-accent-yellow border-r-3 border-black"
              />
              <span className="absolute inset-0 flex items-center justify-center font-display font-black text-xxs tracking-wider uppercase text-black/80 select-none">
                {occupiedPercentage}% Occupied
              </span>
            </div>

            {/* In-Memory Capacity Stat badges */}
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-black/70 pt-2 border-t border-black/10">
              <span>{event.seatsAvailable} Seats Left</span>
              <span>{event.waitlistCount} Waitlisted</span>
            </div>

            {/* RSVP Button */}
            {userRsvp ? (
              <Button
                onClick={handleRsvpAction}
                variant="secondary"
                className="w-full text-center"
              >
                <CheckCircle2 size={16} />
                View Ticket Confirmation
              </Button>
            ) : event.seatsAvailable > 0 ? (
              <Button
                onClick={handleRsvpAction}
                variant="primary"
                className="w-full text-center"
              >
                <Ticket size={16} />
                Claim My Seat Ticket
              </Button>
            ) : (
              <Button
                onClick={handleRsvpAction}
                variant="accent"
                className="w-full text-center"
              >
                <Users size={16} />
                Join Waitlist
              </Button>
            )}
          </Card>

          {/* Organizer Club Info Card */}
          {club && (
            <Card variant="white" shadowSize="medium" className="p-6 space-y-4">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-black/50 border-b border-black/10 pb-2">
                Hosted By
              </h3>
              
              <Link to={`/club/${club.id}`} className="flex items-center gap-4 group">
                <div className={`w-12 h-12 rounded-none border-2 border-black flex items-center justify-center font-display font-black text-lg bg-gradient-to-br ${club.bgGrad} neo-shadow-sm`}>
                  {club.logo}
                </div>
                <div className="grow">
                  <h4 className="font-display font-black text-base uppercase leading-tight group-hover:text-accent-yellow transition-colors flex items-center">
                    {club.name}
                    <ChevronRight size={16} className="inline ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </h4>
                  <span className="text-xs font-bold text-black/60 uppercase">View Club Profile</span>
                </div>
              </Link>
            </Card>
          )}

          {/* Speakers List Card */}
          {speakers.length > 0 && (
            <Card variant="white" shadowSize="medium" className="p-6 space-y-4">
              <h3 className="font-display font-black text-sm uppercase tracking-wider text-black/50 border-b border-black/10 pb-2">
                Featured Speakers
              </h3>
              
              <div className="space-y-4">
                {speakers.map((spk) => (
                  <div key={spk.id} className="flex items-center gap-4 border-b border-black/5 pb-2 last:border-0 last:pb-0">
                    <div
                      className="w-10 h-10 border-2 border-black flex items-center justify-center font-display font-black text-xs"
                      style={{ backgroundColor: spk.avatarColor }}
                    >
                      {spk.avatarText}
                    </div>
                    <div>
                      <h4 className="font-display font-black text-sm uppercase leading-tight">
                        {spk.name}
                      </h4>
                      <span className="text-xs font-semibold text-black/60">
                        {spk.role} • {spk.company}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default EventDetail;
