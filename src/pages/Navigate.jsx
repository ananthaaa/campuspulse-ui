import React, { useContext, useEffect, useState, useMemo, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import PageShell from '../components/layout/PageShell';
import { NavModeContext } from '../context/NavModeContext';
import { RsvpContext } from '../context/RsvpContext';
import { NotificationContext } from '../context/NotificationContext';
import mockVenues from '../data/venues.json';
import StepTracker from '../components/ui/StepTracker';
import { MapPin, Navigation, CheckCircle2, ChevronRight, ArrowLeft, Info, Compass } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

const studentIcon = L.divIcon({
  className: 'custom-student-icon',
  html: '<div style="width: 16px; height: 16px; background-color: #007bff; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,123,255,0.8);"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3;
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
};

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
  const { addNotification } = useContext(NotificationContext);

  const activeEvent = useMemo(() => {
    return events.find((e) => e.id === activeEventId);
  }, [events, activeEventId]);

  const venue = useMemo(() => {
    if (!activeEvent) return null;
    return mockVenues.find((v) => v.id === activeEvent.venueId);
  }, [activeEvent]);

  const progressRef = useRef(outdoorProgress);
  useEffect(() => {
    progressRef.current = outdoorProgress;
  }, [outdoorProgress]);

  const startLat = 10.0185;
  const startLng = 76.3012;
  const destLat = activeEvent?.locationDetails?.entranceLat || 10.0261;
  const destLng = activeEvent?.locationDetails?.entranceLng || 76.3083;

  const [currentLat, setCurrentLat] = useState(startLat);
  const [currentLng, setCurrentLng] = useState(startLng);
  const [distanceRemaining, setDistanceRemaining] = useState(haversineDistance(startLat, startLng, destLat, destLng));

  useEffect(() => {
    let timer;
    if (currentPhase === 'outdoor' && progressRef.current < 100) {
      timer = setInterval(() => {
        const current = progressRef.current;
        if (current >= 100) {
          clearInterval(timer);
          return;
        }
        const next = Math.min(current + 2, 100);
        progressRef.current = next;
        setOutdoorProgress(next);

        const fraction = next / 100;
        const newLat = startLat + (destLat - startLat) * fraction;
        const newLng = startLng + (destLng - startLng) * fraction;
        setCurrentLat(newLat);
        setCurrentLng(newLng);

        const dist = haversineDistance(newLat, newLng, destLat, destLng);
        setDistanceRemaining(dist);

        if (dist <= 30) {
          clearInterval(timer);
          setOutdoorStatus("Arrived at building boundary! Handoff active.");
          addNotification("Geofence Boundary Reached. Switching from Outdoor GPS to Indoor Map...", "success");
          setTimeout(() => {
            simulateArrival();
          }, 3000);
        } else if (dist < 100) {
          setOutdoorStatus("Approaching building entrance...");
        } else if (dist < 300) {
          setOutdoorStatus("Walking down Campus Mall corridor...");
        } else {
          setOutdoorStatus("Leaving student union square...");
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [currentPhase, destLat, destLng]);

  if (!activeEvent || !venue) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto text-center mt-20">
          <div className="w-16 h-16 bg-bg-surface-alt rounded-full flex items-center justify-center mx-auto mb-6">
            <Navigation className="w-8 h-8 text-accent" />
          </div>
          <h3 className="font-display font-bold text-3xl text-text-primary mb-4">No Active Navigation</h3>
          <p className="text-text-secondary mb-8">
            You must claim a ticket and click "Launch Navigator" to start your route.
          </p>
          <Link to="/discover" className="inline-flex items-center gap-2 bg-bg-surface border border-border-subtle px-6 py-3 rounded-full text-text-primary hover:text-accent transition-colors">
            Browse Live Events
          </Link>
        </div>
      </PageShell>
    );
  }

  const indoorStepsArray = activeEvent?.locationDetails?.indoorSteps 
    ? activeEvent.locationDetails.indoorSteps.map((s, idx) => ({ step: idx + 1, instruction: s, x: 250, y: 150 })) 
    : venue.waypoints;

  const pathDValue = indoorStepsArray
    .map((wp, idx) => `${idx === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`)
    .join(' ');

  const currentWaypoint = indoorStepsArray[activeIndoorStep] || null;
  const isLastIndoorStep = activeIndoorStep === indoorStepsArray.length - 1;
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

  return (
    <PageShell>
      <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full bg-accent/20 border border-accent/30 text-accent text-xs uppercase tracking-wider font-medium">Phase: {currentPhase.toUpperCase()}</span>
            <span className="px-3 py-1 rounded-full bg-bg-surface border border-border-subtle text-text-primary text-xs uppercase tracking-wider font-medium">{venue.building}</span>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-text-primary tracking-tight">
            Routing to {activeEvent.title}
          </h1>
        </div>
        <button
          onClick={resetNavigation}
          className="px-4 py-2 text-sm font-medium text-text-tertiary hover:text-red-400 bg-bg-surface hover:bg-bg-primary border border-border-subtle rounded-full transition-colors"
        >
          Cancel Navigation
        </button>
      </div>

      {currentPhase === 'outdoor' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-bg-surface border border-border-subtle rounded-3xl h-[500px] relative overflow-hidden z-0">
              <MapContainer center={[(startLat + destLat)/2, (startLng + destLng)/2]} zoom={15} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                <TileLayer
                  attribution='&copy; OpenStreetMap'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[destLat, destLng]} />
                <Marker position={[currentLat, currentLng]} icon={studentIcon} />
                <Polyline positions={[[startLat, startLng], [destLat, destLng]]} pathOptions={{ color: '#FF5A1F', dashArray: '8, 8', weight: 4 }} />
              </MapContainer>

              <div className="absolute bottom-6 left-6 right-6 bg-bg-surface/90 backdrop-blur-md border border-border-subtle p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4 z-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center text-accent">
                    <Compass className="w-6 h-6 animate-spin-slow" />
                  </div>
                  <div>
                    <span className="font-medium text-text-primary block text-lg">{outdoorStatus}</span>
                    <span className="text-sm text-text-secondary">Walking Route Active</span>
                  </div>
                </div>
                <div className="bg-bg-primary border border-border-subtle px-4 py-2 rounded-xl text-text-primary font-mono font-medium">
                  {Math.round(distanceRemaining)}m remaining
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8 space-y-6">
              <h3 className="font-display font-bold text-xl text-text-primary">Outdoor Navigation HUD</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                  <span className="text-text-secondary text-sm">Target Building</span>
                  <span className="text-text-primary font-medium">{venue.building}</span>
                </div>
                <div className="flex justify-between items-center border-b border-border-subtle pb-3">
                  <span className="text-text-secondary text-sm">GPS Distance</span>
                  <span className="text-text-primary font-medium">{Math.round(distanceRemaining)} metres</span>
                </div>
                <div className="flex justify-between items-center pb-3">
                  <span className="text-text-secondary text-sm">Estimated walk</span>
                  <span className="text-text-primary font-medium">{venue.timeEstimation}</span>
                </div>
              </div>

              <button
                onClick={simulateArrival}
                className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-medium py-3 rounded-xl transition-colors"
              >
                Simulate Geofence Arrival
              </button>
            </div>

            <div className="bg-bg-surface-alt border border-border-subtle p-6 rounded-3xl flex gap-4 items-start">
              <Info size={24} className="text-accent shrink-0 mt-1" />
              <p className="text-sm text-text-secondary leading-relaxed">
                The app is simulating your walking coordinates. In a production build, your device's background GPS coordinates will trigger the geofence to switch automatically.
              </p>
            </div>
          </div>
        </div>
      )}

      {(currentPhase === 'indoor' || isNavCompleted) && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-bg-surface border border-border-subtle rounded-3xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-medium text-text-primary">Indoor Waypoint Map (2nd Floor Block B)</h3>
              </div>

              <div className="w-full aspect-[4/3] bg-bg-primary relative overflow-hidden rounded-2xl border border-border-subtle">
                <svg viewBox="0 0 500 350" className="w-full h-full">
                  <rect x="20" y="20" width="460" height="310" fill="none" stroke="#333" strokeWidth="2" />
                  
                  <rect x="50" y="50" width="100" height="250" fill="#222" stroke="#333" strokeWidth="1" />
                  <rect x="150" y="50" width="200" height="100" fill="#222" stroke="#333" strokeWidth="1" />
                  <rect x="350" y="50" width="100" height="250" fill="#222" stroke="#333" strokeWidth="1" />
                  
                  <line x1="150" y1="150" x2="350" y2="150" stroke="#333" strokeWidth="1" />
                  
                  <text x="100" y="295" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif" fill="#666" textAnchor="middle">UNION CAFE</text>
                  <text x="250" y="125" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif" fill="#666" textAnchor="middle">RESEARCH GALLERY</text>
                  <text x="400" y="295" fontSize="10" fontWeight="bold" fontFamily="Inter, sans-serif" fill="#666" textAnchor="middle">{activeEvent.venueId === 'science-hall-a' ? 'AUDITORIUM A' : 'HUB ROOM 202'}</text>

                  <path
                    d={pathDValue}
                    fill="none"
                    stroke="#FF5A1F"
                    strokeWidth="4"
                    strokeDasharray="8,8"
                    opacity="0.5"
                  />

                  {indoorStepsArray.map((wp, idx) => {
                    const isActive = idx === activeIndoorStep && !isNavCompleted;
                    const isCompleted = completedIndoorSteps[idx] || isNavCompleted;
                    
                    return (
                      <g key={wp.step} className="cursor-pointer" onClick={() => setIndoorStep(idx)}>
                        <circle
                          cx={wp.x}
                          cy={wp.y}
                          r={isActive ? "14" : "10"}
                          fill={isActive ? "#FFDB58" : isCompleted ? "#00B67A" : "#151517"}
                          stroke={isActive ? "#0B0B0C" : isCompleted ? "#0B0B0C" : "#444"}
                          strokeWidth="2"
                        />
                        <text
                          x={wp.x}
                          y={wp.y + 3}
                          fontSize="10"
                          fontWeight="bold"
                          fontFamily="Inter, sans-serif"
                          fill={isActive ? "#000" : "#fff"}
                          textAnchor="middle"
                        >
                          {wp.step}
                        </text>
                        
                        {isActive && (
                          <circle
                            cx={wp.x}
                            cy={wp.y}
                            r="24"
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
            </div>
          </div>

          <div className="space-y-6">
            {isNavCompleted ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-bg-surface border border-success rounded-3xl p-8 text-center space-y-6 shadow-[0_0_30px_rgba(0,182,122,0.1)]"
              >
                <div className="w-20 h-20 bg-success/20 rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-success" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-3xl text-text-primary mb-3">You Have Arrived!</h3>
                  <p className="text-text-secondary leading-relaxed">
                    You have reached the venue destination. Present your ticket barcode to the host organizer to scan and check in. Enjoy the event!
                  </p>
                </div>

                <div className="flex flex-col gap-3 pt-4">
                  <button
                    onClick={() => navigate(`/student/rsvp-confirmation/${activeEvent.id}`)}
                    className="w-full bg-accent hover:bg-accent-hover text-accent-contrast font-medium py-4 rounded-xl transition-colors"
                  >
                    Show Ticket Barcode
                  </button>
                  <button
                    onClick={() => {
                      resetNavigation();
                      navigate('/');
                    }}
                    className="w-full bg-bg-surface-alt hover:bg-bg-primary border border-border-subtle text-text-primary font-medium py-4 rounded-xl transition-colors"
                  >
                    Finish Journey
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="bg-bg-surface border border-border-subtle rounded-3xl p-8">
                <h3 className="font-display font-bold text-xl text-text-primary mb-6">Navigation Steps</h3>
                
                <div className="mb-8">
                  <StepTracker 
                    steps={indoorStepsArray}
                    activeStepIndex={activeIndoorStep}
                    completedSteps={completedIndoorSteps}
                    onStepClick={setIndoorStep}
                  />
                </div>

                <div className="flex gap-3 pt-6 border-t border-border-subtle">
                  <button
                    onClick={handlePrevStep}
                    disabled={activeIndoorStep === 0}
                    className="flex-1 py-3 px-4 bg-bg-surface-alt hover:bg-bg-primary disabled:opacity-50 disabled:cursor-not-allowed border border-border-subtle rounded-xl text-text-primary font-medium transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    onClick={handleNextStep}
                    className="flex-[2] py-3 px-4 bg-accent hover:bg-accent-hover text-accent-contrast font-medium rounded-xl flex items-center justify-center gap-2 transition-colors"
                  >
                    {isLastIndoorStep ? "Mark Arrived" : "Next Step"}
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </PageShell>
  );
};

export default Navigate;
