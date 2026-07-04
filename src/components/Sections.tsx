import { useState, useEffect } from 'react';
import { SECTIONS_DATA } from '../data';
import { Shield, Sparkles, Book, CheckCircle, Clock, CalendarDays, Award } from 'lucide-react';
import { ActiveView } from '../types';
import { getTroopDetails, TroopDetails } from '../lib/troopConfig';

interface SectionsProps {
  setActiveView: (view: ActiveView) => void;
}

export default function Sections({ setActiveView }: SectionsProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('scouts');
  const [troopDetails, setTroopDetails] = useState<TroopDetails>(getTroopDetails);

  useEffect(() => {
    const handleTroopUpdate = () => {
      setTroopDetails(getTroopDetails());
    };
    window.addEventListener('troop_details_updated', handleTroopUpdate);
    return () => {
      window.removeEventListener('troop_details_updated', handleTroopUpdate);
    };
  }, []);

  const selectedSection = SECTIONS_DATA.find((s) => s.id === selectedSectionId) || SECTIONS_DATA[1];

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <Shield className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Group Structure</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Scouting Sections at {troopDetails.shortName}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Our group accommodates scouts of all ages, offering staggered challenges, age-appropriate leadership structures, and custom-tailored life skills.
          </p>
        </div>

        {/* Section Tabs Selector */}
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-4 mb-12">
          {SECTIONS_DATA.map((section) => {
            const isActive = section.id === selectedSectionId;
            let borderStyle = 'border-slate-200 hover:border-brand-green/30 hover:bg-white/60 bg-white/40';
            if (isActive) {
              if (section.id === 'cubs') borderStyle = 'bg-white border-brand-gold border-l-4 border-l-brand-gold shadow-md scale-[1.02]';
              else if (section.id === 'scouts') borderStyle = 'bg-white border-brand-green border-l-4 border-l-brand-green shadow-md scale-[1.02]';
              else borderStyle = 'bg-white border-brand-green-dark border-l-4 border-l-brand-green-dark shadow-md scale-[1.02]';
            }
            return (
              <button
                key={section.id}
                id={`btn-section-${section.id}`}
                onClick={() => setSelectedSectionId(section.id)}
                className={`flex-1 flex flex-col justify-between text-left p-6 rounded-xl border transition-all duration-300 cursor-pointer ${borderStyle}`}
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider ${
                      section.id === 'cubs' ? 'bg-brand-gold/15 text-brand-green border border-brand-gold/25' :
                      section.id === 'scouts' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                      'bg-slate-800/10 text-slate-800 border border-slate-300'
                    }`}>
                      {section.ageRange}
                    </span>
                    <Sparkles className={`w-5 h-5 ${isActive ? 'text-brand-gold' : 'text-slate-300'}`} />
                  </div>
                  <h3 className="font-sans font-black text-lg text-brand-green mb-1">{section.name}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-3 font-light">{section.tagline}</p>
                </div>
                
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 border-t border-slate-100 pt-2 w-full">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{section.meetingTime}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Expanded View of Selected Section */}
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-md p-6 sm:p-8 relative">
          
          {/* Accent Glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green/5 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
            
            {/* Left column - Description, Promise and Motto */}
            <div className="lg:col-span-7 space-y-6">
              <div>
                <h3 className="font-sans font-black text-2xl text-brand-green mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-6 rounded bg-brand-green" />
                  About the {selectedSection.name}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed font-light">
                  {selectedSection.description}
                </p>
              </div>

              {/* Promise & Law */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-brand-green font-bold text-xs uppercase tracking-wider mb-2">
                    <Award className="w-4 h-4 text-brand-gold" />
                    <span>The Section Promise</span>
                  </div>
                  <p className="text-xs text-slate-700 italic leading-relaxed">
                    "{selectedSection.promise}"
                  </p>
                </div>

                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                  <div className="flex items-center space-x-2 text-brand-green-light font-bold text-xs uppercase tracking-wider mb-2">
                    <Book className="w-4 h-4 text-brand-green" />
                    <span>The Section Motto</span>
                  </div>
                  <p className="text-xs text-slate-700 font-bold tracking-wide">
                    "{selectedSection.motto}"
                  </p>
                </div>
              </div>

              {/* The Scout Law List */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-3">
                  The {selectedSectionId === 'cubs' ? 'Cub Pack' : 'Scout'} Law:
                </span>
                <ol className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {selectedSection.law.map((lawItem, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-slate-600">
                      <span className="text-brand-green font-bold">0{idx + 1}.</span>
                      <span className="font-light">{lawItem}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>

            {/* Right column - Key Activities & Badges overview */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Core Activities */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h4 className="font-sans font-bold text-sm text-brand-green mb-3 flex items-center space-x-2">
                  <CalendarDays className="w-4 h-4 text-brand-green" />
                  <span>Core Activities & Skills</span>
                </h4>
                <ul className="space-y-2.5">
                  {selectedSection.activities.map((act, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-600">
                      <CheckCircle className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                      <span className="font-light">{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Badges Earned */}
              <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                <h4 className="font-sans font-bold text-sm text-brand-green mb-3 flex items-center space-x-2">
                  <Award className="w-4 h-4 text-brand-gold" />
                  <span>Badge Pathway Highlights</span>
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSection.badges.map((bName, idx) => (
                    <span
                      key={idx}
                      className="bg-white border border-slate-200 text-xs text-slate-600 px-3 py-1.5 rounded-full flex items-center space-x-1.5 shadow-xs"
                    >
                      <span className="text-brand-gold">🏅</span>
                      <span className="font-semibold">{bName}</span>
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setActiveView('badges')}
                  className="w-full mt-4 bg-brand-green text-white hover:bg-brand-green-light text-xs font-bold py-2 rounded shadow-sm transition-all cursor-pointer uppercase tracking-wider"
                >
                  Open Badge Explorer & Requirements
                </button>
              </div>

              {/* CTA */}
              <div className="bg-brand-gold/10 border border-brand-gold/20 rounded-xl p-4 text-center">
                <p className="text-xs text-slate-800 font-bold">
                  Ready to enroll in the {selectedSection.name}?
                </p>
                <button
                  onClick={() => setActiveView('join')}
                  className="mt-2 text-xs bg-brand-green hover:bg-brand-green-light text-white font-bold px-4 py-2 rounded shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  Register Online Now
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

