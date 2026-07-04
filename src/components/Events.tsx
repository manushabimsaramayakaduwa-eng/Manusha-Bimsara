import { useState } from 'react';
import { EVENTS_DATA } from '../data';
import { ScoutEvent } from '../types';
import { Calendar, Clock, MapPin, Tag, Users, CheckSquare, Square, Bell, Compass, CalendarDays } from 'lucide-react';

export default function Events() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'camp' | 'meeting' | 'community' | 'competition' | 'ceremony'>('all');
  const [selectedSection, setSelectedSection] = useState<'all' | 'cubs' | 'scouts' | 'rovers'>('all');
  const [selectedEventId, setSelectedEventId] = useState<string | null>('ev-1');

  // RSVP checklist simulation states: Key = eventId, Value = boolean
  const [rsvps, setRsvps] = useState<Record<string, boolean>>({});

  const toggleRsvp = (eventId: string) => {
    setRsvps(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }));
  };

  const filteredEvents = EVENTS_DATA.filter(event => {
    const categoryMatch = selectedCategory === 'all' || event.category === selectedCategory;
    const sectionMatch = selectedSection === 'all' || event.section === 'all' || event.section === selectedSection;
    return categoryMatch && sectionMatch;
  });

  const selectedEvent = EVENTS_DATA.find(e => e.id === selectedEventId) || EVENTS_DATA[0];

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Group Planner</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Upcoming Events & Scout Calendar
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Stay updated with our weekly troop meetings, annual camps, badge training workshops, and social service campaigns.
          </p>
        </div>

        {/* Filters Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
          
          <div className="flex flex-wrap gap-2">
            {(['all', 'camp', 'meeting', 'community', 'competition', 'ceremony'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {cat === 'all' ? 'All Types' : cat}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-bold whitespace-nowrap">For Section:</span>
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
            >
              <option value="all">All Sections</option>
              <option value="cubs">Cub Pack</option>
              <option value="scouts">Scout Troop</option>
              <option value="rovers">Rover Crew</option>
            </select>
          </div>

        </div>

        {/* Grid Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Events List */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center px-1 mb-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                Upcoming Schedule ({filteredEvents.length})
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                Click event to expand details
              </span>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm shadow-xs">
                No events found matching the selected filters.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredEvents.map((event) => {
                  const isSelected = selectedEventId === event.id;
                  const isRsvped = !!rsvps[event.id];

                  return (
                    <div
                      key={event.id}
                      onClick={() => setSelectedEventId(event.id)}
                      id={`event-item-${event.id}`}
                      className={`p-5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col md:flex-row justify-between gap-4 items-start md:items-center relative overflow-hidden ${
                        isSelected
                          ? 'bg-white border-brand-green shadow-md scale-[1.01]'
                          : 'bg-white/70 hover:bg-white border-slate-200 hover:border-brand-green/30 shadow-xs'
                      }`}
                    >
                      {/* Left Block: Date Badge & Text */}
                      <div className="flex items-start gap-4">
                        {/* Beautiful Square Date Box */}
                        <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-16 flex flex-col justify-center shadow-inner shrink-0">
                          <span className="text-[9px] text-brand-green font-bold uppercase tracking-wider leading-none">
                            {new Date(event.date).toLocaleString('default', { month: 'short' })}
                          </span>
                          <span className="text-xl font-black text-slate-800 leading-none mt-1">
                            {new Date(event.date).getDate()}
                          </span>
                        </div>

                        {/* Title and location summary */}
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-[8px] font-bold px-1.5 py-0.2 rounded uppercase ${
                              event.category === 'camp' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' :
                              event.category === 'meeting' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                              event.category === 'community' ? 'bg-blue-500/10 text-blue-600 border border-blue-500/20' :
                              event.category === 'ceremony' ? 'bg-purple-500/10 text-purple-600 border border-purple-500/20' :
                              'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                            }`}>
                              {event.category}
                            </span>
                            <span className="text-[10px] text-slate-400 capitalize">For {event.section}</span>
                          </div>
                          <h4 className="font-sans font-bold text-xs text-brand-green leading-tight">{event.title}</h4>
                          <div className="flex items-center space-x-1 text-[11px] text-slate-500 mt-1.5">
                            <MapPin className="w-3.5 h-3.5 text-slate-400" />
                            <span className="line-clamp-1 font-light">{event.location}</span>
                          </div>
                        </div>
                      </div>

                      {/* Right Block: Actions status */}
                      <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto shrink-0 border-t border-slate-100 md:border-t-0 pt-3 md:pt-0">
                        <div className="flex items-center space-x-1.5 text-slate-500 text-xs">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-[11px] font-mono">{event.time}</span>
                        </div>
                        {isRsvped && (
                          <span className="bg-brand-green/10 text-brand-green text-[9px] font-bold px-2 py-0.5 rounded-full border border-brand-green/20 mt-1 flex items-center gap-1">
                            <span>✓ Going</span>
                          </span>
                        )}
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: Event Details Card with RSVP */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            {selectedEvent ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full filter blur-2xl pointer-events-none" />

                {/* Big Visual Category Ribbon */}
                <div className="flex justify-between items-center border-b border-slate-100 pb-5 mb-5">
                  <div>
                    <span className="text-[9px] font-bold text-brand-green uppercase tracking-widest block">Event Specifics</span>
                    <h3 className="font-sans font-black text-lg text-brand-green leading-tight mt-1">{selectedEvent.title}</h3>
                  </div>
                  <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200 flex items-center justify-center text-xl shrink-0">
                    🔔
                  </div>
                </div>

                {/* Detailed Spec List */}
                <div className="space-y-4 text-xs mb-6">
                  <div className="flex items-center space-x-3 text-slate-700">
                    <CalendarDays className="w-4 h-4 text-brand-green shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Date</span>
                      <span className="font-semibold">{new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-700">
                    <Clock className="w-4 h-4 text-brand-green shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Time & Schedule</span>
                      <span className="font-semibold">{selectedEvent.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-700">
                    <MapPin className="w-4 h-4 text-brand-green shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Venue / Location</span>
                      <span className="font-semibold">{selectedEvent.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 text-slate-700">
                    <Users className="w-4 h-4 text-brand-green shrink-0" />
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase leading-none">Eligible Sections</span>
                      <span className="font-semibold capitalize">{selectedEvent.section === 'all' ? 'Cub Pack, Scout Troop & Rover Crew' : `Only ${selectedEvent.section}`}</span>
                    </div>
                  </div>
                </div>

                {/* Event Description */}
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Description & Requirements:</span>
                  <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 font-light">
                    {selectedEvent.description}
                  </p>
                </div>

                {/* RSVP Check-in form */}
                <div className="border-t border-slate-100 pt-5 text-center">
                  <div className="flex items-center justify-between bg-slate-50 border border-slate-200 p-3.5 rounded-xl">
                    <div className="text-left">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase">RSVP Registration</span>
                      <span className="text-xs font-semibold text-slate-700">Will you attend this event?</span>
                    </div>

                    <button
                      onClick={() => toggleRsvp(selectedEvent.id)}
                      id={`rsvp-btn-${selectedEvent.id}`}
                      className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-2 cursor-pointer ${
                        rsvps[selectedEvent.id]
                          ? 'bg-brand-green text-white hover:bg-brand-green-light shadow-sm'
                          : 'bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                      }`}
                    >
                      {rsvps[selectedEvent.id] ? (
                        <>
                          <CheckSquare className="w-4 h-4" />
                          <span>Going!</span>
                        </>
                      ) : (
                        <>
                          <Square className="w-4 h-4" />
                          <span>Count Me In</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm shadow-xs">
                No event selected. Click on the left list to review schedule logistics.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
