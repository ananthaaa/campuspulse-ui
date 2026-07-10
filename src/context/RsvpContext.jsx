import React, { createContext, useState, useEffect } from 'react';
import initialEvents from '../data/events.json';

export const RsvpContext = createContext();

export const RsvpProvider = ({ children }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('cp_events');
    return saved ? JSON.parse(saved) : initialEvents;
  });

  const [userRsvps, setUserRsvps] = useState(() => {
    const saved = localStorage.getItem('cp_user_rsvps');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('cp_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('cp_user_rsvps', JSON.stringify(userRsvps));
  }, [userRsvps]);

  const submitRsvp = (eventId) => {
    if (userRsvps[eventId]) return userRsvps[eventId];

    let status = null;
    let ticketNumber = null;

    setEvents((prevEvents) =>
      prevEvents.map((evt) => {
        if (evt.id === eventId) {
          if (evt.seatsAvailable > 0) {
            status = "RSVP'd";
            const seatNum = evt.seatsTotal - evt.seatsAvailable + 1;
            ticketNumber = `CP-${evt.id.substring(0, 4).toUpperCase()}-${String(seatNum).padStart(3, '0')}`;
            return {
              ...evt,
              seatsAvailable: evt.seatsAvailable - 1,
              rsvpCount: evt.rsvpCount + 1,
            };
          } else {
            status = 'Waitlisted';
            return {
              ...evt,
              waitlistCount: evt.waitlistCount + 1,
            };
          }
        }
        return evt;
      })
    );

    // Set user RSVP details
    setUserRsvps((prev) => ({
      ...prev,
      [eventId]: {
        rsvpStatus: status,
        ticketNumber: ticketNumber,
        seatNumber: ticketNumber ? ticketNumber.split('-').pop() : null,
        timestamp: new Date().toISOString(),
      },
    }));

    return { rsvpStatus: status, ticketNumber };
  };

  const addEvent = (newEvent) => {
    const eventWithDefaults = {
      id: newEvent.id || `event-${Date.now()}`,
      title: newEvent.title,
      coverImage: newEvent.coverImage || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop',
      date: newEvent.date,
      time: newEvent.time,
      faculty: newEvent.faculty || 'General',
      category: newEvent.category || 'Academic',
      organizerId: newEvent.organizerId || 'devx',
      organizerName: newEvent.organizerName || 'DevX Guild',
      seatsTotal: parseInt(newEvent.seatsTotal) || 50,
      seatsAvailable: parseInt(newEvent.seatsTotal) || 50,
      rsvpCount: 0,
      waitlistCount: 0,
      venueId: newEvent.venueId || 'science-hall-a',
      speakerIds: newEvent.speakerIds || [],
      description: newEvent.description || '',
      schedule: newEvent.schedule || [{ time: '10:00 AM', title: 'Session Begins', desc: 'Introductions and startup' }]
    };

    setEvents((prev) => [eventWithDefaults, ...prev]);
  };

  const clearAllLocalData = () => {
    localStorage.removeItem('cp_events');
    localStorage.removeItem('cp_user_rsvps');
    setEvents(initialEvents);
    setUserRsvps({});
  };

  return (
    <RsvpContext.Provider value={{ events, userRsvps, submitRsvp, addEvent, clearAllLocalData }}>
      {children}
    </RsvpContext.Provider>
  );
};
