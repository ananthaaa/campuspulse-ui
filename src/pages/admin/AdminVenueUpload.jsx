import React, { useState, useContext, useMemo } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { RsvpContext } from '../../context/RsvpContext';
import mockVenues from '../../data/venues.json';
import { ArrowLeft, Upload, Plus, Trash2, Save, MapPin } from 'lucide-react';

const AdminVenueUpload = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { events } = useContext(RsvpContext);

  const eventId = searchParams.get('eventId') || (events[0]?.id || '');
  const [selectedEventId, setSelectedEventId] = useState(eventId);

  const selectedEvent = useMemo(() => {
    return events.find((e) => e.id === selectedEventId);
  }, [events, selectedEventId]);

  // Find initial venue waypoints
  const initialVenue = useMemo(() => {
    if (!selectedEvent) return null;
    return mockVenues.find((v) => v.id === selectedEvent.venueId) || mockVenues[0];
  }, [selectedEvent]);

  // Editor states
  const [waypoints, setWaypoints] = useState(() => {
    return initialVenue ? initialVenue.waypoints : [];
  });

  const [building, setBuilding] = useState(() => {
    return initialVenue ? initialVenue.building : 'Science Building Block B';
  });

  // SVG Mock Upload preview state
  const [isUploaded, setIsUploaded] = useState(true);
  const [fileName, setFileName] = useState('floorplan_sci_lvl2.svg');

  // New Waypoint state
  const [newInstruction, setNewInstruction] = useState('');
  const [newDetails, setNewDetails] = useState('');
  const [newX, setNewX] = useState(150);
  const [newY, setNewY] = useState(150);

  const handleEventChange = (e) => {
    const evId = e.target.value;
    setSelectedEventId(evId);
    const ev = events.find((item) => item.id === evId);
    const ven = mockVenues.find((v) => v.id === ev?.venueId) || mockVenues[0];
    if (ven) {
      setWaypoints(ven.waypoints);
      setBuilding(ven.building);
    }
  };

  const handleAddWaypoint = () => {
    if (!newInstruction) return;

    const nextStep = waypoints.length + 1;
    const newWp = {
      step: nextStep,
      instruction: newInstruction,
      details: newDetails,
      x: parseInt(newX),
      y: parseInt(newY)
    };

    setWaypoints((prev) => [...prev, newWp]);
    setNewInstruction('');
    setNewDetails('');
    setNewX(150);
    setNewY(150);
  };

  const handleDeleteWaypoint = (stepNum) => {
    setWaypoints((prev) =>
      prev
        .filter((wp) => wp.step !== stepNum)
        .map((wp, idx) => ({ ...wp, step: idx + 1 }))
    );
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
      setIsUploaded(true);
    }
  };

  const handleSaveConfiguration = (e) => {
    e.preventDefault();
    // Update local state / notify user
    alert(`Configuration saved for venue: ${initialVenue?.name || 'Default'}. Waypoints updated in-memory.`);
    navigate('/admin');
  };

  return (
    <PageShell>
      {/* Back Button */}
      <div className="mb-6 flex">
        <Link
          to="/admin"
          className="flex items-center gap-1 text-xs font-black uppercase tracking-wider hover:text-accent-yellow transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </Link>
      </div>

      {/* Title Header */}
      <div className="mb-8 text-left border-b-3 border-black pb-4 select-none">
        <Badge variant="accent" className="mb-2">Admin Workspace</Badge>
        <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight">
          Configure Waypoints & Floor Plan
        </h1>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left select-none">
        
        {/* Left 2 Columns: Map preview & Upload */}
        <div className="lg:col-span-2 space-y-6">
          {/* Target selector */}
          <Card variant="white" shadowSize="small" className="p-4 flex flex-col md:flex-row md:items-center gap-4">
            <div className="grow">
              <label className="block text-xxs font-black uppercase tracking-wider text-black/50 mb-1">
                Configure Venue for Event:
              </label>
              <select
                value={selectedEventId}
                onChange={handleEventChange}
                className="w-full bg-white text-black border-2 border-black py-2 px-3 font-display font-bold text-xs uppercase tracking-wider outline-none neo-shadow-sm"
              >
                {events.map((evt) => (
                  <option key={evt.id} value={evt.id}>
                    {evt.title} ({evt.faculty})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-1/3">
              <label className="block text-xxs font-black uppercase tracking-wider text-black/50 mb-1">
                Target Building:
              </label>
              <input
                type="text"
                value={building}
                onChange={(e) => setBuilding(e.target.value)}
                className="w-full bg-white text-black border-2 border-black py-2 px-3 font-display font-bold text-xs uppercase tracking-wider outline-none"
              />
            </div>
          </Card>

          {/* SVG Map Canvas Upload */}
          <Card variant="white" shadowSize="medium" className="p-6 space-y-6">
            <h2 className="font-display font-black text-lg uppercase">
              1. Floor Plan Vector Upload (SVG Only)
            </h2>

            {isUploaded ? (
              <div className="border-3 border-black p-4 bg-pastel-mint/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white border-2 border-black flex items-center justify-center font-display font-black text-xs">
                    SVG
                  </div>
                  <div>
                    <span className="font-display font-black text-xs uppercase block">{fileName}</span>
                    <span className="text-xxs font-bold text-black/60 uppercase">Vector map loaded successfully</span>
                  </div>
                </div>
                
                <label className="py-1.5 px-3 bg-white border-2 border-black font-display font-bold text-xs uppercase cursor-pointer hover:bg-black hover:text-white transition-colors">
                  Change File
                  <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            ) : (
              <div className="border-3 border-dashed border-black/40 p-8 text-center bg-black/5 hover:bg-black/10 transition-colors">
                <Upload className="w-10 h-10 text-black/40 mx-auto mb-3" />
                <span className="font-display font-black text-sm uppercase block mb-1">Upload Venue Floor Plan</span>
                <span className="text-xxs font-bold text-black/60 uppercase block mb-4">SVG format only, max size 1MB</span>
                <label className="py-2 px-4 bg-black text-white font-display font-bold text-xs uppercase cursor-pointer hover:bg-accent-yellow hover:text-black transition-colors shadow-[2px_2px_0px_0px_#000]">
                  Select File
                  <input type="file" accept=".svg" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>
            )}

            {/* SVG Interactive coordinates grid preview */}
            <div className="border-2 border-black aspect-[4/3] w-full max-w-md mx-auto bg-[#FCFAF7] relative overflow-hidden flex items-center justify-center">
              <svg className="w-full h-full" viewBox="0 0 500 350">
                {/* Dotted helper lines grid */}
                {[...Array(7)].map((_, i) => (
                  <line key={i} x1={(i + 1) * 60} y1="0" x2={(i + 1) * 60} y2="350" stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.1" />
                ))}
                {[...Array(5)].map((_, i) => (
                  <line key={i} x1="0" y1={(i + 1) * 60} x2="500" y2={(i + 1) * 60} stroke="#000" strokeWidth="0.5" strokeDasharray="2,2" opacity="0.1" />
                ))}

                {/* Outer borders */}
                <rect x="15" y="15" width="470" height="320" fill="none" stroke="#000" strokeWidth="3" />
                
                {/* Corridors */}
                <rect x="50" y="50" width="100" height="250" fill="#EAE5E0" stroke="#000" strokeWidth="2" opacity="0.7" />
                <rect x="150" y="50" width="200" height="100" fill="#EAE5E0" stroke="#000" strokeWidth="2" opacity="0.7" />
                <rect x="350" y="50" width="100" height="250" fill="#EAE5E0" stroke="#000" strokeWidth="2" opacity="0.7" />

                {/* Connect lines */}
                {waypoints.length > 1 && (
                  <path
                    d={waypoints.map((wp, i) => `${i === 0 ? 'M' : 'L'} ${wp.x} ${wp.y}`).join(' ')}
                    fill="none"
                    stroke="#FF5A1F"
                    strokeWidth="3"
                    strokeDasharray="4,4"
                  />
                )}

                {/* Render nodes */}
                {waypoints.map((wp) => (
                  <g key={wp.step}>
                    <circle cx={wp.x} cy={wp.y} r="8" fill="#FFDB58" stroke="#000" strokeWidth="2" />
                    <text x={wp.x} y={wp.y + 3} fontSize="9" fontWeight="black" fontFamily="Epilogue" fill="#000" textAnchor="middle">{wp.step}</text>
                  </g>
                ))}
              </svg>
            </div>
          </Card>
        </div>

        {/* Right 1 Column: Waypoint list editor */}
        <div className="space-y-6">
          <Card variant="white" shadowSize="medium" className="p-6 space-y-6">
            <h2 className="font-display font-black text-lg uppercase border-b border-black/10 pb-2">
              2. Waypoint Steps
            </h2>

            {/* List */}
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {waypoints.map((wp) => (
                <div key={wp.step} className="flex justify-between items-center border-2 border-black p-3 bg-black/5 font-display font-bold text-xxs uppercase tracking-wider text-black/80">
                  <div className="grow space-y-1">
                    <span className="font-black text-xs text-black block leading-none">
                      Step {wp.step}: {wp.instruction}
                    </span>
                    <span className="text-black/50 block">Coords: {wp.x}px X, {wp.y}px Y</span>
                  </div>
                  <button
                    onClick={() => handleDeleteWaypoint(wp.step)}
                    className="text-black/60 hover:text-red-500 ml-2"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add waypoint form */}
            <div className="border-t border-black/10 pt-4 space-y-3">
              <span className="block text-xs font-black uppercase tracking-wider text-black/50">
                Add Waypoint Step
              </span>
              
              <input
                type="text"
                value={newInstruction}
                onChange={(e) => setNewInstruction(e.target.value)}
                placeholder="Step instruction (e.g. Turn left)"
                className="w-full bg-white text-black border-2 border-black p-2 font-display text-xxs font-bold uppercase outline-none"
              />
              <input
                type="text"
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                placeholder="Details (e.g. Near main board)"
                className="w-full bg-white text-black border-2 border-black p-2 font-display text-xxs font-bold uppercase outline-none"
              />
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] font-black uppercase text-black/50 block mb-1">X Coord (px)</label>
                  <input
                    type="number"
                    value={newX}
                    onChange={(e) => setNewX(e.target.value)}
                    className="w-full bg-white text-black border-2 border-black p-1.5 font-mono text-xxs font-bold outline-none"
                    min="20"
                    max="480"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-black/50 block mb-1">Y Coord (px)</label>
                  <input
                    type="number"
                    value={newY}
                    onChange={(e) => setNewY(e.target.value)}
                    className="w-full bg-white text-black border-2 border-black p-1.5 font-mono text-xxs font-bold outline-none"
                    min="20"
                    max="330"
                  />
                </div>
              </div>

              <Button
                onClick={handleAddWaypoint}
                variant="accent"
                className="w-full py-2 text-xxs"
              >
                <Plus size={12} />
                Add Waypoint Step
              </Button>
            </div>

            {/* Save Button */}
            <div className="border-t border-black/10 pt-4">
              <Button
                onClick={handleSaveConfiguration}
                variant="primary"
                className="w-full"
              >
                <Save size={14} />
                Save Venue Waypoints
              </Button>
            </div>

          </Card>
        </div>
      </div>
    </PageShell>
  );
};

export default AdminVenueUpload;
