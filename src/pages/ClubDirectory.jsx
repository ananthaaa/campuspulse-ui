import React from 'react';
import { useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import mockClubs from '../data/clubs.json';
import { Compass, Users, ChevronRight } from 'lucide-react';

const ClubDirectory = () => {
  const navigate = useNavigate();

  return (
    <PageShell>
      {/* Title Header */}
      <div className="mb-10 text-left border-b-3 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
        <div>
          <Badge variant="mint" className="mb-3">Student Hub</Badge>
          <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight">
            Club Directory
          </h1>
        </div>
        <p className="text-black/60 font-semibold text-sm max-w-sm md:text-right">
          Showcasing active student guilds, creative councils, and sports organizations.
        </p>
      </div>

      {/* Grid of Organizations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 select-none">
        {mockClubs.map((club) => (
          <Card
            key={club.id}
            onClick={() => navigate(`/club/${club.id}`)}
            variant="white"
            shadowSize="medium"
            className="flex flex-col h-full cursor-pointer"
          >
            {/* Visual Header Grid Panel */}
            <div className={`h-36 bg-gradient-to-br ${club.bgGrad} border-b-3 border-black flex items-center justify-center relative`}>
              <div className="w-16 h-16 bg-white border-3 border-black flex items-center justify-center font-display font-black text-2xl shadow-[2px_2px_0px_0px_#000]">
                {club.logo}
              </div>
              <Badge variant="dark" className="absolute top-3 right-3 shadow-[1px_1px_0px_0px_#000]">
                {club.eventIds.length} Events
              </Badge>
            </div>

            {/* Club Details */}
            <div className="p-6 flex flex-col justify-between grow space-y-4">
              <div>
                <h3 className="font-display font-black text-lg uppercase flex items-center justify-between group-hover:text-accent-yellow transition-colors">
                  <span>{club.name}</span>
                </h3>
                <p className="text-xs font-semibold text-black/60 line-clamp-3 leading-relaxed mt-2">
                  {club.description}
                </p>
              </div>

              <div className="border-t border-black/10 pt-4 flex items-center justify-between text-xs font-bold uppercase tracking-wider text-black/80">
                <span className="flex items-center gap-1">
                  <Users size={14} className="text-black" />
                  <span>{club.memberIds.length} Members</span>
                </span>
                
                <span className="flex items-center gap-0.5 text-accent-yellow font-black">
                  <span>View Profile</span>
                  <ChevronRight size={14} />
                </span>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </PageShell>
  );
};

export default ClubDirectory;
