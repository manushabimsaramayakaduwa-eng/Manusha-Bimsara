import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  UserPlus, 
  Sparkles,
  Award,
  ArrowRightLeft
} from 'lucide-react';

interface Patrol {
  id: string;
  name: string;
  description: string;
}

const INITIAL_PATROLS: Patrol[] = [
  { id: 'pat-1', name: 'Salalihini', description: 'Graceful and sharp communication focus' },
  { id: 'pat-2', name: 'Woodpecker', description: 'Hardworking craftsmanship and survival focus' },
  { id: 'pat-3', name: 'Pigeon', description: 'Peace and direction focus' },
  { id: 'pat-4', name: 'Eagle', description: 'Soaring high pioneering and leadership focus' },
  { id: 'pat-5', name: 'Parrot', description: 'Lively community service and vocal expression' },
  { id: 'pat-6', name: 'Kingfisher', description: 'Agile athletics and water navigation focus' },
  { id: 'pat-7', name: 'Hawk', description: 'Vigilant map-reading and tracking focus' },
  { id: 'pat-8', name: 'Senior', description: 'Advanced emergency first aid and Rover guidance' }
];

interface ScoutMember {
  id: string;
  name: string;
  patrol: string;
  role: string;
}

interface PatrolManagerProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  scouts: ScoutMember[];
  onUpdateScoutPatrol: (scoutId: string, newPatrolName: string) => void;
  onAuditLog: (action: string) => void;
}

export default function PatrolManager({ currentUser, scouts, onUpdateScoutPatrol, onAuditLog }: PatrolManagerProps) {
  const [patrols, setPatrols] = useState<Patrol[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_patrols');
    return saved ? JSON.parse(saved) : INITIAL_PATROLS;
  });

  const [newPatrolName, setNewPatrolName] = useState('');
  const [newPatrolDesc, setNewPatrolDesc] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Transfer Member state
  const [transferScoutId, setTransferScoutId] = useState('');
  const [transferPatrolName, setTransferPatrolName] = useState('');
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('51_scouttrack_patrols', JSON.stringify(patrols));
  }, [patrols]);

  const handleAddPatrol = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPatrolName.trim()) return;

    const exists = patrols.some(p => p.name.toLowerCase() === newPatrolName.trim().toLowerCase());
    if (exists) {
      alert('Error: A patrol with this name already exists.');
      return;
    }

    const newPat: Patrol = {
      id: `pat-${Date.now()}`,
      name: newPatrolName.trim(),
      description: newPatrolDesc.trim() || 'Custom patrol unit of the 51st Colombo.'
    };

    setPatrols(prev => [...prev, newPat]);
    setIsAddOpen(false);
    setNewPatrolName('');
    setNewPatrolDesc('');

    const logMsg = `Admin/Leader (${currentUser.fullName}) created patrol: "${newPat.name}"`;
    onAuditLog(logMsg);
  };

  const handleDeletePatrol = (id: string, name: string) => {
    if (!confirm(`Are you sure you want to permanently dissolve the "${name}" Patrol?`)) return;

    setPatrols(prev => prev.filter(p => p.id !== id));
    
    // Dissolved patrols leave members without a patrol or we move them to 'Unassigned'
    scouts.forEach(s => {
      if (s.patrol === name) {
        onUpdateScoutPatrol(s.id, 'Unassigned');
      }
    });

    const logMsg = `Admin/Leader (${currentUser.fullName}) dissolved patrol: "${name}"`;
    onAuditLog(logMsg);
  };

  const handleTransferMember = (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferScoutId || !transferPatrolName) return;

    const targetScout = scouts.find(s => s.id === transferScoutId);
    onUpdateScoutPatrol(transferScoutId, transferPatrolName);
    setIsTransferOpen(false);

    const logMsg = `Admin/Leader (${currentUser.fullName}) reassigned scout "${targetScout?.name}" to "${transferPatrolName}" Patrol`;
    onAuditLog(logMsg);
    
    setTransferScoutId('');
    setTransferPatrolName('');
  };

  const canEdit = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="space-y-6 text-left">
      
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-gold" />
            <span>⚜️ Troop Patrol Divisions</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Group, organize, and assign scout members into patrols. Admins can add or remove patrol divisions.
          </p>
        </div>

        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsTransferOpen(true)}
              className="border border-brand-gold text-brand-green hover:bg-brand-gold hover:text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Transfer Member</span>
            </button>

            <button
              onClick={() => setIsAddOpen(true)}
              className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Add Patrol</span>
            </button>
          </div>
        )}
      </div>

      {/* Patrol Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patrols.map(pat => {
          // Find members assigned to this patrol
          const patrolMembers = scouts.filter(s => s.patrol.toLowerCase().includes(pat.name.toLowerCase()));

          return (
            <div 
              key={pat.id}
              className="bg-white border-2 border-slate-200/80 rounded-2xl p-5 shadow-xs relative hover:border-brand-gold/40 transition flex flex-col justify-between"
            >
              <div>
                {/* Header info */}
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <h4 className="font-sans font-black text-sm text-brand-green flex items-center gap-1">
                      <span>🦅</span>
                      <span>{pat.name} Patrol</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 font-light leading-relaxed">
                      {pat.description}
                    </p>
                  </div>

                  {canEdit && (
                    <button
                      onClick={() => handleDeletePatrol(pat.id, pat.name)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition shrink-0"
                      title="Dissolve Patrol"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Member Listing */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2">
                  <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider leading-none mb-1">
                    Assigned Scouts ({patrolMembers.length})
                  </span>

                  <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                    {patrolMembers.map(m => (
                      <div 
                        key={m.id}
                        className="bg-slate-50 border border-slate-100 p-2 rounded-lg flex items-center justify-between text-[11px]"
                      >
                        <span className="font-semibold text-slate-700">{m.name}</span>
                        <span className="text-[8px] bg-brand-green/10 text-brand-green font-black px-1.5 rounded uppercase">
                          {m.role}
                        </span>
                      </div>
                    ))}

                    {patrolMembers.length === 0 && (
                      <p className="text-[10px] text-slate-400 italic font-light">No members assigned to this patrol yet.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Bottom footer detail */}
              <div className="mt-4 pt-2.5 border-t border-slate-100 flex items-center gap-1.5 text-[10px] text-brand-gold-hover font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                <span>51st Colombo Division Unit</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* --- ADD PATROL DIALOG MODAL --- */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">Register Patrol Division</h3>
            <form onSubmit={handleAddPatrol} className="space-y-4">
              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Patrol Name*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Salalihini / Eagle / Woodpecker"
                  value={newPatrolName}
                  onChange={(e) => setNewPatrolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1 text-xs">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Motto / Focus Description</label>
                <input
                  type="text"
                  placeholder="e.g. Sharp reflexes and survival wisdom"
                  value={newPatrolDesc}
                  onChange={(e) => setNewPatrolDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
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
                  Register Patrol
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TRANSFER MEMBER DIALOG MODAL --- */}
      {isTransferOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">Reassign Scout Patrol Unit</h3>
            <form onSubmit={handleTransferMember} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Scout Member*</label>
                <select
                  required
                  value={transferScoutId}
                  onChange={(e) => setTransferScoutId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value="">-- Choose Member --</option>
                  {scouts.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Select Target Patrol*</label>
                <select
                  required
                  value={transferPatrolName}
                  onChange={(e) => setTransferPatrolName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value="">-- Choose Patrol --</option>
                  {patrols.map(p => (
                    <option key={p.id} value={p.name}>{p.name} Patrol</option>
                  ))}
                  <option value="Unassigned">Unassigned (Reserve)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTransferOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light"
                >
                  Complete Transfer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
