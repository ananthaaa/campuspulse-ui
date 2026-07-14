import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import { RsvpContext } from '../context/RsvpContext';
import mockClubs from '../data/clubs.json';
import mockSpeakers from '../data/speakers.json';
import { ArrowLeft, Users, Calendar, ArrowRight, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useContext(RsvpContext);

  const club = mockClubs.find((c) => c.id === id);

  if (!club) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto text-center mt-20">
          <h3 className="font-display font-bold text-3xl text-text-primary mb-4">Club Not Found</h3>
          <p className="text-text-secondary mb-8">
            The student organization you are looking for does not exist or has been removed.
          </p>
          <Link to="/clubs" className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle px-6 py-3 rounded-full text-text-primary hover:text-accent transition-colors">
            <ArrowLeft size={16} />
            Back to Directory
          </Link>
        </div>
      </PageShell>
    );
  }

  // Load members and hosted events
  const members = mockSpeakers.filter((spk) => club.memberIds.includes(spk.id));
  const hostedEvents = events.filter((evt) => evt.organizerId === club.id);

  return (
    <PageShell>
      <div className="mb-8">
        <Link
          to="/clubs"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Directory
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {/* Banner with Logo */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`lg:col-span-2 rounded-3xl overflow-hidden bg-gradient-to-br ${club.bgGrad} relative p-10 md:p-12 flex flex-col md:flex-row items-center md:items-end gap-8`}
        >
          <div className="absolute inset-0 bg-black/60"></div>
          
          <div className="relative z-10 w-32 h-32 bg-bg-primary rounded-full flex items-center justify-center font-display font-bold text-4xl text-text-primary border-4 border-bg-primary shadow-2xl">
            {club.logo}
          </div>
          
          <div className="relative z-10 text-center md:text-left">
            <div className="flex justify-center md:justify-start gap-3 mb-4">
              <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs uppercase tracking-wider font-medium">Chartered</span>
              <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs uppercase tracking-wider font-medium">Active</span>
            </div>
            <h1 className="font-display font-bold text-4xl md:text-5xl text-white tracking-tight">
              {club.name}
            </h1>
          </div>
        </motion.div>

        {/* Club Statistics Card */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-bg-surface border border-border-subtle rounded-3xl p-8 flex flex-col justify-center"
        >
          <div className="flex items-center gap-2 mb-6">
            <Activity className="w-5 h-5 text-accent" />
            <h3 className="font-medium text-text-secondary uppercase tracking-widest text-xs">At a Glance</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <p className="text-text-tertiary text-sm mb-1">Members</p>
              <p className="text-2xl font-display font-bold text-text-primary">{club.memberIds.length}</p>
            </div>
            <div className="border-t border-border-subtle pt-4">
              <p className="text-text-tertiary text-sm mb-1">Hosted Events</p>
              <p className="text-2xl font-display font-bold text-text-primary">{hostedEvents.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-12">
          {/* About Club */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">01</span>
              <h2 className="font-display font-bold text-2xl text-text-primary">About Our Club</h2>
            </div>
            <p className="text-text-secondary leading-relaxed text-lg">
              {club.description}
            </p>
          </section>

          {/* Members Showcase */}
          <section>
            <div className="flex items-center gap-2 mb-6">
              <span className="text-accent font-bold text-xs uppercase tracking-widest">02</span>
              <h2 className="font-display font-bold text-2xl text-text-primary">Executive Committee</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {members.map((member) => (
                <div key={member.id} className="bg-bg-surface border border-border-subtle rounded-2xl p-4 flex items-center gap-4">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center font-display font-bold text-lg"
                    style={{ backgroundColor: member.avatarColor, color: '#fff' }}
                  >
                    {member.avatarText}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-text-primary text-lg">
                      {member.name}
                    </h3>
                    <span className="text-text-tertiary text-sm">
                      {member.role}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right 1 Column: Hosted Events */}
        <div className="space-y-6">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-accent font-bold text-xs uppercase tracking-widest">03</span>
            <h2 className="font-display font-bold text-2xl text-text-primary">Upcoming Events</h2>
          </div>

          {hostedEvents.length > 0 ? (
            <div className="space-y-4">
              {hostedEvents.map((evt) => (
                <div
                  key={evt.id}
                  onClick={() => navigate(`/event/${evt.id}`)}
                  className="bg-bg-surface border border-border-subtle rounded-2xl p-5 cursor-pointer hover:border-accent transition-colors group"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-text-tertiary mb-3">
                    <Calendar className="w-4 h-4" />
                    <span>{evt.date}</span>
                  </div>
                  <h3 className="font-display font-bold text-lg text-text-primary mb-6 group-hover:text-accent transition-colors">
                    {evt.title}
                  </h3>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-secondary">{evt.seatsAvailable} seats left</span>
                    <span className="text-accent font-medium flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      Details <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-bg-surface border border-border-subtle border-dashed rounded-2xl p-8 text-center">
              <Calendar className="w-10 h-10 mx-auto mb-4 text-text-tertiary" />
              <p className="text-text-secondary text-sm">No upcoming events scheduled.</p>
            </div>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default ClubProfile;
