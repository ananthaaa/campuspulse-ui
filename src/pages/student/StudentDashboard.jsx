import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '../../context/RoleContext';
import { RsvpContext } from '../../context/RsvpContext';
import PageShell from '../../components/layout/PageShell';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import {
  Sparkles, Calendar, MapPin, ArrowRight, Ticket, Users,
  Star, TrendingUp, BookOpen
} from 'lucide-react';

const StudentDashboard = () => {
  const { currentUser } = useContext(RoleContext);
  const { events, userRsvps } = useContext(RsvpContext);
  const navigate = useNavigate();

  const firstName = currentUser?.name?.split(' ')[0] || 'Student';
  const now = new Date();
  const greeting = now.getHours() < 12 ? 'Good morning' : now.getHours() < 17 ? 'Good afternoon' : 'Good evening';
  const dateStr = now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });

  // Events the user has RSVP'd for
  const rsvpEventIds = Object.keys(userRsvps);
  const upcomingRsvps = events.filter(e => rsvpEventIds.includes(e.id)).slice(0, 4);

  // Recommended: events not yet RSVP'd, with available seats
  const recommended = events
    .filter(e => !rsvpEventIds.includes(e.id))
    .slice(0, 4);

  const quickStats = [
    { label: 'My RSVPs', value: rsvpEventIds.length, icon: Ticket, bg: 'mint' },
    { label: 'Events Live', value: events.filter(e => e.seatsAvailable > 0).length, icon: TrendingUp, bg: 'peach' },
    { label: 'Active Clubs', value: '50+', icon: Users, bg: 'yellow' },
    { label: 'This Week', value: events.slice(0, 3).length, icon: Calendar, bg: 'white' },
  ];

  return (
    <PageShell useGridPattern={false}>
      <div className="max-w-6xl mx-auto space-y-12">
        
        {/* Welcome Banner */}
        <div className="bg-accent-yellow border-3 border-black p-8 md:p-12 neo-shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 mb-4 bg-white border-2 border-black px-3 py-1 shadow-[2px_2px_0px_0px_#000]">
              <Sparkles size={14} strokeWidth={3} className="text-black" />
              <span className="font-display font-black text-xs uppercase tracking-wider text-black">{greeting}</span>
            </div>
            <h1 className="font-display font-black text-4xl md:text-5xl uppercase tracking-tight text-black mb-2 leading-none">
              Welcome back, <br className="hidden md:block" /> {firstName}!
            </h1>
            <p className="font-bold text-black/70 flex items-center gap-2 mt-4 uppercase text-sm tracking-wide">
              <Calendar size={16} strokeWidth={2.5} />
              {dateStr}
            </p>
          </div>
          
          {currentUser?.avatar && (
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-3 border-black shadow-[4px_4px_0px_0px_#000] bg-white object-cover shrink-0"
            />
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {quickStats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <Card key={i} variant={stat.bg} shadowSize="medium" className="p-4 md:p-6 flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                  <Icon size={20} strokeWidth={2.5} className="text-black" />
                </div>
                <div>
                  <div className="font-display font-black text-2xl md:text-3xl text-black leading-none mb-1">{stat.value}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-black/60">{stat.label}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10">
          
          {/* Upcoming RSVPs */}
          <div className="bg-white border-3 border-black neo-shadow flex flex-col h-full">
            <div className="p-6 border-b-3 border-black flex items-center justify-between bg-pastel-mint">
              <div className="flex items-center gap-3">
                <Ticket size={24} strokeWidth={2.5} className="text-black" />
                <h2 className="font-display font-black text-xl uppercase tracking-tight m-0">My RSVPs</h2>
              </div>
              <Badge variant="white" className="shadow-[2px_2px_0px_0px_#000]">{rsvpEventIds.length} Total</Badge>
            </div>

            {upcomingRsvps.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center grow">
                <div className="w-16 h-16 bg-pastel-peach border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] mb-6 rotate-[-5deg]">
                  <Ticket size={32} strokeWidth={2} className="text-black" />
                </div>
                <p className="font-bold text-black/60 uppercase tracking-wide mb-6">No RSVPs yet. Grab your spot!</p>
                <button
                  onClick={() => navigate('/student/events')}
                  className="bg-black text-white font-display font-bold text-sm uppercase tracking-wide px-6 py-3 border-3 border-black hover:bg-transparent hover:text-black transition-colors"
                >
                  Browse Events
                </button>
              </div>
            ) : (
              <div className="p-6 flex flex-col gap-4 grow">
                {upcomingRsvps.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/student/events/${evt.id}`)}
                    className="flex items-center gap-4 p-3 border-2 border-black bg-white hover:bg-pastel-yellow transition-colors cursor-pointer neo-clickable"
                  >
                    <img src={evt.coverImage} alt={evt.title} className="w-16 h-16 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-black text-base uppercase truncate mb-1">{evt.title}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-black/60 uppercase tracking-wider">
                        <span>{evt.date}</span>
                        <span className="w-1 h-1 bg-black/40 rounded-full" />
                        <span className="truncate">{evt.faculty}</span>
                      </div>
                    </div>
                    <Badge variant="mint" className="hidden sm:inline-flex shrink-0">RSVP'd</Badge>
                  </div>
                ))}
                {rsvpEventIds.length > 4 && (
                  <button
                    onClick={() => navigate('/student/events')}
                    className="w-full mt-2 py-3 border-2 border-black bg-white font-bold text-xs uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
                  >
                    View all {rsvpEventIds.length} RSVPs →
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Recommended Events */}
          <div className="bg-white border-3 border-black neo-shadow flex flex-col h-full">
            <div className="p-6 border-b-3 border-black flex items-center justify-between bg-pastel-peach">
              <div className="flex items-center gap-3">
                <Star size={24} strokeWidth={2.5} className="text-black" />
                <h2 className="font-display font-black text-xl uppercase tracking-tight m-0">Recommended</h2>
              </div>
              <button
                onClick={() => navigate('/student/events')}
                className="font-bold text-xs uppercase hover:underline flex items-center gap-1"
              >
                See all <ArrowRight size={12} strokeWidth={3} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 grow">
              {recommended.length === 0 ? (
                <div className="p-8 text-center text-black/50 font-bold uppercase text-sm h-full flex items-center justify-center">
                  You've RSVP'd for all available events! 🎉
                </div>
              ) : (
                recommended.map((evt) => (
                  <div
                    key={evt.id}
                    onClick={() => navigate(`/student/events/${evt.id}`)}
                    className="flex items-center gap-4 p-3 border-2 border-black bg-white hover:bg-pastel-mint transition-colors cursor-pointer neo-clickable"
                  >
                    <img src={evt.coverImage} alt={evt.title} className="w-16 h-16 object-cover border-2 border-black shadow-[2px_2px_0px_0px_#000] shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="font-display font-black text-base uppercase truncate mb-1">{evt.title}</div>
                      <div className="flex items-center gap-2 text-xs font-bold text-black/60 uppercase tracking-wider">
                        <span>{evt.date}</span>
                      </div>
                    </div>
                    {evt.seatsAvailable > 0 ? (
                      <Badge variant="yellow" className="shrink-0">{evt.seatsAvailable} left</Badge>
                    ) : (
                      <Badge variant="dark" className="shrink-0">Waitlist</Badge>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="font-display font-black text-2xl uppercase tracking-tight mb-6 flex items-center gap-3">
            <span className="w-8 h-8 bg-black flex items-center justify-center shadow-[2px_2px_0px_0px_#DAF5F0]">
              <ArrowRight size={16} className="text-white" strokeWidth={3} />
            </span>
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {[
              { label: 'Browse Events', icon: Calendar, to: '/student/events', bg: 'white' },
              { label: 'Explore Clubs', icon: Users, to: '/student/clubs', bg: 'mint' },
              { label: 'Indoor Nav', icon: MapPin, to: '/student/navigate', bg: 'peach' },
              { label: 'My Profile', icon: BookOpen, to: '/student/profile', bg: 'yellow' },
            ].map(({ label, icon: Icon, to, bg }) => (
              <Card
                key={to}
                onClick={() => navigate(to)}
                variant={bg}
                shadowSize="small"
                className="p-5 flex items-center gap-4 cursor-pointer hover:neo-shadow-lg transition-shadow"
              >
                <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center shrink-0">
                  <Icon size={20} strokeWidth={2.5} className="text-black" />
                </div>
                <span className="font-display font-black text-sm uppercase">{label}</span>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PageShell>
  );
};

export default StudentDashboard;
