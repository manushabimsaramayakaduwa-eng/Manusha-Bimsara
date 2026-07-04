import { useState, useEffect } from 'react';
import { BADGES_DATA } from '../data';
import { Badge } from '../types';
import { Search, Filter, CheckSquare, Square, Award, Compass, Sparkles, BookOpen } from 'lucide-react';

export default function BadgeTracker() {
  const [activeSectionFilter, setActiveSectionFilter] = useState<'all' | 'cubs' | 'scouts' | 'rovers'>('scouts');
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<'all' | 'efficiency' | 'merit' | 'award'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // Requirement progress states: Key = badgeId_requirementIndex, Value = boolean
  const [checkedRequirements, setCheckedRequirements] = useState<Record<string, boolean>>({});

  // Load from local storage
  useEffect(() => {
    const saved = localStorage.getItem('scout_badge_requirements');
    if (saved) {
      try {
        setCheckedRequirements(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading badge state', e);
      }
    }
  }, []);

  // Save to local storage
  const toggleRequirement = (badgeId: string, idx: number) => {
    const key = `${badgeId}_${idx}`;
    const newState = {
      ...checkedRequirements,
      [key]: !checkedRequirements[key]
    };
    setCheckedRequirements(newState);
    localStorage.setItem('scout_badge_requirements', JSON.stringify(newState));
  };

  // Check if a badge is fully completed (all requirements checked)
  const isBadgeCompleted = (badge: Badge) => {
    if (!badge.requirements || badge.requirements.length === 0) return false;
    return badge.requirements.every((_, idx) => checkedRequirements[`${badge.id}_${idx}`]);
  };

  // Helper to count completed requirements for a badge
  const getBadgeProgress = (badge: Badge) => {
    const total = badge.requirements.length;
    const completed = badge.requirements.filter((_, idx) => checkedRequirements[`${badge.id}_${idx}`]).length;
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // Filter badges
  const filteredBadges = BADGES_DATA.filter((badge) => {
    const sectionMatch = activeSectionFilter === 'all' || badge.section === activeSectionFilter;
    const categoryMatch = activeCategoryFilter === 'all' || badge.category === activeCategoryFilter;
    const searchMatch = badge.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        badge.description.toLowerCase().includes(searchQuery.toLowerCase());
    return sectionMatch && categoryMatch && searchMatch;
  });

  // Set default selected badge on load/filter changes
  useEffect(() => {
    if (filteredBadges.length > 0) {
      // Keep selected if still in list, else set first
      const exists = filteredBadges.some(b => b.id === selectedBadge?.id);
      if (!exists) {
        setSelectedBadge(filteredBadges[0]);
      }
    } else {
      setSelectedBadge(null);
    }
  }, [activeSectionFilter, activeCategoryFilter, searchQuery]);

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center space-x-1.5 bg-brand-gold/15 border border-brand-gold/30 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <Award className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Interactive Tool</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Interactive Badge Explorer
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Explore Cub Scout stars, Scout merit badges, and the prestigious President's Scout Award. 
            Check off requirements below to track your virtual scouting progress!
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
          
          {/* Section Filter (Cubs / Scouts / Rovers) */}
          <div className="flex flex-wrap gap-1.5">
            {(['all', 'cubs', 'scouts', 'rovers'] as const).map((sec) => (
              <button
                key={sec}
                onClick={() => setActiveSectionFilter(sec)}
                className={`px-3 py-2 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeSectionFilter === sec
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                {sec === 'all' ? 'All Sections' : sec === 'cubs' ? '🧸 Cub Scouts' : sec === 'scouts' ? '⚜️ Boy & Girl Scouts' : '🧭 Rover Scouts'}
              </button>
            ))}
          </div>

          {/* Category and Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search badges..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full sm:w-48 bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-4 py-2 text-xs text-slate-700 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white"
              />
            </div>

            <select
              value={activeCategoryFilter}
              onChange={(e) => setActiveCategoryFilter(e.target.value as any)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
            >
              <option value="all">All Badge Categories</option>
              <option value="efficiency">Efficiency Stars / Ranks</option>
              <option value="merit">Merit Badges</option>
              <option value="award">Special Awards</option>
            </select>
          </div>

        </div>

        {/* Main Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Badge Cards Grid */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex justify-between items-center px-1">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold">
                Available Badges ({filteredBadges.length})
              </p>
              <p className="text-[10px] text-slate-400 font-mono">
                Click badge to view & track requirements
              </p>
            </div>

            {filteredBadges.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm shadow-xs">
                No badges found matching the selected filters. Try broadening your criteria.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filteredBadges.map((badge) => {
                  const isSelected = selectedBadge?.id === badge.id;
                  const isDone = isBadgeCompleted(badge);
                  const progress = getBadgeProgress(badge);

                  return (
                    <div
                      key={badge.id}
                      onClick={() => setSelectedBadge(badge)}
                      id={`badge-card-${badge.id}`}
                      className={`p-4 rounded-xl border cursor-pointer transition-all duration-200 text-left relative flex flex-col justify-between h-36 ${
                        isSelected
                          ? 'bg-white border-brand-green shadow-md scale-[1.01]'
                          : 'bg-white/70 hover:bg-white border-slate-200 hover:border-brand-green/30 shadow-xs'
                      }`}
                    >
                      {/* Completed Ribbon/Indicator */}
                      {isDone && (
                        <span className="absolute top-3 right-3 bg-brand-gold text-brand-green text-[9px] font-black px-1.5 py-0.5 rounded shadow-xs">
                          EARNED ⚜️
                        </span>
                      )}

                      <div>
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-2xl shrink-0">{badge.icon}</span>
                          <div>
                            <h4 className="font-sans font-bold text-xs text-brand-green leading-tight">{badge.name}</h4>
                            <span className="text-[9px] text-slate-400 capitalize font-medium">{badge.category} • {badge.section}</span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed font-light">{badge.description}</p>
                      </div>

                      {/* Progress Bar */}
                      <div className="border-t border-slate-100 pt-2 mt-2">
                        <div className="flex justify-between text-[9px] text-slate-400 font-mono mb-1">
                          <span>Progress</span>
                          <span>{progress.completed}/{progress.total} Requirements ({progress.percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/50">
                          <div
                            className={`h-full transition-all duration-300 ${isDone ? 'bg-brand-green' : 'bg-brand-gold'}`}
                            style={{ width: `${progress.percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right: Selected Badge Details & Checklists */}
          <div className="lg:col-span-5 lg:sticky lg:top-20">
            {selectedBadge ? (
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-md relative overflow-hidden">
                {/* Background ambient lighting */}
                <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-full filter blur-2xl pointer-events-none ${
                  isBadgeCompleted(selectedBadge) ? 'bg-brand-green' : 'bg-brand-gold'
                }`} />

                {/* Badge Banner Header */}
                <div className="flex items-start space-x-4 border-b border-slate-100 pb-5 mb-5">
                  <div className={`p-4 rounded-xl flex items-center justify-center text-4xl shadow-inner border shrink-0 ${
                    isBadgeCompleted(selectedBadge) 
                      ? 'bg-brand-green/10 border-brand-green/25 text-brand-green' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}>
                    {selectedBadge.icon}
                  </div>
                  <div className="space-y-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border tracking-wide uppercase ${
                      selectedBadge.section === 'cubs' ? 'bg-brand-gold/10 text-brand-green border-brand-gold/20' :
                      selectedBadge.section === 'scouts' ? 'bg-brand-green/10 text-brand-green border-brand-green/20' :
                      'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {selectedBadge.section} section
                    </span>
                    <h3 className="font-sans font-black text-lg text-brand-green leading-tight">{selectedBadge.name}</h3>
                    <p className="text-xs text-slate-500 italic">Category: <span className="capitalize font-semibold text-slate-700">{selectedBadge.category} Badge</span></p>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mb-6 bg-slate-50 p-3 rounded-lg border border-slate-200/60 font-light">
                  {selectedBadge.description}
                </p>

                {/* Requirements Checklist Header */}
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-brand-green" />
                    <span>Official Requirements</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    Check off to complete
                  </span>
                </div>

                {/* Checklist list */}
                <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                  {selectedBadge.requirements.map((req, idx) => {
                    const isChecked = !!checkedRequirements[`${selectedBadge.id}_${idx}`];
                    return (
                      <div
                        key={idx}
                        onClick={() => toggleRequirement(selectedBadge.id, idx)}
                        className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-brand-green/5 border-brand-green/20 text-slate-800'
                            : 'bg-slate-50 hover:bg-slate-100 border-slate-200/80 text-slate-700'
                        }`}
                      >
                        <button className="shrink-0 text-brand-green mt-0.5">
                          {isChecked ? (
                            <CheckSquare className="w-4.5 h-4.5 text-brand-green" />
                          ) : (
                            <Square className="w-4.5 h-4.5 text-slate-300 hover:text-slate-400" />
                          )}
                        </button>
                        <div className="text-xs leading-relaxed">
                          <span className="font-bold text-slate-400 block mb-0.5">Requirement {idx + 1}</span>
                          <span className="font-light">{req}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Celebration Message */}
                {isBadgeCompleted(selectedBadge) && (
                  <div className="mt-5 p-4 bg-brand-gold/10 border border-brand-gold/30 rounded-xl text-center flex flex-col items-center gap-1 animate-fadeIn">
                    <div className="bg-brand-gold text-brand-green p-1.5 rounded-full flex items-center justify-center mb-1">
                      <Sparkles className="w-4 h-4 fill-brand-green" />
                    </div>
                    <h5 className="text-xs font-bold text-brand-green uppercase tracking-wider">Congratulations, Scout!</h5>
                    <p className="text-[11px] text-slate-700 leading-tight">
                      You have met all the requirements for the <strong>{selectedBadge.name}</strong> badge!
                    </p>
                  </div>
                )}

              </div>
            ) : (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 text-sm shadow-xs">
                No badge selected. Click an item on the left to review requirement specifics.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

