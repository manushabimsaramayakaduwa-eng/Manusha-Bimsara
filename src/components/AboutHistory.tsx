import { useState, useEffect } from 'react';
import { TIMELINE_DATA, LEADERSHIP_DATA, GALLERY_IMAGES } from '../data';
import { Calendar, Quote, Shield, Camera, Award, HelpCircle } from 'lucide-react';
import { getTroopDetails, TroopDetails } from '../lib/troopConfig';

export default function AboutHistory() {
  const [activeGalleryTab, setActiveGalleryTab] = useState<'all' | 'pioneering' | 'camping' | 'community' | 'adventure' | 'meetings'>('all');
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

  const filteredGallery = GALLERY_IMAGES.filter(img => {
    if (activeGalleryTab === 'all') return true;
    return img.category === activeGalleryTab;
  });

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* SECTION 1: Group History / Timeline */}
        <div className="space-y-10">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
              <Shield className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span>History & Heritage</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
              Timeline of {troopDetails.name}
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
              From a single patrol of 12 eager recruits in 1982 to becoming one of the premier boys-only Scout Groups in Sri Lanka.
            </p>
          </div>

          {/* Interactive Timeline Path */}
          <div className="relative border-l-2 border-slate-200 ml-4 md:ml-32 max-w-4xl mx-auto space-y-8 py-4">
            {TIMELINE_DATA.map((item, idx) => (
              <div key={idx} className="relative pl-6 md:pl-10">
                {/* Visual Circle Indicator */}
                <div className="absolute -left-[11px] top-1 bg-white border-2 border-brand-green w-5 h-5 rounded-full flex items-center justify-center text-[10px] text-brand-green font-bold z-10 shadow-xs">
                  ✓
                </div>

                {/* Left side year tag for desktops */}
                <div className="hidden md:block absolute -left-32 top-0.5 w-24 text-right">
                  <span className="text-xl font-black text-brand-gold tracking-tight">{item.year}</span>
                </div>

                {/* Main details card */}
                <div className="bg-white border border-slate-200/80 p-5 rounded-xl shadow-xs hover:border-brand-green/30 hover:shadow-md transition duration-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-sans font-bold text-sm text-brand-green flex items-center gap-2">
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.title}</span>
                    </h3>
                    <span className="md:hidden text-xs font-black text-brand-gold">{item.year}</span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed font-sans font-light">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: Leadership Council */}
        <div className="space-y-10 border-t border-slate-200/60 pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 bg-brand-gold/10 border border-brand-gold/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
              <Award className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span>Leadership</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
              Meet Our Leaders
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
              Our registered scout masters and cub mistresses hold professional training credentials, guiding our youths safely through high technical skills.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {LEADERSHIP_DATA.map((leader, idx) => (
              <div
                key={idx}
                className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs p-5 flex flex-col justify-between items-center text-center hover:border-brand-green/20 transition-all"
              >
                <div className="flex flex-col items-center">
                  <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-brand-green mb-4 bg-slate-50 shadow-inner">
                    <img
                      src={leader.image}
                      alt={leader.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <h4 className="font-sans font-bold text-xs text-brand-green leading-tight">{leader.name}</h4>
                  <p className="text-[10px] text-brand-green-light font-bold uppercase tracking-wider mt-0.5">{leader.role}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 w-full relative">
                  <Quote className="w-4 h-4 text-slate-200 absolute -top-1 left-0" />
                  <p className="text-[10px] text-slate-500 italic leading-relaxed pl-4 text-left font-light">
                    {leader.quote}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: Visual Adventure Gallery */}
        <div className="space-y-10 border-t border-slate-200/60 pt-16">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
              <Camera className="w-3.5 h-3.5 text-brand-gold" />
              <span>Moments in Camp</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
              Photo Adventure Gallery
            </h2>
            <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
              A visual glimpse of scouts in action: rigging structures, camping under stars, hiking wilderness terrains, and doing civic duties.
            </p>
          </div>

          {/* Gallery categories filter tab */}
          <div className="flex flex-wrap justify-center gap-1.5 max-w-xl mx-auto">
            {(['all', 'pioneering', 'camping', 'community', 'adventure', 'meetings'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveGalleryTab(tab)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all cursor-pointer ${
                  activeGalleryTab === tab
                    ? 'bg-brand-green text-white shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                }`}
              >
                {tab === 'all' ? 'All Images' : tab}
              </button>
            ))}
          </div>

          {/* Grid of Images */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGallery.map((img, idx) => (
              <div
                key={idx}
                className="group relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm h-60 hover:border-brand-green/30 hover:shadow-md transition"
              >
                <img
                  src={img.url}
                  alt={img.title}
                  className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                
                {/* Overlay Text Details */}
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-brand-green text-white text-[8px] font-black px-2 py-0.5 rounded uppercase tracking-wider">
                    {img.category}
                  </span>
                  <h5 className="text-xs font-bold text-white mt-1 leading-tight">{img.title}</h5>
                  <p className="text-[10px] text-slate-200 leading-tight mt-0.5 font-light">{img.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}

