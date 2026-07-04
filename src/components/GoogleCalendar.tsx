import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Clock, 
  MapPin, 
  X,
  FileText,
  User,
  Sparkles
} from 'lucide-react';

interface ScoutEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  category: 'Camp' | 'Meeting' | 'Ceremony' | 'Training';
}

const INITIAL_EVENTS: ScoutEvent[] = [
  {
    id: 'ev-1',
    title: '51st Annual Campfire Ceremonial',
    date: '2026-07-15',
    time: '18:00',
    location: 'CIS Main Grounds',
    description: 'Traditional circle bonfire, badge investitures, and patrol-led musical performances.',
    category: 'Ceremony'
  },
  {
    id: 'ev-2',
    title: 'Pioneering Tower Construction Practice',
    date: '2026-07-18',
    time: '09:00',
    location: 'Viharamahadevi Park',
    description: 'Practical training on lashing, bamboo trestle assembly, and high-altitude load testing.',
    category: 'Training'
  },
  {
    id: 'ev-3',
    title: 'Kapila Jayawardene Outdoor Lecture',
    date: '2026-07-28',
    time: '15:30',
    location: 'Assembly Hall',
    description: 'Advanced safety briefing and maps orientation for the upcoming Colombo District Hike.',
    category: 'Meeting'
  }
];

interface GoogleCalendarProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onAuditLog: (action: string) => void;
}

export default function GoogleCalendar({ currentUser, onAuditLog }: GoogleCalendarProps) {
  const [events, setEvents] = useState<ScoutEvent[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_calendar');
    return saved ? JSON.parse(saved) : INITIAL_EVENTS;
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  // Form States
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('09:00');
  const [location, setLocation] = useState('CIS School Premises');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<'Camp' | 'Meeting' | 'Ceremony' | 'Training'>('Meeting');

  useEffect(() => {
    localStorage.setItem('51_scouttrack_calendar', JSON.stringify(events));
  }, [events]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  // Days in month calculation
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay();

  const daysArray: (number | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  const getEventsForDay = (dayNum: number) => {
    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
    return events.filter(e => e.date === formattedDate);
  };

  const handleDayClick = (dayNum: number) => {
    setSelectedDay(dayNum);
    setIsAddOpen(true);
  };

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedDay) return;

    const formattedDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    const newEvent: ScoutEvent = {
      id: `ev-${Date.now()}`,
      title: title.trim(),
      date: formattedDate,
      time,
      location: location.trim(),
      description: description.trim() || 'Scouting session event.',
      category
    };

    setEvents(prev => [...prev, newEvent]);
    setIsAddOpen(false);

    // Reset Form
    setTitle('');
    setTime('09:00');
    setLocation('CIS School Premises');
    setDescription('');
    setCategory('Meeting');

    const logMsg = `Admin/Leader (${currentUser.fullName}) scheduled a new event: "${newEvent.title}" on ${formattedDate}`;
    onAuditLog(logMsg);
  };

  const handleDeleteEvent = (evId: string, eventTitle: string) => {
    if (!confirm(`Delete calendar event: "${eventTitle}"?`)) return;

    setEvents(prev => prev.filter(e => e.id !== evId));
    onAuditLog(`Admin/Leader (${currentUser.fullName}) cancelled/deleted calendar event: "${eventTitle}"`);
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-gold" />
            <span>Google-style Event Calendar</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Browse structured meetings, campfire assemblies, hikes, and investiture dates. Leaders click any calendar day cell to schedule meetings.
          </p>
        </div>

        {/* Current Month display controls */}
        <div className="flex items-center space-x-2 bg-white border border-slate-200 p-1.5 rounded-xl shrink-0 shadow-xs">
          <button 
            onClick={handlePrevMonth}
            className="p-1.5 hover:bg-slate-50 text-slate-600 rounded cursor-pointer transition"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-black text-brand-green uppercase tracking-wider px-2">
            {monthNames[month]} {year}
          </span>
          <button 
            onClick={handleNextMonth}
            className="p-1.5 hover:bg-slate-50 text-slate-600 rounded cursor-pointer transition"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Grid structure: Left Calendar / Right Event Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Google Calendar Visual grid (8 columns) */}
        <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          {/* Days labels */}
          <div className="grid grid-cols-7 bg-slate-50 border-b border-slate-100 py-3 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          {/* Days Grid Cells */}
          <div className="grid grid-cols-7 border-collapse">
            {daysArray.map((day, idx) => {
              if (day === null) {
                return <div key={`empty-${idx}`} className="h-28 border-b border-r border-slate-100 bg-slate-50/40" />;
              }

              const dayEvents = getEventsForDay(day);
              const isToday = new Date().getDate() === day && new Date().getMonth() === month && new Date().getFullYear() === year;

              return (
                <div 
                  key={`day-${day}`}
                  onClick={() => canEdit && handleDayClick(day)}
                  className={`h-28 border-b border-r border-slate-100 p-1.5 flex flex-col justify-between transition-all relative ${
                    canEdit ? 'hover:bg-brand-gold/5 cursor-pointer' : ''
                  } ${isToday ? 'bg-amber-500/5' : ''}`}
                >
                  {/* Day label */}
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                      isToday ? 'bg-brand-green text-white text-xs' : 'text-slate-700'
                    }`}>
                      {day}
                    </span>
                    {canEdit && (
                      <span className="opacity-0 hover:opacity-100 text-[8px] bg-brand-green/10 text-brand-green px-1 rounded font-black uppercase">
                        + Add
                      </span>
                    )}
                  </div>

                  {/* Day Events listing */}
                  <div className="flex-grow overflow-y-auto space-y-1 mt-1 scrollbar-none max-h-[70px]">
                    {dayEvents.map(ev => {
                      let badgeColor = 'bg-brand-green/10 text-brand-green border-brand-green/20';
                      if (ev.category === 'Camp') badgeColor = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
                      if (ev.category === 'Ceremony') badgeColor = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
                      if (ev.category === 'Training') badgeColor = 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';

                      return (
                        <div 
                          key={ev.id}
                          title={`${ev.title} (${ev.time})`}
                          className={`text-[8px] leading-tight font-semibold px-1 py-0.5 rounded border ${badgeColor} truncate`}
                        >
                          {ev.title}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Calendar Feed Side Panel (4 columns) */}
        <div className="lg:col-span-4 space-y-4">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
            Featured Upcoming Events
          </span>

          <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
            {events.map(ev => (
              <div 
                key={ev.id}
                className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs relative hover:border-brand-gold/30 transition text-left"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${
                      ev.category === 'Camp' ? 'bg-amber-500/10 text-amber-500' :
                      ev.category === 'Ceremony' ? 'bg-rose-500/10 text-rose-500' :
                      ev.category === 'Training' ? 'bg-indigo-500/10 text-indigo-500' :
                      'bg-brand-green/10 text-brand-green'
                    }`}>
                      {ev.category}
                    </span>

                    {canEdit && (
                      <button
                        onClick={() => handleDeleteEvent(ev.id, ev.title)}
                        className="text-slate-400 hover:text-rose-600 p-1 hover:bg-slate-50 rounded transition cursor-pointer"
                        title="Cancel Event"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  <h4 className="font-sans font-black text-xs text-slate-800 leading-snug">
                    {ev.title}
                  </h4>

                  <p className="text-[10px] text-slate-500 leading-normal font-light">
                    {ev.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100 grid grid-cols-2 gap-2 text-[9px] text-slate-400 font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-brand-gold" />
                      {ev.date} @ {ev.time}
                    </span>
                    <span className="flex items-center gap-1 truncate" title={ev.location}>
                      <MapPin className="w-3 h-3 text-brand-green" />
                      {ev.location}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {events.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-xl p-8 text-center text-slate-400">
                <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                <p className="text-xs">No upcoming calendar events scheduled.</p>
              </div>
            )}
          </div>
        </div>

      </div>

      {/* --- ADD EVENT MODAL DIALOG --- */}
      {isAddOpen && selectedDay && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-sans font-black text-base text-brand-green flex items-center gap-1.5">
                <Calendar className="w-5 h-5 text-brand-gold" />
                <span>Schedule Event on Day {selectedDay}</span>
              </h3>
              <button 
                onClick={() => setIsAddOpen(false)}
                className="p-1 hover:bg-slate-100 text-slate-400 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddEvent} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Event Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Saturday Drills & Lashings"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Start Time*</label>
                  <input
                    type="time"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Category*</label>
                  <select
                    value={category}
                    onChange={(e: any) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                  >
                    <option value="Meeting">Meeting Session</option>
                    <option value="Camp">Camp / Hike</option>
                    <option value="Ceremony">Ceremony / Court of Honor</option>
                    <option value="Training">Skill Training</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Event Location*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CIS Main Grounds"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Short Description</label>
                <textarea
                  placeholder="Summarize the scheduled scout action program..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light"
                >
                  Schedule Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
