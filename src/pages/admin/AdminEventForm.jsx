import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import PageShell from '../../components/layout/PageShell';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { RsvpContext } from '../../context/RsvpContext';
import { ArrowLeft, Save, Plus, X } from 'lucide-react';

const AdminEventForm = () => {
  const navigate = useNavigate();
  const { addEvent } = useContext(RsvpContext);

  // Form states
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('2026-07-10');
  const [time, setTime] = useState('10:00 AM - 01:00 PM');
  const [category, setCategory] = useState('Tech');
  const [faculty, setFaculty] = useState('Science');
  const [seatsTotal, setSeatsTotal] = useState(50);
  const [description, setDescription] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  // Custom mock schedules
  const [scheduleItems, setScheduleItems] = useState([
    { time: '10:00 AM', title: 'Opening Remarks', desc: 'Introductions and startup briefing.' },
    { time: '11:00 AM', title: 'Main Panel Session', desc: 'Speaker presentations and open Q&A.' }
  ]);

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

    // Build random mockup cover image if not provided
    const randomCovers = [
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?q=80&w=600&auto=format&fit=crop"
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
      description,
      schedule: scheduleItems
    };

    addEvent(newEvent);
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

      {/* Main Title */}
      <div className="mb-8 text-left border-b-3 border-black pb-4 select-none">
        <Badge variant="accent" className="mb-2">Admin Creator</Badge>
        <h1 className="font-display font-black text-3xl md:text-4xl uppercase tracking-tight">
          Create New Event
        </h1>
      </div>

      {/* Form Card */}
      <Card variant="white" shadowSize="medium" className="p-6 md:p-8 max-w-3xl mx-auto text-left select-none">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Title */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E.G. WEB REBELLION CON 2026"
              className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
              required
            />
          </div>

          {/* Grid fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Date *
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
                required
              />
            </div>
            
            {/* Time slot */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Time Schedule *
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="E.G. 10:00 AM - 01:00 PM"
                className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
                required
              />
            </div>
          </div>

          {/* Category, Faculty, Seats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Category */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
              >
                {['Tech', 'Sports', 'Academic', 'Arts'].map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Faculty */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Faculty
              </label>
              <select
                value={faculty}
                onChange={(e) => setFaculty(e.target.value)}
                className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
              >
                {['Science', 'Medicine', 'Engineering', 'All Faculties'].map((fac) => (
                  <option key={fac} value={fac}>{fac}</option>
                ))}
              </select>
            </div>

            {/* Seats Total */}
            <div>
              <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
                Total Seat Capacity *
              </label>
              <input
                type="number"
                value={seatsTotal}
                onChange={(e) => setSeatsTotal(e.target.value)}
                className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
                required
                min="1"
              />
            </div>
          </div>

          {/* Cover image url */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Cover Image URL (Optional)
            </label>
            <input
              type="url"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="HTTP://IMAGES.UNSPLASH.COM/PHOTO..."
              className="w-full bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-black uppercase tracking-wider text-black mb-2">
              Event Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe event session requirements..."
              className="w-full h-32 bg-white text-black border-3 border-black py-3 px-4 font-display font-bold text-xs uppercase tracking-wider outline-none focus:bg-pastel-yellow/15 resize-none"
            />
          </div>

          {/* Schedule Timelines Form Array */}
          <div className="border-t-2 border-black/10 pt-6">
            <div className="flex justify-between items-center mb-4">
              <label className="block text-xs font-black uppercase tracking-wider text-black">
                Event Schedule Timeline
              </label>
              <button
                type="button"
                onClick={handleAddScheduleRow}
                className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-black text-white px-2 py-1 hover:bg-accent-yellow hover:text-black transition-colors"
              >
                <Plus size={10} />
                Add Session
              </button>
            </div>

            <div className="space-y-4">
              {scheduleItems.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-start border-2 border-black p-3 bg-black/5 relative">
                  {scheduleItems.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveScheduleRow(idx)}
                      className="absolute top-2 right-2 text-black/55 hover:text-red-500"
                    >
                      <X size={14} />
                    </button>
                  )}

                  <div className="w-1/4">
                    <input
                      type="text"
                      value={item.time}
                      onChange={(e) => handleScheduleChange(idx, 'time', e.target.value)}
                      placeholder="Time"
                      className="w-full bg-white text-black border-2 border-black p-1.5 font-mono text-xxs font-bold uppercase outline-none"
                    />
                  </div>
                  
                  <div className="grow space-y-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => handleScheduleChange(idx, 'title', e.target.value)}
                      placeholder="Session Title"
                      className="w-full bg-white text-black border-2 border-black p-1.5 font-display text-xxs font-bold uppercase outline-none"
                    />
                    <input
                      type="text"
                      value={item.desc}
                      onChange={(e) => handleScheduleChange(idx, 'desc', e.target.value)}
                      placeholder="Session Description"
                      className="w-full bg-white text-black border-2 border-black p-1.5 font-display text-xxs font-semibold uppercase outline-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div className="border-t-2 border-black/10 pt-6 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              className="w-full sm:w-auto"
            >
              <Save size={16} />
              Publish Event Session
            </Button>
          </div>

        </form>
      </Card>
    </PageShell>
  );
};

export default AdminEventForm;
