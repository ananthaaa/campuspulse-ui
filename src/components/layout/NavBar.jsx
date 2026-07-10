import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { RoleContext } from '../../context/RoleContext';
import { NavModeContext } from '../../context/NavModeContext';
import { Shield, User, Compass, MapPin, Grid, Layers } from 'lucide-react';

const NavBar = () => {
  const { currentRole, toggleRole } = useContext(RoleContext);
  const { activeEventId, currentPhase } = useContext(NavModeContext);
  const location = useLocation();

  const isStudent = currentRole === 'student';

  const isActive = (path) => {
    return location.pathname === path;
  };

  const navItemClass = (path) => {
    const activeClass = "bg-accent-yellow text-black neo-shadow-sm translate-x-[-1px] translate-y-[-1px]";
    const inactiveClass = "hover:bg-black/5 text-black";
    return `font-display font-bold text-xs uppercase tracking-wider py-2 px-4 border-2 border-black transition-all ${
      isActive(path) ? activeClass : inactiveClass
    }`;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b-3 border-black w-full select-none">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="bg-black text-white p-2 border-2 border-black font-black font-display text-lg tracking-tighter transition-all duration-100 group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            CP
          </div>
          <span className="font-display font-black text-xl tracking-tight uppercase group-hover:text-accent-yellow transition-colors hidden sm:inline-block">
            CampusPulse
          </span>
        </Link>

        {/* Links */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isStudent ? (
              <>
                <Link to="/" className={navItemClass('/')}>
                  Home
                </Link>
                <Link to="/discover" className={navItemClass('/discover')}>
                  Discover
                </Link>
                <Link to="/clubs" className={navItemClass('/clubs')}>
                  Clubs
                </Link>
                {activeEventId && currentPhase && (
                  <Link
                    to="/navigate"
                    className={`${navItemClass('/navigate')} bg-pastel-peach relative flex items-center gap-1.5`}
                  >
                    <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-ping absolute -top-1 -right-1 border border-black" />
                    <span className="w-2 h-2 bg-red-600 rounded-full absolute -top-1 -right-1 border border-black" />
                    <MapPin size={12} className="inline" />
                    <span>Navigating</span>
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to="/admin" className={navItemClass('/admin')}>
                  Dashboard
                </Link>
                <Link to="/admin/event-form" className={navItemClass('/admin/event-form')}>
                  New Event
                </Link>
                <Link to="/admin/venue-upload" className={navItemClass('/admin/venue-upload')}>
                  Venue Setup
                </Link>
              </>
            )}
          </div>

          {/* Role Toggle Switcher */}
          <button
            onClick={toggleRole}
            className={`flex items-center gap-2 py-1.5 px-3 border-2 border-black font-display font-bold text-xs uppercase tracking-wider transition-all neo-shadow-sm hover:neo-shadow active:translate-x-[1px] active:translate-y-[1px] active:neo-shadow-sm ${
              isStudent ? 'bg-pastel-mint text-black' : 'bg-pastel-peach text-black'
            }`}
          >
            {isStudent ? (
              <>
                <User size={14} />
                <span className="hidden md:inline">Student</span>
              </>
            ) : (
              <>
                <Shield size={14} />
                <span className="hidden md:inline">Admin</span>
              </>
            )}
          </button>

        </div>
      </div>
    </nav>
  );
};

export default NavBar;
