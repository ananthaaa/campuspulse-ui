import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import mockClubs from '../data/clubs.json';
import { Users, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const ClubDirectory = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      {/* Title Header */}
      <div className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="font-display font-bold text-5xl md:text-6xl text-text-primary tracking-tight mb-4">
          Discover Campus Clubs
        </h1>
        <p className="text-text-secondary text-lg">
          Explore organizations, connect with peers, and find your community on campus.
        </p>
      </div>

      {/* Grid of Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {mockClubs.map((club, index) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            key={club.id}
            onClick={() => navigate(`/club/${club.id}`)}
            className="group cursor-pointer bg-bg-surface rounded-2xl border border-border-subtle overflow-hidden hover:border-accent transition-colors flex flex-col h-full"
          >
            {/* Visual Header Grid Panel */}
            <div className={`h-40 bg-gradient-to-br ${club.bgGrad} flex items-center justify-center relative`}>
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
              <div className="w-20 h-20 bg-bg-primary rounded-full flex items-center justify-center font-display font-bold text-2xl text-text-primary z-10 shadow-xl border border-border-subtle">
                {club.logo}
              </div>
            </div>

            {/* Club Details */}
            <div className="p-6 flex flex-col justify-between grow">
              <div>
                <h3 className="font-display font-bold text-2xl text-text-primary mb-2 group-hover:text-accent transition-colors">
                  {club.name}
                </h3>
                <p className="text-sm text-text-secondary line-clamp-3 leading-relaxed mb-6">
                  {club.description}
                </p>
              </div>

              <div className="border-t border-border-subtle pt-4 flex items-center justify-between text-sm">
                <span className="flex items-center gap-2 text-text-tertiary">
                  <Users size={16} />
                  <span>{club.memberIds.length} Members</span>
                </span>
                
                <span className="flex items-center gap-1 text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-x-2 group-hover:translate-x-0">
                  <span>View</span>
                  <ChevronRight size={16} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  );
};

export default ClubDirectory;
