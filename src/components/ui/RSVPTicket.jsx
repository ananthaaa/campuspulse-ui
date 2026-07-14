import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Clock } from 'lucide-react';

export default function RSVPTicket({ event, rsvpStatus, ticketNumber }) {
  const isWaitlist = rsvpStatus === 'Waitlisted';

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className={`relative w-full overflow-hidden rounded-2xl border ${isWaitlist ? 'border-yellow-500/30' : 'border-success/30'} bg-bg-surface-alt p-6`}
    >
      <div className="flex items-start justify-between mb-6">
        <div>
          <h3 className="text-text-primary text-2xl font-display font-bold mb-1">{event.title}</h3>
          <p className="text-text-secondary text-sm">{event.date} • {event.time}</p>
        </div>
        <div className={`p-2 rounded-full ${isWaitlist ? 'bg-yellow-500/20 text-yellow-500' : 'bg-success/20 text-success'}`}>
          {isWaitlist ? <Clock className="w-6 h-6" /> : <CheckCircle className="w-6 h-6" />}
        </div>
      </div>

      <div className="border-t border-dashed border-border-subtle my-4"></div>

      <div className="flex justify-between items-center">
        <div>
          <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Status</p>
          <p className={`font-medium ${isWaitlist ? 'text-yellow-500' : 'text-success'}`}>{rsvpStatus}</p>
        </div>
        {ticketNumber && (
          <div className="text-right">
            <p className="text-text-tertiary text-xs uppercase tracking-wider mb-1">Ticket No.</p>
            <p className="text-text-primary font-mono bg-bg-primary px-2 py-1 rounded text-sm">{ticketNumber}</p>
          </div>
        )}
      </div>
      
      {/* Decorative dashed cutouts for ticket look */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-bg-primary rounded-full transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-bg-primary rounded-full transform -translate-y-1/2"></div>
    </motion.div>
  );
}
