import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import PageShell from '../../components/layout/PageShell';
import { RsvpContext } from '../../context/RsvpContext';
import ImageUploadZone from '../../components/ui/ImageUploadZone';
import { ArrowLeft, Save, Plus, X, MapPin } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

function LocationPicker({ position, setPosition }) {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });
  return position ? <Marker position={position} draggable={true} eventHandlers={{ dragend: (e) => setPosition(e.target.getLatLng()) }} /> : null;
}

const AdminEventForm = () => {
  const navigate = useNavigate();
  const { addEvent } = useContext(RsvpContext);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-07-10');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [category, setCategory] = useState('Tech');
  const [faculty, setFaculty] = useState('Science');
  const [seatsTotal, setSeatsTotal] = useState(50);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  const [scheduleItems, setScheduleItems] = useState([
    { time: '10:00 AM', title: 'Opening Remarks', desc: 'Introductions and startup briefing.' },
    { time: '11:00 AM', title: 'Main Panel Session', desc: 'Speaker presentations and open Q&A.' }
  ]);

  const [mapPosition, setMapPosition] = useState({ lat: 10.026100, lng: 76.308300 });
  const [indoorSteps, setIndoorSteps] = useState([
    'Enter main entrance',
    'Turn left at reception desk',
    'Take the staircase on the right to Floor 2',
    'Walk to the end of the corridor',
    'Room 204 is the third door on the right'
  ]);

  const handleAddIndoorStep = () => {
    setIndoorSteps((prev) => [...prev, '']);
  };

  const handleRemoveIndoorStep = (idx) => {
    setIndoorSteps((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleIndoorStepChange = (idx, value) => {
    setIndoorSteps((prev) =>
      prev.map((step, i) => (i === idx ? value : step))
    );
  };

  const handleAddScheduleRow = () => {
    setScheduleItems((prev) => [
      ...prev,
      { time: '12:00 PM', title: 'New Session Slot', desc: 'Describe session details here.' }
    ]);
  };

  const handleRemoveScheduleRow = (idx) => {
    setScheduleItems((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleScheduleChange = (idx, field, value) => {
    setScheduleItems((prev) =>
      prev.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !date || !time) return;

    const randomCovers = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop"
    ];
    const finalCover = coverImage || randomCovers[Math.floor(Math.random() * randomCovers.length)];

    const newEvent = {
      id: `evt-${Date.now()}`,
      title,
      coverImage: finalCover,
      date,
      time,
      category,
      faculty,
      seatsTotal: parseInt(seatsTotal),
      seatsAvailable: parseInt(seatsTotal),
      waitlistCount: 0,
      description,
      schedule: scheduleItems,
      locationDetails: {
        entranceLat: mapPosition.lat,
        entranceLng: mapPosition.lng,
        indoorSteps
      }
    };

    addEvent(newEvent);
    navigate('/admin');
  };

  return (
    <PageShell>
      <div className="mb-6 flex">
        <Link
          to="/admin"
          className="inline-flex items-center gap-2 text-sm text-text-tertiary hover:text-accent transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Dashboard
        </Link>
      </div>

      <div className="mb-12">
        <h1 className="font-display font-bold text-4xl text-text-primary tracking-tight mb-2">
          Create New Event
        </h1>
        <p className="text-text-secondary">Draft a new event to publish on the platform.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-bg-surface border border-border-subtle rounded-3xl p-8 md:p-10 max-w-4xl"
      >
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Event Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Systems Workshop"
              className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Time Schedule</label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 10:00 AM - 01:00 PM"
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                {['Tech', 'Sports', 'Academic', 'Arts'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Faculty</label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
              >
                {['Science', 'Medicine', 'Engineering', 'All Faculties'].map((fac) => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-2">Total Seat Capacity</label>
              <input
                type="number"
                value={seatsTotal}
                onChange={(e) => setSeatsTotal(e.target.value)}
                className="w-full bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors"
                required
                min="1"
              />
            </div>
          </div>

          <div>
            <ImageUploadZone 
              label="Cover Image" 
              onUpload={setCoverImage} 
              previewUrl={coverImage} 
              onClear={() => setCoverImage('')} 
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">Event Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of the event..."
              className="w-full h-32 bg-bg-primary border border-border-subtle rounded-xl px-4 py-3 text-text-primary focus:outline-none focus:border-accent transition-colors resize-none"
            />
          </div>

          <div className="border-t border-border-subtle pt-8">
            <div className="flex justify-between items-center mb-6">
              <label className="block text-sm font-medium text-text-primary">Event Schedule</label>
              <button
                type="button"
                onClick={handleAddScheduleRow}
                className="flex items-center gap-1 text-sm font-medium bg-bg-surface-alt border border-border-subtle hover:border-accent text-text-primary px-3 py-1.5 rounded-full transition-colors"
              >
                <Plus size={14} /> Add Session
              </button>
            </div>

            <div className="space-y-4">
              {scheduleItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start bg-bg-primary border border-border-subtle p-4 rounded-xl relative">
                  {scheduleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleRow(idx)}
                      className="absolute top-4 right-4 text-text-tertiary hover:text-red-500 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  )}

                  <div className="w-1/4">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                      placeholder="Time"
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  
                  <div className="grow space-y-3 pr-8">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                      placeholder="Session Title"
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent transition-colors font-medium"
                    />
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleScheduleChange(idx, 'desc', e.target.value)}
                      placeholder="Session Description"
                      className="w-full bg-bg-surface border border-border-subtle rounded-lg px-3 py-2 text-sm text-text-secondary focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-subtle pt-8">
            <h2 className="font-display font-bold text-2xl text-text-primary mb-4">Location Settings</h2>
            
            <div className="bg-bg-primary border border-border-subtle rounded-xl overflow-hidden mb-6">
              <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-bg-surface">
                <span className="font-medium text-text-primary flex items-center gap-2">
                  <MapPin size={18} className="text-accent" />
                  Building Entrance Pin
                </span>
                <span className="text-sm text-text-secondary font-mono">
                  {mapPosition.lat.toFixed(6)}, {mapPosition.lng.toFixed(6)}
                </span>
              </div>
              <div className="h-80 w-full relative z-0">
                <MapContainer center={[mapPosition.lat, mapPosition.lng]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                  <TileLayer
                    attribution='&copy; OpenStreetMap'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <LocationPicker position={mapPosition} setPosition={setMapPosition} />
                </MapContainer>
              </div>
              <div className="p-4 text-sm text-text-secondary">
                Click anywhere on the map to set the entrance marker. Drag the marker to fine-tune its position.
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-text-primary">Indoor Directions</label>
                <button
                  type="button"
                  onClick={handleAddIndoorStep}
                  className="flex items-center gap-1 text-sm font-medium bg-bg-surface-alt border border-border-subtle hover:border-accent text-text-primary px-3 py-1.5 rounded-full transition-colors"
                >
                  <Plus size={14} /> Add Step
                </button>
              </div>

              {indoorSteps.map((step, idx) => (
                <div key={idx} className="flex gap-4 items-center bg-bg-primary border border-border-subtle p-3 rounded-xl">
                  <span className="font-bold text-text-tertiary w-6 text-right">{idx + 1}.</span>
                  <input
                    type="text"
                    value={step}
                    onChange={(e) => handleIndoorStepChange(idx, e.target.value)}
                    placeholder="Describe the step..."
                    className="grow bg-transparent border-none text-sm text-text-primary focus:outline-none"
                  />
                  {indoorSteps.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveIndoorStep(idx)}
                      className="text-text-tertiary hover:text-red-500 transition-colors p-1"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-border-subtle pt-8 flex justify-end">
            <button
              type="submit"
              className="bg-accent hover:bg-accent-hover text-accent-contrast font-medium px-8 py-3 rounded-full flex items-center justify-center gap-2 transition-colors w-full sm:w-auto"
            >
              <Save size={18} />
              Publish Event
            </button>
          </div>
        </form>
      </motion.div>
    </PageShell>
  );
};

export default AdminEventForm;
