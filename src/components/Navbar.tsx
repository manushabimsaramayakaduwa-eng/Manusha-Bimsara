import React, { useState, useEffect } from 'react';
import { ActiveView } from '../types';
import { Compass, Menu, X, Landmark, Award, BookOpen, Calendar, HelpCircle, UserPlus, Flame, Users, LogIn, User } from 'lucide-react';
import { getTroopDetails, TroopDetails } from '../lib/troopConfig';

interface NavbarProps {
  activeView: ActiveView;
  setActiveView: (view: ActiveView) => void;
}

export default function Navbar({ activeView, setActiveView }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [troopDetails, setTroopDetails] = useState<TroopDetails>(getTroopDetails);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('51_scouttrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const handleTroopUpdate = () => {
      setTroopDetails(getTroopDetails());
    };
    const handleAuthUpdate = () => {
      const saved = localStorage.getItem('51_scouttrack_user');
      setCurrentUser(saved ? JSON.parse(saved) : null);
    };

    window.addEventListener('troop_details_updated', handleTroopUpdate);
    window.addEventListener('scouttrack_auth_changed', handleAuthUpdate);
    return () => {
      window.removeEventListener('troop_details_updated', handleTroopUpdate);
      window.removeEventListener('scouttrack_auth_changed', handleAuthUpdate);
    };
  }, []);

  const navItems: { id: ActiveView; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Flame className="w-3.5 h-3.5" /> },
    { id: 'sections', label: 'Sections', icon: <Compass className="w-3.5 h-3.5" /> },
    { id: 'badges', label: 'Badges', icon: <Award className="w-3.5 h-3.5" /> },
    { id: 'uniform', label: 'Uniform', icon: <Landmark className="w-3.5 h-3.5" /> },
    { id: 'knots', label: 'Knot Master', icon: <BookOpen className="w-3.5 h-3.5" /> },
    { id: 'events', label: 'Events', icon: <Calendar className="w-3.5 h-3.5" /> },
    { id: 'about', label: 'History', icon: <HelpCircle className="w-3.5 h-3.5" /> },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-brand-green border-b-4 border-brand-gold text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Group Title */}
          <div className="flex items-center space-x-3.5 cursor-pointer shrink-0" onClick={() => setActiveView('home')}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-brand-green font-black text-[10px] border-2 border-brand-gold shadow-md">
              {troopDetails.logo}
            </div>
            <div>
              <h1 className="text-white font-extrabold text-sm sm:text-base tracking-tight leading-none uppercase">
                {troopDetails.shortName}
              </h1>
              <p className="text-brand-gold text-[9px] sm:text-[10px] font-semibold uppercase tracking-widest mt-0.5">
                {troopDetails.name}
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {navItems.map((item) => (
              <button
                key={item.id}
                id={`nav-${item.id}`}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded text-xs font-semibold uppercase tracking-wider transition-all ${
                  activeView === item.id
                    ? 'text-brand-gold bg-brand-green-light/60 border border-brand-gold/20 shadow-sm'
                    : 'text-white/90 hover:bg-white/10 hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}

            {/* Separate Login/Register Portal Button out from the menu */}
            {currentUser ? (
              <button
                onClick={() => setActiveView('portal')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border border-brand-gold/30 ${
                  activeView === 'portal'
                    ? 'text-brand-gold bg-brand-green-light/80 border-brand-gold/50'
                    : 'text-white bg-brand-green-light/20 hover:bg-white/15'
                }`}
              >
                <User className="w-3.5 h-3.5 text-brand-gold" />
                <span className="max-w-[120px] truncate">Portal: {currentUser.fullName.split(' ')[0]}</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveView('portal')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded text-xs font-black uppercase tracking-wider transition-all border border-white/20 ${
                  activeView === 'portal'
                    ? 'text-brand-gold bg-brand-green-light/80 border-brand-gold/50'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <LogIn className="w-3.5 h-3.5 text-brand-gold" />
                <span>Sign In / Portal</span>
              </button>
            )}

            {/* Special Call to Action Button */}
            <button
              onClick={() => setActiveView('join')}
              className={`bg-brand-gold text-brand-green hover:bg-brand-gold-hover px-4 py-1.5 rounded shadow-md text-xs font-bold uppercase tracking-wider transition-all ml-2 ${
                activeView === 'join' ? 'ring-2 ring-white' : ''
              }`}
            >
              Join Us
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-200 hover:text-white hover:bg-brand-green-light focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden bg-brand-green-dark border-t border-brand-green-light animate-fadeIn">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors ${
                  activeView === item.id
                    ? 'bg-brand-green-light text-brand-gold border-l-4 border-brand-gold'
                    : 'text-slate-200 hover:bg-brand-green-light/40 hover:text-white'
                }`}
              >
                <span className={activeView === item.id ? 'text-brand-gold' : 'text-brand-gold/60'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            ))}

            {/* Separate Mobile Sign In / Dashboard */}
            {currentUser ? (
              <button
                onClick={() => {
                  setActiveView('portal');
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border-t border-brand-green-light/40 ${
                  activeView === 'portal'
                    ? 'bg-brand-green-light text-brand-gold border-l-4 border-brand-gold'
                    : 'text-slate-200 hover:bg-brand-green-light/20'
                }`}
              >
                <User className="w-4 h-4 text-brand-gold" />
                <span>Portal: {currentUser.fullName}</span>
              </button>
            ) : (
              <button
                onClick={() => {
                  setActiveView('portal');
                  setIsOpen(false);
                }}
                className={`flex items-center space-x-3 w-full px-4 py-2.5 rounded text-xs font-bold uppercase tracking-wider transition-colors border-t border-brand-green-light/40 ${
                  activeView === 'portal'
                    ? 'bg-brand-green-light text-brand-gold border-l-4 border-brand-gold'
                    : 'text-slate-200 hover:bg-brand-green-light/20'
                }`}
              >
                <LogIn className="w-4 h-4 text-brand-gold" />
                <span>Sign In / Register</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveView('join');
                setIsOpen(false);
              }}
              className="flex items-center justify-center w-full bg-brand-gold text-brand-green hover:bg-brand-gold-hover px-4 py-2.5 rounded text-xs font-bold uppercase tracking-widest transition-all mt-2"
            >
              <UserPlus className="w-4 h-4 mr-2" />
              Join Us Today
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
