import { useState } from 'react';
import { KNOTS_DATA } from '../data';
import { Knot } from '../types';
import { BookOpen, Compass, ChevronRight, ChevronLeft, RefreshCw, Star, Info, ShieldAlert } from 'lucide-react';

export default function KnotMaster() {
  const [selectedKnotId, setSelectedKnotId] = useState<string>('reef');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);

  const selectedKnot = KNOTS_DATA.find((k) => k.id === selectedKnotId) || KNOTS_DATA[0];

  const handleNextStep = () => {
    if (currentStepIndex < selectedKnot.steps.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(prev => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
  };

  const handleKnotSelect = (id: string) => {
    setSelectedKnotId(id);
    setCurrentStepIndex(0);
  };

  // Custom visual SVG representation for some knots to make it super premium
  const renderKnotGraphics = (key: string, stepIdx: number) => {
    switch (key) {
      case 'reef':
        return (
          <svg viewBox="0 0 200 100" className="w-full h-32 text-amber-500">
            {/* Draw Reef Knot representation */}
            <path d="M 30,50 L 70,50 C 70,50 80,40 85,50 C 90,60 100,60 105,50 L 170,50" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 30,40 L 70,40 C 70,40 80,60 85,50 C 90,40 100,40 105,50 L 170,40" stroke="#0F5132" strokeWidth="6" strokeDasharray="3" fill="none" strokeLinecap="round" />
            <circle cx="85" cy="50" r="8" fill="#F59E0B" opacity="0.1" />
            <text x="100" y="85" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
              Step {stepIdx + 1}: Left over Right, then Right over Left
            </text>
          </svg>
        );
      case 'clove':
        return (
          <svg viewBox="0 0 200 100" className="w-full h-32 text-emerald-600">
            {/* Draw Pole/Spar */}
            <rect x="80" y="10" width="40" height="80" rx="4" fill="#78350F" opacity="0.8" />
            {/* Rope loops */}
            <path d="M 40,35 Q 100,35 160,35" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 50,55 Q 100,55 150,55" stroke="#F59E0B" strokeWidth="6" fill="none" strokeLinecap="round" />
            <path d="M 70,25 L 130,65" stroke="#0F5132" strokeWidth="6" fill="none" strokeLinecap="round" />
            <text x="100" y="85" fill="#64748B" fontSize="10" textAnchor="middle" fontFamily="monospace">
              Step {stepIdx + 1}: Double crossing turns locked down
            </text>
          </svg>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-32 border border-dashed border-slate-200 rounded-lg bg-white/50 text-center p-4">
            <span className="text-3xl mb-1">🪢</span>
            <span className="text-[10px] text-slate-400 font-mono uppercase">Lashings & Ropework Guide</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <BookOpen className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Pioneering Core</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Knot Master: Interactive Ropework Guide
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Every scout must master knotting before embarking on pioneering works. Learn the purpose, common use cases, and step-by-step assembly of essential knots.
          </p>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Knot Selector Sidebar */}
          <div className="lg:col-span-4 space-y-3">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
              Select Knot / Hitch
            </p>
            
            <div className="space-y-2">
              {KNOTS_DATA.map((knot) => {
                const isSelected = knot.id === selectedKnotId;
                return (
                  <button
                    key={knot.id}
                    onClick={() => handleKnotSelect(knot.id)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? 'bg-white border-brand-green shadow-md scale-[1.01]'
                        : 'bg-white/70 hover:bg-white border-slate-200 hover:border-brand-green/30 shadow-xs'
                    }`}
                  >
                    <div>
                      <h3 className={`font-sans font-bold text-xs leading-tight ${isSelected ? 'text-brand-green' : 'text-slate-800'}`}>{knot.name}</h3>
                      {knot.sinhalaName && (
                        <p className="text-[10px] text-slate-400 mt-0.5">{knot.sinhalaName}</p>
                      )}
                      <span className={`inline-block text-[9px] font-bold px-1.5 py-0.2 rounded mt-2 uppercase ${
                        knot.difficulty === 'Easy' ? 'bg-brand-green/10 text-brand-green border border-brand-green/20' :
                        knot.difficulty === 'Medium' ? 'bg-amber-500/10 text-amber-600 border border-amber-500/20' :
                        'bg-rose-500/10 text-rose-600 border border-rose-500/20'
                      }`}>
                        {knot.difficulty}
                      </span>
                    </div>
                    <Compass className={`w-5 h-5 ${isSelected ? 'text-brand-green' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Interactive Step-by-Step Trainer */}
          <div className="lg:col-span-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-green/5 rounded-full filter blur-3xl" />

              {/* Knot Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-widest">
                      {selectedKnot.category} category
                    </span>
                  </div>
                  <h3 className="font-sans font-black text-2xl text-brand-green mt-1.5">{selectedKnot.name}</h3>
                  {selectedKnot.sinhalaName && (
                    <p className="text-xs text-slate-400 mt-0.5 font-sans italic">{selectedKnot.sinhalaName}</p>
                  )}
                </div>

                <div className="flex gap-2 shrink-0">
                  <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-20">
                    <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Difficulty</span>
                    <span className={`text-[10px] font-black uppercase ${
                      selectedKnot.difficulty === 'Easy' ? 'text-brand-green' :
                      selectedKnot.difficulty === 'Medium' ? 'text-amber-500' :
                      'text-rose-500'
                    }`}>
                      {selectedKnot.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              {/* Knot details info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 text-xs">
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Description:</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/60 font-light">
                    {selectedKnot.description}
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-500 uppercase tracking-wider block mb-1">Scouting Uses:</span>
                  <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded border border-slate-200/60 font-light">
                    {selectedKnot.uses}
                  </p>
                </div>
              </div>

              {/* Step Interactive Player */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 relative">
                
                {/* Graphics overlay container */}
                {renderKnotGraphics(selectedKnot.interactiveIllustration, currentStepIndex)}

                {/* Current step card */}
                <div className="bg-white border border-slate-200 p-4 rounded-lg mt-4 shadow-inner">
                  <div className="flex justify-between items-center mb-2.5">
                    <span className="text-[10px] font-bold text-brand-green uppercase tracking-wider">
                      Instruction Step {currentStepIndex + 1} of {selectedKnot.steps.length}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {Math.round(((currentStepIndex + 1) / selectedKnot.steps.length) * 100)}% Complete
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed font-sans font-medium min-h-12">
                    {selectedKnot.steps[currentStepIndex]}
                  </p>
                </div>

                {/* Progress bar line */}
                <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden mt-4">
                  <div
                    className="h-full bg-brand-green transition-all duration-300"
                    style={{ width: `${((currentStepIndex + 1) / selectedKnot.steps.length) * 100}%` }}
                  />
                </div>

                {/* Player Navigation Buttons */}
                <div className="flex items-center justify-between mt-5 gap-3">
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center space-x-1.5 px-3 py-1.5 rounded bg-white hover:bg-slate-100 border border-slate-200 transition cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={handlePrevStep}
                      disabled={currentStepIndex === 0}
                      className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        currentStepIndex === 0
                          ? 'bg-white/50 border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-600'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      <span>Back</span>
                    </button>

                    <button
                      onClick={handleNextStep}
                      disabled={currentStepIndex === selectedKnot.steps.length - 1}
                      className={`inline-flex items-center px-4 py-2 text-xs font-bold rounded-lg border transition cursor-pointer ${
                        currentStepIndex === selectedKnot.steps.length - 1
                          ? 'bg-white/50 border-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-brand-green border-brand-green hover:bg-brand-green-light text-white shadow-sm'
                      }`}
                    >
                      <span>Next Step</span>
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                </div>

              </div>

              {/* Safety Warning */}
              <div className="mt-5 p-3.5 bg-rose-500/5 border border-rose-100 rounded-xl flex items-start space-x-3 text-[11px] text-slate-500">
                <ShieldAlert className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                <p>
                  <strong className="text-rose-600 font-bold block mb-0.5">Scouting Safety:</strong>
                  Never use knots that you are unsure of for load-bearing pioneering projects or human rescue. Always have knots verified by an assistant scout master.
                </p>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
