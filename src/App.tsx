import { useState, useEffect } from 'react';
import { ActiveView } from './types';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Sections from './components/Sections';
import BadgeTracker from './components/BadgeTracker';
import UniformGuide from './components/UniformGuide';
import KnotMaster from './components/KnotMaster';
import Events from './components/Events';
import AboutHistory from './components/AboutHistory';
import JoinForm from './components/JoinForm';
import TroopTrack from './components/TroopTrack';
import { Compass, Mail, Phone, MapPin, Award, Flame, Star, ShieldCheck } from 'lucide-react';
import { getTroopDetails, TroopDetails } from './lib/troopConfig';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveView>('home');
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

  const renderActiveComponent = () => {
    switch (activeView) {
      case 'home':
        return (
          <div className="space-y-12 animate-fadeIn bg-brand-cream py-6">
            {/* Main Hero Section */}
            <Hero setActiveView={setActiveView} />

            {/* Quick Informational Highlights Grid (Home Page Extra Features) */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 space-y-12">
              
              <div className="text-center max-w-3xl mx-auto">
                <div className="inline-flex items-center space-x-1 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
                  <Star className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                  <span>The Scouting Way</span>
                </div>
                <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
                  Why Join the {troopDetails.name}?
                </h2>
                <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
                  We specialize in crafting experiences that challenge minds, build long-lasting friendships, and teach practical outdoor excellence.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Highlight 1 */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between items-start hover:border-brand-green/40 shadow-xs hover:shadow-md transition duration-250">
                  <div className="bg-brand-green/10 p-3 rounded-xl border border-brand-green/20 text-brand-green mb-4 text-2xl">
                    🏕️
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-brand-green mb-2">Outdoor Mastery</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Learn to pitch patrol tents under 5 minutes, build robust cooking structures with square lashings, cook pol-sambol and roti over campfires, and read topological maps.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView('knots')}
                    className="text-xs text-brand-green-light font-extrabold hover:text-brand-green cursor-pointer uppercase tracking-wider"
                  >
                    Learn Knotting Techniques →
                  </button>
                </div>

                {/* Highlight 2 */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between items-start hover:border-brand-green/40 shadow-xs hover:shadow-md transition duration-250">
                  <div className="bg-brand-gold/15 p-3 rounded-xl border border-brand-gold/30 text-brand-green-light mb-4 text-2xl">
                    🎖️
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-brand-green mb-2">Insignia Honors</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Earn standard merit badges from Camping, Pioneering, Map Reading, Cooking to First Aid, leading up to the prestigious President's Scout Award.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView('badges')}
                    className="text-xs text-brand-green-light font-extrabold hover:text-brand-green cursor-pointer uppercase tracking-wider"
                  >
                    Open Badge Explorer →
                  </button>
                </div>

                {/* Highlight 3 */}
                <div className="bg-white border border-slate-200/80 p-6 rounded-2xl flex flex-col justify-between items-start hover:border-brand-green/40 shadow-xs hover:shadow-md transition duration-250">
                  <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-700 mb-4 text-2xl">
                    🤝
                  </div>
                  <div>
                    <h3 className="font-sans font-bold text-base text-brand-green mb-2">Civic Action & Honor</h3>
                    <p className="text-xs text-slate-600 leading-relaxed mb-4">
                      Scouting is about service. Our troop regularly leads coastal beach cleanups, charity clothing drives, tree planting, and local school restoration campaigns.
                    </p>
                  </div>
                  <button
                    onClick={() => setActiveView('about')}
                    className="text-xs text-brand-green-light font-extrabold hover:text-brand-green cursor-pointer uppercase tracking-wider"
                  >
                    Our History & Milestones →
                  </button>
                </div>
              </div>

              {/* Welcome Notice from GSL */}
              <div className="bg-brand-green border-b-4 border-brand-gold rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6 justify-between text-white shadow-md">
                <div className="space-y-2 text-center sm:text-left max-w-2xl">
                  <span className="text-[10px] bg-brand-gold text-brand-green font-black px-2.5 py-1 rounded uppercase tracking-wider">
                    Welcome Address
                  </span>
                  <h3 className="font-sans font-black text-xl text-white">Join the Adventure Today</h3>
                  <p className="text-xs text-slate-200 leading-relaxed font-light">
                    "{troopDetails.gslQuote}" - {troopDetails.gslName}, Group Scout Leader (GSL).
                  </p>
                </div>
                <button
                  onClick={() => setActiveView('join')}
                  className="bg-brand-gold hover:bg-brand-gold-hover text-brand-green font-bold px-5 py-3 rounded shadow-md text-xs tracking-wider uppercase shrink-0 transition cursor-pointer"
                >
                  Join {troopDetails.shortName} ⚜️
                </button>
              </div>

            </div>
          </div>
        );
      case 'sections':
        return <Sections setActiveView={setActiveView} />;
      case 'badges':
        return <BadgeTracker />;
      case 'uniform':
        return <UniformGuide />;
      case 'knots':
        return <KnotMaster />;
      case 'events':
        return <Events />;
      case 'about':
        return <AboutHistory />;
      case 'join':
        return <JoinForm />;
      case 'portal':
        return <TroopTrack />;
      default:
        return <Hero setActiveView={setActiveView} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-cream text-slate-800 flex flex-col justify-between font-sans selection:bg-brand-gold selection:text-brand-green">
      
      {/* Navigation Header */}
      <Navbar activeView={activeView} setActiveView={setActiveView} />

      {/* Main Container Content */}
      <main className="flex-grow">
        {renderActiveComponent()}
      </main>

      {/* Footer Area */}
      <footer className="bg-slate-100 border-t border-slate-200 text-slate-600 text-xs py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          
          {/* Col 1: Group and Logo info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-brand-green rounded-full flex items-center justify-center text-white font-black text-xs border border-brand-gold shadow-sm">
                {troopDetails.logo}
              </div>
              <div>
                <h4 className="font-sans font-black text-xs text-brand-green uppercase tracking-widest leading-none">
                  {troopDetails.name}
                </h4>
                <p className="text-[9px] text-slate-500 uppercase font-bold tracking-widest mt-1">
                  {troopDetails.schoolName}
                </p>
              </div>
            </div>

            <p className="text-[11px] leading-relaxed text-slate-500">
              The {troopDetails.name} is based at the {troopDetails.schoolName} premises. We empower boy scouts and lead them in outdoor mastery, character development, and civic service under the official patronage of the Sri Lanka Scout Association (SLSA) and the World Organization of the Scout Movement (WOSM).
            </p>

            <div className="text-[10px] text-brand-green-light flex items-center space-x-1 font-semibold">
              <ShieldCheck className="w-4 h-4 text-brand-gold" />
              <span>Official {troopDetails.schoolName} Boy Scout Troop</span>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="md:col-span-3 space-y-3 text-left">
            <h4 className="font-sans font-bold text-xs text-brand-green uppercase tracking-wider">Quick Portal Links</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <button onClick={() => setActiveView('home')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Home</button>
              <button onClick={() => setActiveView('sections')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Sections</button>
              <button onClick={() => setActiveView('badges')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Badges</button>
              <button onClick={() => setActiveView('uniform')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Uniform</button>
              <button onClick={() => setActiveView('knots')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Knot Master</button>
              <button onClick={() => setActiveView('events')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Events</button>
              <button onClick={() => setActiveView('about')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">History</button>
              <button onClick={() => setActiveView('portal')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer">Portal Track</button>
              <button onClick={() => setActiveView('join')} className="text-slate-500 hover:text-brand-green transition text-left cursor-pointer text-brand-gold font-bold bg-brand-green/10 px-1 py-0.5 rounded text-center">Join Us</button>
            </div>
          </div>

          {/* Col 3: Contact Details */}
          <div className="md:col-span-4 space-y-3.5">
            <h4 className="font-sans font-bold text-xs text-brand-green uppercase tracking-wider">Contact & Headquarters</h4>
            
            <div className="space-y-2 text-[11px]">
              <div className="flex items-start space-x-2">
                <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-500">
                  {troopDetails.name} HQ,<br />
                  {troopDetails.address}
                </span>
              </div>

              <div className="flex items-center space-x-2 text-slate-500">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{troopDetails.phone} (School Office)</span>
              </div>

              <div className="flex items-center space-x-2 text-slate-500">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <span>{troopDetails.email}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Legal bar */}
        <div className="max-w-7xl mx-auto border-t border-slate-200 mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center text-[10px] text-slate-400 gap-4">
          <p>© 2026 {troopDetails.name}. All Rights Reserved.</p>
          <div className="flex space-x-4">
            <a href="https://www.colomboscouts.lk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition">Colombo District Scouts</a>
            <a href="https://www.scout.lk" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition">Sri Lanka Scout Association</a>
            <a href="https://www.scout.org" target="_blank" rel="noopener noreferrer" className="hover:text-slate-600 transition">WOSM World Portal</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
