import React, { useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { RsvpContext } from '../context/RsvpContext';
import mockClubs from '../data/clubs.json';
import mockSpeakers from '../data/speakers.json';
import { ArrowLeft, Users, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

const ClubProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { events } = useContext(RsvpContext);

  const club = mockClubs.find((c) => c.id === id);

  if (!club) {
    return (
      <PageShell>
        <div className="border-3 border-black bg-white p-12 text-center neo-shadow max-w-lg mx-auto select-none">
          <h3 className="font-display font-black text-xl uppercase mb-2">Club Not Found</h3>
          <p className="text-sm font-semibold text-black/60 mb-6">
            The student organization you are looking for does not exist.
          </p>
          <Link to="/clubs">
            <Button variant="primary">Back to Club Directory</Button>
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
      {/* Back Button */}
      <div className="mb-6 flex">
        <Link
          to="/clubs"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider hover:text-accent-yellow transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Club Directory
        </Link>
      </div>

      {/* Profile Header Grid Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12 select-none">
        {/* Banner with Logo */}
        <div className={`lg:col-span-2 bg-gradient-to-br ${club.bgGrad} border-3 border-black p-8 flex flex-col sm:flex-row gap-6 items-center justify-start neo-shadow`}>
          <div className="w-24 h-24 bg-white border-3 border-black flex items-center justify-center font-display font-black text-4xl shadow-[3px_3px_0px_0px_#000]">
            {club.logo}
          </div>
          <div className="space-y-2 text-center sm:text-left">
            <div className="flex justify-center sm:justify-start gap-2">
              <Badge variant="dark">Chartered Club</Badge>
              <Badge variant="white">Active</Badge>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl uppercase tracking-tight text-black leading-none">
              {club.name}
            </h1>
          </div>
        </div>

        {/* Club Statistics Card */}
        <Card variant="yellow" shadowSize="medium" className="p-6 space-y-4">
          <h3 className="font-display font-black text-sm uppercase tracking-wider text-black/50 border-b border-black/10 pb-2">
            Club Registry Stats
          </h3>
          <div className="space-y-4 font-display font-bold text-xs uppercase tracking-wider text-black/85">
            <div className="flex justify-between">
              <span>Council</span>
              <span className="text-black font-black">Science Council</span>
            </div>
            <div className="flex justify-between">
              <span>Members</span>
              <span className="text-black font-black">{club.memberIds.length} active</span>
            </div>
            <div className="flex justify-between">
              <span>Hosted Events</span>
              <span className="text-black font-black">{hostedEvents.length} total</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 select-none">
        
        {/* Left 2 Columns: Description & Member List */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* About Club */}
          <Card variant="white" shadowSize="medium" className="p-6 md:p-8 space-y-4">
            <h2 className="font-display font-black text-xl uppercase border-b-2 border-black pb-2">
              About Our Club
            </h2>
            <p className="text-sm font-semibold leading-relaxed text-black/85">
              {club.description}
            </p>
          </Card>

          {/* Members Showcase Directory */}
          <div className="space-y-4">
            <h2 className="font-display font-black text-xl uppercase text-left">
              Executive Committee
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {members.map((member) => (
                <Card key={member.id} variant="white" shadowSize="small" className="p-4 flex items-center gap-4">
                  <div
                    className="w-12 h-12 border-2 border-black flex items-center justify-center font-display font-black text-sm shrink-0"
                    style={{ backgroundColor: member.avatarColor }}
                  >
                    {member.avatarText}
                  </div>
                  <div>
                    <h3 className="font-display font-black text-sm uppercase leading-tight">
                      {member.name}
                    </h3>
                    <span className="text-xs font-semibold text-black/60 uppercase">
                      {member.role}
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Column: Hosted Events List */}
        <div className="space-y-6">
          <h2 className="font-display font-black text-xl uppercase text-left">
            Upcoming Events
          </h2>

          {hostedEvents.length > 0 ? (
            <div className="space-y-4">
              {hostedEvents.map((evt) => (
                <Card
                  key={evt.id}
                  onClick={() => navigate(`/event/${evt.id}`)}
                  variant="white"
                  shadowSize="medium"
                  className="p-4 cursor-pointer hover:border-accent-yellow flex flex-col justify-between space-y-4"
                >
                  <div>
                    <div className="flex items-center gap-2 text-xxs font-bold uppercase tracking-wider text-black/50 mb-1">
                      <span>{evt.date}</span>
                      <span>•</span>
                      <span>{evt.category}</span>
                    </div>
                    <h3 className="font-display font-black text-sm uppercase leading-snug line-clamp-2">
                      {evt.title}
                    </h3>
                  </div>

                  <div className="border-t border-black/10 pt-3 flex items-center justify-between text-xxs font-bold uppercase tracking-wider text-black/70 mt-auto">
                    <span>{evt.seatsAvailable} seats left</span>
                    <span className="flex items-center text-accent-yellow font-black">
                      <span>Details</span>
                      <ArrowRight size={10} />
                    </span>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card variant="white" shadowSize="small" className="p-6 text-center text-black/50">
              <Calendar className="w-8 h-8 mx-auto mb-2 text-black/35" />
              <p className="text-xs font-bold uppercase tracking-wider">No Hosted Events Configured</p>
            </Card>
          )}
        </div>
      </div>
    </PageShell>
  );
};

export default ClubProfile;
