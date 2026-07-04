import { useState, useEffect } from 'react';
import { Compass, ArrowRight, ShieldCheck, Award, Users, MapPin, Sparkles } from 'lucide-react';
import { ActiveView } from '../types';
import { getTroopDetails, TroopDetails } from '../lib/troopConfig';

interface HeroProps {
  setActiveView: (view: ActiveView) => void;
}

export default function Hero({ setActiveView }: HeroProps) {
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

  const stats = [
    { label: 'Active Members', value: '150+', icon: <Users className="w-5 h-5 text-brand-green" /> },
    { label: 'Years of History', value: '44+', icon: <Sparkles className="w-5 h-5 text-brand-gold" /> },
    { label: 'President\'s Scouts', value: '112+', icon: <Award className="w-5 h-5 text-brand-green-light" /> },
    { label: 'Active Patrols', value: '5', icon: <Compass className="w-5 h-5 text-brand-gold" /> },
  ];

  return (
    <div className="relative overflow-hidden bg-brand-green text-white py-16 sm:py-20 border-b-4 border-brand-gold">
      {/* Background grid accent lines simulating the design's graphic aesthetic */}
      <div className="absolute inset-0 opacity-15">
        <div className="grid grid-cols-12 h-full w-full">
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
          <div className="border-r border-white/20"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Text Hero Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full text-brand-gold text-xs font-semibold tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>{troopDetails.schoolName} • Scout Group</span>
            </div>
            
            <h1 className="font-sans font-black text-4xl sm:text-5xl lg:text-6xl tracking-tight leading-tight">
              BE PREPARED.<br />
              <span className="text-brand-gold">Adventure & Character</span>
            </h1>
            
            <p className="text-slate-200 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto lg:mx-0 leading-relaxed font-light">
              Welcome to the <strong className="text-white font-bold">{troopDetails.name}</strong>. 
              Based at {troopDetails.schoolName}, we empower boys through outdoor mastery, character-building exercises, and community-first service since 1982.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={() => setActiveView('join')}
                id="hero-join-btn"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-gold hover:bg-brand-gold-hover text-brand-green font-bold rounded shadow-lg transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                <span>Join the Adventure</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
              
              <button
                onClick={() => setActiveView('sections')}
                id="hero-explore-btn"
                className="inline-flex items-center justify-center px-6 py-3 bg-brand-green-light hover:bg-brand-green-light/80 text-white font-bold rounded border border-white/20 transition-all cursor-pointer text-xs uppercase tracking-wider"
              >
                <span>Explore Sections</span>
              </button>
            </div>

            {/* Quick badges of honor */}
            <div className="pt-6 flex flex-wrap justify-center lg:justify-start gap-6 text-xs text-slate-300">
              <div className="flex items-center space-x-1">
                <span className="text-brand-gold">✔</span>
                <span>Boys Only Scout Group</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-brand-gold">✔</span>
                <span>Presidential Honor Roll</span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-brand-gold">✔</span>
                <span>WOSM Registered</span>
              </div>
            </div>
          </div>
          
          {/* Visual Interactive Image Frame */}
          <div className="lg:col-span-5 relative">
            <div className="absolute right-6 bottom-0 top-0 hidden lg:flex items-center opacity-5">
              <div className="w-64 h-64 rounded-2xl border-4 border-brand-gold rotate-12 flex items-center justify-center bg-brand-green-light">
                <span className="text-white text-8xl font-black">{troopDetails.logo}</span>
              </div>
            </div>

            <div className="relative bg-brand-green-light border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-4 z-10">
              <div className="relative h-64 sm:h-80 w-full rounded-xl overflow-hidden bg-brand-green-dark">
                <img
                  src="https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600"
                  alt="Scouting Campfire"
                  className="w-full h-full object-cover opacity-85 hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-green-dark via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className="bg-brand-gold text-brand-green text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    Pioneering Display
                  </span>
                  <p className="text-sm font-bold text-white mt-1">
                    Camporee Rigging and Flagpole Construction
                  </p>
                  <p className="text-xs text-slate-200 mt-0.5 font-light">
                    Made with natural logs and manila ropes.
                  </p>
                </div>
              </div>
              
              {/* Quick Quote Card */}
              <div className="mt-4 bg-brand-green border border-white/10 rounded-xl p-3 flex items-center space-x-3 shadow-inner">
                <div className="bg-brand-gold/10 p-2 rounded-lg text-brand-gold">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs italic text-slate-200">
                    "Tying knots, pitch-tent speeds, and learning real survival skills helped build my confidence."
                  </p>
                  <span className="text-[10px] font-bold text-brand-gold uppercase tracking-wider block mt-1">
                    — Ranuka S., Patrol Leader (Cobra Patrol)
                  </span>
                </div>
              </div>
            </div>
          </div>
          
        </div>

        {/* Stats Grid - Light bento style from the Design */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="bg-white border border-slate-200 text-slate-800 rounded-xl p-5 flex items-center space-x-4 shadow-sm hover:shadow transition-all duration-200"
            >
              <div className="bg-brand-green/5 p-3 rounded-lg text-brand-green shrink-0">
                {stat.icon}
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-brand-green tracking-tight">{stat.value}</div>
                <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
        
      </div>
    </div>
  );
}

