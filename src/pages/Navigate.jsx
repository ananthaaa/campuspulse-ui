import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { NavModeContext } from '../context/NavModeContext';
import { RsvpContext } from '../context/RsvpContext';
import mockVenues from '../data/venues.json';
import { MapPin, Navigation, Compass, CheckCircle2, ChevronRight, AlertCircle, ArrowRight, Info } from 'lucide-react';

const Navigate = () => {
  const navigate = useNavigate();
  const {
    activeEventId,
    currentPhase,
    outdoorProgress,
    outdoorStatus,
    activeIndoorStep,
    completedIndoorSteps,
    setOutdoorProgress,
    setOutdoorStatus,
    simulateArrival,
    setIndoorStep,
    markIndoorStepCompleted,
    finishNavigation,
    resetNavigation,
  } = useContext(NavModeContext);

  const { events } = useContext(RsvpContext);

  // Toast notification for geofence trigger
  const [showToast, setShowToast] = useState(false);

  // Find active event & venue
  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === activeEventId);
  }, [events, activeEventId]);

  const venue = useMemo(() => {
    if (!activeEvent) return null;
    return mockVenues.find((v) => v.id === activeEvent.venueId);
  }, [activeEvent]);

  // Use a ref so the interval callback can always read the latest progress value
  const progressRef = useRef(outdoorProgress);
  useEffect(() => {
    progressRef.current = outdoorProgress;
  }, [outdoorProgress]);

  // Simulate outdoor walking progress automatically
  useEffect(() => {
    let timer;
    if (currentPhase === 'outdoor' && progressRef.current < 100) {
      timer = setInterval(() => {
        const current = progressRef.current;
        if (current >= 100) {
          clearInterval(timer);
          return;
        }
        const next = Math.min(current + 5, 100);
        progressRef.current = next;
        setOutdoorProgress(next);

        if (next >= 100) {
          clearInterval(timer);
          setOutdoorStatus("Arrived at building boundary! Handoff active.");
          setShowToast(true);
          setTimeout(() => {
            setShowToast(false);
            simulateArrival();
          }, 3000);
        } else if (next > 75) {
          setOutdoorStatus("Approaching building entrance...");
        } else if (next > 40) {
          setOutdoorStatus("Walking down Campus Mall corridor...");
        } else {
          setOutdoorStatus("Leaving student union square...");
        }
      }, 1000);
    }
    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPhase]);

  if (!activeEvent || !venue) {
    return (
      <PageShell>
        <div className="border-3 border-black bg-white p-12 text-center neo-shadow max-w-lg mx-auto select-none">
          <Navigation className="w-12 h-12 text-black mx-auto mb-4" />
          <h3 className="font-display font-black text-xl uppercase mb-2">No Active Navigation</h3>
          <p className="text-sm font-semibold text-black/60 mb-6">
            You must claim a ticket and click "Launch Navigator" to start your route.
          </p>
          <Link to="/discover">
            <Button variant="primary">Browse Live Events</Button>
          </Link>
        </div>
      </PageShell>
    );
  }

  // Draw connecting path line in SVG
  const pathDValue = venue.waypoints
    .map((wp, idx) => `${idx === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`)
    .join(' ');

  const currentWaypoint = venue.waypoints[activeIndoorStep] || null;
  const isLastIndoorStep = activeIndoorStep === venue.waypoints.length - 1;
  const isNavCompleted = currentPhase === 'arrived';

  const handleNextStep = () => {
    markIndoorStepCompleted(activeIndoorStep, true);
    if (isLastIndoorStep) {
      finishNavigation();
    } else {
      setIndoorStep(activeIndoorStep + 1);
    }
  };

  const handlePrevStep = () => {
    if (activeIndoorStep > 0) {
      setIndoorStep(activeIndoorStep - 1);
    }
  };

  const handleCheckStep = (idx) => {
    markIndoorStepCompleted(idx, !completedIndoorSteps[idx]);
  };

  return (
    <PageShell>
      {/* Geofence Handoff Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 w-full max-w-md px-4"
          >
            <div className="bg-pastel-mint border-3 border-black p-4 neo-shadow flex items-center gap-3">
              <CheckCircle2 className="w-6 h-6 text-black shrink-0" />
              <div>
                <span className="font-display font-black text-sm uppercase block">Geofence Boundary Reached</span>
                <span className="text-xxs font-semibold text-black/60">Switching from Outdoor GPS to Indoor Map...</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header Info */}
      <div className="mb-10 text-left border-b-3 border-black pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4 select-none">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="accent">Phase: {currentPhase.toUpperCase()}</Badge>
            <Badge variant="white">{venue.building}</Badge>
          </div>
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase tracking-tight">
            Routing to {activeEvent.title}
          </h1>
        </div>
        <button
          onClick={resetNavigation}
          className="text-xs font-black uppercase tracking-wider text-black/50 hover:text-red-600 transition-colors border-2 border-black/10 py-1.5 px-3 hover:border-black active:translate-y-[1px]"
        >
          Cancel Navigation
        </button>
      </div>

      {/* Phase Renderers */}
      {currentPhase === 'outdoor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 select-none">
          {/* Outdoor Map Placeholder */}
          <div className="lg:col-span-2 space-y-4">
            <Card variant="white" shadowSize="medium" className="h-96 relative bg-grid-dots overflow-hidden">
              {/* Map grid decoration */}
              <div className="absolute inset-0 bg-neutral-900/5 flex items-center justify-center font-display font-black text-xs uppercase tracking-widest text-black/25">
                Map Canvas Area
              </div>

              {/* Start Node */}
              <div className="absolute bottom-10 left-10 text-center">
                <div className="w-4 h-4 bg-black border border-white rounded-full mx-auto" />
                <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 bg-white border border-black px-1">UNION SQ</span>
              </div>

              {/* End Node */}
              <div className="absolute top-10 right-20 text-center">
                <div className="w-6 h-6 bg-accent-yellow border-2 border-black flex items-center justify-center mx-auto animate-bounce">
                  <MapPin size={12} />
                </div>
                <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 bg-white border border-black px-1">{venue.building}</span>
              </div>

              {/* Polyline Route */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  d="M 60 340 L 180 250 L 320 220 L 410 60"
                  fill="none"
                  stroke="#000"
                  strokeWidth="4"
                  strokeDasharray="8,8"
                />
                
                {/* Walking dot along path */}
                <motion.circle
                  r="8"
                  fill="#FFDB58"
                  stroke="#000"
                  strokeWidth="2"
                  animate={{
                    cx: [60, 180, 320, 410],
                    cy: [340, 250, 220, 60]
                  }}
                  transition={{
                    duration: 20,
                    ease: "linear",
                    repeat: Infinity
                  }}
                />
              </svg>

              {/* Progress HUD Overlay */}
              <div className="absolute bottom-4 left-4 right-4 bg-white border-3 border-black p-4 neo-shadow flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-accent-yellow border-2 border-black flex items-center justify-center font-black animate-spin text-sm">
                    🧭
                  </div>
                  <div>
                    <span className="font-display font-black text-xs uppercase block">{outdoorStatus}</span>
                    <span className="text-xxs font-bold text-black/60 uppercase">Walking Route Active</span>
                  </div>
                </div>
                <Badge variant="mint" className="font-mono">
                  {outdoorProgress}% Progress
                </Badge>
              </div>
            </Card>
          </div>

          {/* Side Info & Trigger */}
          <div className="space-y-6">
            <Card variant="yellow" shadowSize="medium" className="p-6 space-y-6">
              <h3 className="font-display font-black text-lg uppercase">
                Outdoor Navigation HUD
              </h3>

              <div className="space-y-4 font-display font-bold text-xs uppercase tracking-wider text-black/85">
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>Target Building</span>
                  <span className="text-black font-black">{venue.building}</span>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>GPS Distance</span>
                  <span className="text-black font-black">{venue.distance}</span>
                </div>
                <div className="flex justify-between border-b border-black/10 pb-2">
                  <span>Estimated walk</span>
                  <span className="text-black font-black">{venue.timeEstimation}</span>
                </div>
              </div>

              {/* Simulate Arrival Button */}
              <Button
                onClick={simulateArrival}
                variant="primary"
                className="w-full text-center"
              >
                Simulate Geofence Arrival
              </Button>
            </Card>

            <Card variant="white" shadowSize="medium" className="p-6">
              <div className="flex gap-3">
                <Info size={20} className="shrink-0" />
                <p className="text-xs font-semibold text-black/70 leading-relaxed">
                  The app is simulating your walking coordinates. In a production build, your device's background GPS coordinates will trigger the geofence to switch automatically.
                </p>
              </div>
            </Card>
          </div>
        </div>
      )}

      {(currentPhase === 'indoor' || isNavCompleted) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 select-none">
          {/* Indoor SVG Floor Plan */}
          <div className="lg:col-span-2 space-y-4">
            <Card variant="white" shadowSize="medium" className="p-4 bg-white flex flex-col items-center">
              <div className="w-full text-left font-display font-black text-xs uppercase tracking-wider border-b border-black/10 pb-2 mb-4">
                Indoor Waypoint Map (2nd Floor Block B)
              </div>

              {/* Inline SVG Floor Plan */}
              <div className="w-full max-w-lg aspect-[4/3] neo-border bg-[#FCFAF7] relative overflow-hidden">
                <svg viewBox="0 0 500 350" className="w-full h-full">
                  {/* Outer Walls */}
                  <rect x="20" y="20" width="460" height="310" fill="none" stroke="#000000" strokeWidth="4" />
                  
                  {/* Corridors / Hallways */}
                  {/* Main corridor (L shape) */}
                  <rect x="50" y="50" width="100" height="250" fill="#EAE5E0" stroke="#000000" strokeWidth="2.5" />
                  <rect x="150" y="50" width="200" height="100" fill="#EAE5E0" stroke="#000000" strokeWidth="2.5" />
                  <rect x="350" y="50" width="100" height="250" fill="#EAE5E0" stroke="#000000" strokeWidth="2.5" />
                  
                  {/* Hallway divider walls */}
                  <line x1="150" y1="150" x2="350" y2="150" stroke="#000000" strokeWidth="2.5" />
                  
                  {/* Room labels */}
                  <text x="100" y="295" fontSize="10" fontWeight="bold" fontFamily="Epilogue" fill="#000" textAnchor="middle">UNION CAFE</text>
                  <text x="250" y="125" fontSize="10" fontWeight="bold" fontFamily="Epilogue" fill="#000" textAnchor="middle">RESEARCH GALLERY</text>
                  <text x="400" y="295" fontSize="10" fontWeight="bold" fontFamily="Epilogue" fill="#000" textAnchor="middle">{activeEvent.venueId === 'science-hall-a' ? 'AUDITORIUM A' : 'HUB ROOM 202'}</text>

                  {/* Waypoint Connecting line path */}
                  <path
                    d={pathDValue}
                    fill="none"
                    stroke="#FF5A1F"
                    strokeWidth="3.5"
                    strokeDasharray="6,6"
                  />

                  {/* Render Waypoint Nodes */}
                  {venue.waypoints.map((wp, idx) => {
                    const isActive = idx === activeIndoorStep && !isNavCompleted;
                    const isCompleted = completedIndoorSteps[idx] || isNavCompleted;
                    
                    return (
                      <g key={wp.step} className="cursor-pointer" onClick={() => setIndoorStep(idx)}>
                        {/* Connecting point circles */}
                        <circle
                          cx={wp.x}
                          cy={wp.y}
                          r={isActive ? "12" : "8"}
                          fill={isActive ? "#FFDB58" : isCompleted ? "#DAF5F0" : "#ffffff"}
                          stroke="#000000"
                          strokeWidth="2.5"
                        />
                        {/* Number inside */}
                        <text
                          x={wp.x}
                          y={wp.y + 3}
                          fontSize="9"
                          fontWeight="black"
                          fontFamily="Epilogue"
                          fill="#000"
                          textAnchor="middle"
                        >
                          {wp.step}
                        </text>
                        
                        {/* Active pulsating beacon halo */}
                        {isActive && (
                          <circle
                            cx={wp.x}
                            cy={wp.y}
                            r="20"
                            fill="none"
                            stroke="#FFDB58"
                            strokeWidth="2"
                            className="animate-ping"
                          />
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>

              {/* Indoor Progress bar */}
              <div className="w-full bg-black/10 h-3 border-2 border-black mt-4 overflow-hidden rounded-none">
                <div
                  className="bg-pastel-mint h-full border-r-2 border-black transition-all duration-300"
                  style={{
                    width: `${
                      isNavCompleted
                        ? 100
                        : (completedIndoorSteps.filter(Boolean).length / venue.waypoints.length) * 100
                    }%`,
                  }}
                />
              </div>
            </Card>
          </div>

          {/* Indoor Checklists */}
          <div className="space-y-6">
            {isNavCompleted ? (
              <Card variant="mint" shadowSize="medium" className="p-6 space-y-6 text-center">
                <div className="w-12 h-12 bg-white border-3 border-black mx-auto flex items-center justify-center font-black text-xl shadow-[2px_2px_0px_0px_#000]">
                  ✓
                </div>
                <div>
                  <h3 className="font-display font-black text-xl uppercase mb-2">You Have Arrived!</h3>
                  <p className="text-xs font-semibold text-black/70 leading-relaxed">
                    You have reached the venue destination. Present your ticket barcode to the host organizer to scan and check in. Enjoy the event!
                  </p>
                </div>

                <div className="flex flex-col gap-2">
                  <Button
                    onClick={() => {
                      resetNavigation();
                      navigate('/');
                    }}
                    variant="primary"
                    className="w-full text-center"
                  >
                    Finish Journey
                  </Button>
                  <Button
                    onClick={() => navigate(`/rsvp-confirmation/${activeEvent.id}`)}
                    variant="secondary"
                    className="w-full text-center"
                  >
                    Show Ticket Barcode
                  </Button>
                </div>
              </Card>
            ) : (
              <Card variant="white" shadowSize="medium" className="p-6 space-y-6">
                <div className="border-b border-black/10 pb-2">
                  <span className="block text-xs font-black uppercase tracking-wider text-black/50">Active Waypoint</span>
                  <h3 className="font-display font-black text-lg uppercase flex items-center gap-2">
                    <span className="bg-accent-yellow border-2 border-black w-6 h-6 flex items-center justify-center text-xs font-black">
                      {currentWaypoint?.step}
                    </span>
                    <span>Step {currentWaypoint?.step} of {venue.waypoints.length}</span>
                  </h3>
                </div>

                <div className="bg-[#FCFAF7] border-2 border-black p-4 neo-shadow-sm space-y-2">
                  <p className="font-display font-black text-sm uppercase leading-snug">
                    {currentWaypoint?.instruction}
                  </p>
                  <p className="text-xs font-semibold text-black/60">
                    {currentWaypoint?.details}
                  </p>
                </div>

                {/* Waypoint Checklist (01/02/03 Numbered Story Block Pattern) */}
                <div className="space-y-3 font-display font-bold text-xs uppercase tracking-wider border-t border-black/10 pt-4">
                  {venue.waypoints.map((wp, idx) => {
                    const isActive = idx === activeIndoorStep;
                    const isCompleted = completedIndoorSteps[idx];
                    
                    return (
                      <div
                        key={wp.step}
                        onClick={() => setIndoorStep(idx)}
                        className={`flex items-start gap-3 p-2 cursor-pointer border-2 transition-all ${
                          isActive
                            ? 'bg-pastel-yellow border-black neo-shadow-sm'
                            : isCompleted
                              ? 'bg-black/5 border-transparent text-black/40'
                              : 'bg-transparent border-transparent hover:border-black/20'
                        }`}
                      >
                        <span className="font-black text-sm text-black/35 mt-0.5">
                          0{wp.step}
                        </span>
                        
                        <div className="grow">
                          <span className={`${isCompleted ? 'line-through' : ''}`}>
                            {wp.instruction}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Navigator Steps CTA */}
                <div className="flex gap-2">
                  <Button
                    onClick={handlePrevStep}
                    disabled={activeIndoorStep === 0}
                    variant="outline"
                    className="flex-1 py-2 px-3 text-xs"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextStep}
                    variant="primary"
                    className="flex-1 py-2 px-3 text-xs"
                  >
                    {isLastIndoorStep ? "Mark Arrived" : "Next Step"}
                    <ChevronRight size={14} />
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Navigate;
