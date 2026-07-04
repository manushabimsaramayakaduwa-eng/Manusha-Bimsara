import { useState } from 'react';
import { Shield, Sparkles, HelpCircle, Landmark, MapPin, Award, UserCheck } from 'lucide-react';

interface BadgeZone {
  id: string;
  name: string;
  badgeTitle: string;
  positionDescription: string;
  purpose: string;
  regulations: string;
  exampleIcon: string;
}

const BADGE_ZONES: BadgeZone[] = [
  {
    id: 'scarf',
    name: 'Scout Scarf (Neck)',
    badgeTitle: '51st Colombo Group Scarf',
    positionDescription: 'Worn around the neck, secured with a scout woggle.',
    purpose: 'Represents group identity. The 51st Colombo scarf features a custom Navy Blue body representing Colombo International School, bordered with Gold/Yellow trim.',
    regulations: 'Must be rolled neatly (with the gold border visible on the outside) and tucked flat under the shirt collar.',
    exampleIcon: '🧣'
  },
  {
    id: 'left-sleeve',
    name: 'Left Sleeve',
    badgeTitle: 'Group Name & Patrol Emblem',
    positionDescription: 'Upper half of the left sleeve, below the shoulder seam.',
    purpose: 'Displays the group number "51st Colombo", along with the Scout\'s Patrol badge (e.g. Eagle, Cobra, Tiger) and leadership stripes.',
    regulations: 'The group label sits 1cm below shoulder seam. The patrol emblem (triangle shape) is centered directly below the group number.',
    exampleIcon: '🐅'
  },
  {
    id: 'right-sleeve',
    name: 'Right Sleeve',
    badgeTitle: 'District & National Badges',
    positionDescription: 'Upper half of the right sleeve, below the shoulder seam.',
    purpose: 'Displays the "Colombo District" badge and the official "Sri Lanka Scout Association" national crest.',
    regulations: 'The Sri Lanka emblem sits at the top. The Colombo district shield sits exactly 2cm below it. Must be stitched securely.',
    exampleIcon: '🇱🇰'
  },
  {
    id: 'left-breast',
    name: 'Left Chest',
    badgeTitle: 'World Scout Emblem (WOSM)',
    positionDescription: 'Centered on the left pocket of the uniform shirt.',
    purpose: 'The purple fleur-de-lis badge representing membership in the World Organization of the Scout Movement (WOSM).',
    regulations: 'This badge must be worn by all invested Cubs, Scouts, and Rovers worldwide. No other badge may cover it.',
    exampleIcon: '⚜️'
  },
  {
    id: 'right-breast',
    name: 'Right Chest',
    badgeTitle: 'Name Plate & Efficiency Stars',
    positionDescription: 'Directly above the right pocket of the uniform shirt.',
    purpose: 'Holds the scout\'s official name tag/plate, as well as the progress rank stars (Bronze, Silver, Gold stars for Cubs).',
    regulations: 'Name tag is black with white lettering. Rank stars are pinned in a horizontal line immediately above the pocket flap.',
    exampleIcon: '🏷️'
  },
  {
    id: 'sash',
    name: 'Merit Badge Sash',
    badgeTitle: 'Scout Merit Badges',
    positionDescription: 'Worn draped over the right shoulder, crossing to the left hip.',
    purpose: 'Holds all specialty merit badges earned by the scout (e.g., Camping, First Aid, Cooking, Pioneering).',
    regulations: 'Worn only with formal ceremonial "Class A" uniforms. Badges must be arranged neatly in rows of three, with the highest difficulty badges at the top.',
    exampleIcon: '🎗️'
  }
];

export default function UniformGuide() {
  const [selectedZoneId, setSelectedZoneId] = useState<string>('scarf');

  const selectedZone = BADGE_ZONES.find(z => z.id === selectedZoneId) || BADGE_ZONES[0];

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <Landmark className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Interactive Guide</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Uniform & Badge Placement Assistant
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Scouting uniforms hold pride, history, and achievements. Hover over or select any uniform zone below to see exactly which insignia goes where according to official 51st Colombo regulations.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Interactive Shirt Diagram Mockup */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 block">
              Virtual Uniform Shirt
            </span>

            {/* Simulated Shirt Canvas */}
            <div className="relative w-72 h-96 bg-amber-100 border-4 border-amber-800/20 rounded-t-[40px] shadow-md flex flex-col items-center overflow-hidden p-4">
              
              {/* Collar Area */}
              <div className="absolute top-0 w-36 h-10 bg-amber-200 border-b-2 border-amber-800/30 rounded-b-lg flex items-center justify-center z-20">
                <div className="w-24 h-5 bg-slate-900 rounded-b-md border border-slate-800 flex items-center justify-center text-[9px] text-amber-400 font-bold">
                  Woggle
                </div>
              </div>

              {/* Scarf Overlay (Folded triangle) */}
              <button
                onClick={() => setSelectedZoneId('scarf')}
                className={`absolute top-0 w-28 h-28 bg-slate-900 border-x-4 border-b-4 border-amber-500 rounded-b-full flex flex-col items-center justify-end pb-3 z-10 transition-all ${
                  selectedZoneId === 'scarf' ? 'ring-4 ring-brand-green scale-105' : 'hover:scale-[1.03] opacity-90'
                }`}
                title="Group Scarf"
              >
                <span className="text-[10px] text-white font-bold leading-none">Kotte</span>
                <span className="text-[8px] text-amber-400 font-bold leading-none uppercase">Sastralaya</span>
              </button>

              {/* Left Sleeve (Relative Left is screen Right) */}
              <button
                onClick={() => setSelectedZoneId('left-sleeve')}
                className={`absolute top-16 -right-2 w-14 h-28 bg-amber-200 border-l border-amber-800/20 rounded-l-md flex flex-col items-center pt-4 gap-1 ${
                  selectedZoneId === 'left-sleeve' ? 'ring-4 ring-brand-green scale-105 z-30' : 'hover:bg-amber-200/80'
                }`}
                title="Left Sleeve"
              >
                <div className="bg-slate-900 text-[7px] text-white px-1 font-bold rounded">ASK Kotte</div>
                <div className="w-5 h-5 bg-orange-600 rounded-full flex items-center justify-center text-[8px] text-white font-bold">🐯</div>
              </button>

              {/* Right Sleeve (Relative Right is screen Left) */}
              <button
                onClick={() => setSelectedZoneId('right-sleeve')}
                className={`absolute top-16 -left-2 w-14 h-28 bg-amber-200 border-r border-amber-800/20 rounded-r-md flex flex-col items-center pt-4 gap-1 ${
                  selectedZoneId === 'right-sleeve' ? 'ring-4 ring-brand-green scale-105 z-30' : 'hover:bg-amber-200/80'
                }`}
                title="Right Sleeve"
              >
                <div className="w-6 h-4 bg-emerald-700 rounded flex items-center justify-center text-[7px] text-white font-bold">SL</div>
                <div className="w-5 h-5 bg-rose-700 rounded-full flex items-center justify-center text-[8px] text-white font-bold">🛡️</div>
              </button>

              {/* Shirt Pockets */}
              <div className="w-full mt-32 flex justify-between px-6">
                
                {/* Right Breast Pocket (Screen Left) */}
                <button
                  onClick={() => setSelectedZoneId('right-breast')}
                  className={`w-16 h-20 bg-amber-200/80 border border-amber-800/30 rounded shadow-sm flex flex-col items-center justify-start p-1 ${
                    selectedZoneId === 'right-breast' ? 'ring-4 ring-brand-green scale-105' : 'hover:bg-amber-200/50'
                  }`}
                  title="Right Breast pocket"
                >
                  <div className="w-12 h-2.5 bg-slate-900 rounded-[2px] mb-1 text-[5px] text-white font-bold text-center">NIMAL D.</div>
                  <div className="flex gap-0.5 mt-2">
                    <span className="text-[7px]">⭐</span>
                    <span className="text-[7px]">⭐</span>
                  </div>
                </button>

                {/* Left Breast Pocket (Screen Right) */}
                <button
                  onClick={() => setSelectedZoneId('left-breast')}
                  className={`w-16 h-20 bg-amber-200/80 border border-amber-800/30 rounded shadow-sm flex flex-col items-center justify-center p-1 ${
                    selectedZoneId === 'left-breast' ? 'ring-4 ring-brand-green scale-105' : 'hover:bg-amber-200/50'
                  }`}
                  title="Left Breast pocket"
                >
                  <div className="w-8 h-8 bg-purple-700 rounded-full flex items-center justify-center text-[10px] text-white">⚜️</div>
                  <span className="text-[6px] text-slate-600 font-bold uppercase mt-1">WOSM</span>
                </button>

              </div>

              {/* Diagonal Sash (Overlay over right shoulder) */}
              <button
                onClick={() => setSelectedZoneId('sash')}
                className={`absolute -top-10 left-12 w-12 h-[500px] bg-emerald-950 border-x border-emerald-500/30 opacity-90 origin-top rotate-[28deg] z-15 flex flex-col items-center pt-24 gap-3 ${
                  selectedZoneId === 'sash' ? 'ring-4 ring-brand-green opacity-100 z-25' : 'hover:opacity-95'
                }`}
                title="Merit Badge Sash"
              >
                <span className="text-[7px] text-amber-400 font-bold uppercase tracking-widest whitespace-nowrap rotate-90 mb-4">Sash</span>
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[8px]">⛺</div>
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[8px]">🩹</div>
                <div className="w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[8px]">🌉</div>
              </button>

              {/* Buttons Line */}
              <div className="absolute bottom-6 w-1 h-32 bg-amber-800/20 flex flex-col justify-between items-center py-2">
                <div className="w-2.5 h-2.5 bg-amber-700 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-700 rounded-full" />
                <div className="w-2.5 h-2.5 bg-amber-700 rounded-full" />
              </div>

            </div>

            <p className="text-[10px] text-slate-400 text-center mt-3 max-w-xs italic">
              *Interactive uniform mockup. Click highlighting zones on the shirt to reveal regulations and placement guidelines.
            </p>
          </div>

          {/* Right Column: Expanded Zone Details Card */}
          <div className="lg:col-span-7">
            
            {/* Zone Selector Buttons List */}
            <div className="flex flex-wrap gap-1.5 mb-6">
              {BADGE_ZONES.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZoneId(zone.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    selectedZoneId === zone.id
                      ? 'bg-brand-green text-white shadow-sm'
                      : 'bg-white hover:bg-slate-50 text-slate-600 border border-slate-200'
                  }`}
                >
                  {zone.name}
                </button>
              ))}
            </div>

            {/* Display Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden text-slate-800">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full filter blur-2xl" />

              <div className="flex items-center space-x-3.5 border-b border-slate-100 pb-4 mb-4">
                <div className="bg-slate-50 p-3 rounded-xl text-3xl border border-slate-200 flex items-center justify-center">
                  {selectedZone.exampleIcon}
                </div>
                <div>
                  <span className="text-[10px] font-bold text-brand-green uppercase tracking-widest block">Zone Placement Specifications</span>
                  <h3 className="font-sans font-black text-xl text-brand-green">{selectedZone.name}</h3>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Official Insignia:</span>
                  <p className="text-slate-800 font-extrabold">{selectedZone.badgeTitle}</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1">Standard Position:</span>
                  <p className="text-slate-700 leading-relaxed font-light">{selectedZone.positionDescription}</p>
                </div>

                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/60">
                  <span className="font-bold text-brand-gold uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
                    <span>Purpose & Meaning</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed italic font-light">"{selectedZone.purpose}"</p>
                </div>

                <div>
                  <span className="font-bold text-slate-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <HelpCircle className="w-3.5 h-3.5 text-brand-green" />
                    <span>Rules & Stitching Regulations:</span>
                  </span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200 font-light">
                    {selectedZone.regulations}
                  </p>
                </div>
              </div>

              {/* Badge Verification Helper info */}
              <div className="mt-6 pt-5 border-t border-slate-100 flex items-center space-x-3 text-[11px] text-slate-500 leading-relaxed">
                <div className="bg-slate-50 p-2 rounded-lg text-brand-green border border-slate-200 shrink-0">
                  <UserCheck className="w-4 h-4" />
                </div>
                <p className="font-light">
                  Note: All official badges must be issued directly by the Ananda Sastralaya Kotte Scout Master. Scouts are not authorized to wear uncertified patches on uniform.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
