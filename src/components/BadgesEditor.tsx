import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit, 
  X, 
  Image, 
  HelpCircle, 
  CheckCircle,
  FolderOpen,
  BookOpen,
  Check,
  MapPin,
  Sparkles
} from 'lucide-react';
import { BADGES_DATA } from '../data';

interface Badge {
  id: string;
  name: string;
  category: 'Cubs' | 'Public Service' | 'Outdoors' | 'Specialist' | 'Water Sports';
  icon: string; // Emoji
  imageUrl?: string;
  requirements: string[];
}

interface AwardType {
  id: string;
  title: string;
  minBadgesRequired: number;
  badgeLevel: string;
}

const INITIAL_AWARDS: AwardType[] = [
  { id: 'aw-1', title: 'President Scout Award', minBadgesRequired: 8, badgeLevel: 'First Class' },
  { id: 'aw-2', title: 'Gold Star Badge', minBadgesRequired: 5, badgeLevel: 'Cub Star' },
  { id: 'aw-3', title: 'Bushman\'s Thong Award', minBadgesRequired: 6, badgeLevel: 'Second Class' }
];

interface BadgesEditorProps {
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onAuditLog: (action: string) => void;
}

export default function BadgesEditor({ currentUser, onAuditLog }: BadgesEditorProps) {
  const [badges, setBadges] = useState<Badge[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_proficiency_badges');
    if (saved) return JSON.parse(saved);
    
    // Map initial data nicely
    return BADGES_DATA.map(b => ({
      id: b.id,
      name: b.name,
      category: b.section === 'cubs' ? 'Cubs' : b.id.includes('athlete') ? 'Specialist' : 'Outdoors',
      icon: b.icon,
      requirements: ['Must complete SLSA syllabus', 'Must demonstrate practice in front of Leader'],
      imageUrl: b.id.includes('camper') 
        ? 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80'
        : 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&w=400&q=80'
    }));
  });

  const [awards, setAwards] = useState<AwardType[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_awards_list');
    return saved ? JSON.parse(saved) : INITIAL_AWARDS;
  });

  const [activeTab, setActiveTab] = useState<'badges' | 'awards'>('badges');

  // Edit forms
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingBadgeId, setEditingBadgeId] = useState<string | null>(null);
  const [badgeName, setBadgeName] = useState('');
  const [badgeCategory, setBadgeCategory] = useState<'Cubs' | 'Public Service' | 'Outdoors' | 'Specialist' | 'Water Sports'>('Outdoors');
  const [badgeIcon, setBadgeIcon] = useState('🏅');
  const [badgeImgUrl, setBadgeImgUrl] = useState('');
  const [badgeReqs, setBadgeReqs] = useState('');

  // Award forms
  const [isAwardOpen, setIsAwardOpen] = useState(false);
  const [editingAwardId, setEditingAwardId] = useState<string | null>(null);
  const [awardTitle, setAwardTitle] = useState('');
  const [awardMinBadges, setAwardMinBadges] = useState(6);
  const [awardLevel, setAwardLevel] = useState('First Class');

  useEffect(() => {
    localStorage.setItem('51_scouttrack_proficiency_badges', JSON.stringify(badges));
  }, [badges]);

  useEffect(() => {
    localStorage.setItem('51_scouttrack_awards_list', JSON.stringify(awards));
  }, [awards]);

  const handleOpenEditBadge = (badge: Badge) => {
    setEditingBadgeId(badge.id);
    setBadgeName(badge.name);
    setBadgeCategory(badge.category);
    setBadgeIcon(badge.icon);
    setBadgeImgUrl(badge.imageUrl || '');
    setBadgeReqs(badge.requirements.join('\n'));
    setIsEditOpen(true);
  };

  const handleOpenAddBadge = () => {
    setEditingBadgeId(null);
    setBadgeName('');
    setBadgeCategory('Outdoors');
    setBadgeIcon('🏅');
    setBadgeImgUrl('');
    setBadgeReqs('1. Must fulfill Colombo 51 Troop standards.');
    setIsEditOpen(true);
  };

  const handleSaveBadge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!badgeName.trim()) return;

    if (editingBadgeId) {
      // Edit
      setBadges(prev => prev.map(b => b.id === editingBadgeId ? {
        ...b,
        name: badgeName.trim(),
        category: badgeCategory,
        icon: badgeIcon,
        imageUrl: badgeImgUrl.trim(),
        requirements: badgeReqs.split('\n').filter(r => r.trim() !== '')
      } : b));

      const logMsg = `Admin/Leader (${currentUser.fullName}) edited proficiency badge: "${badgeName}" details & photo URL`;
      onAuditLog(logMsg);
    } else {
      // Create new badge
      const newBadge: Badge = {
        id: `bdg-${Date.now()}`,
        name: badgeName.trim(),
        category: badgeCategory,
        icon: badgeIcon,
        imageUrl: badgeImgUrl.trim() || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80',
        requirements: badgeReqs.split('\n').filter(r => r.trim() !== '')
      };

      setBadges(prev => [...prev, newBadge]);
      const logMsg = `Admin/Leader (${currentUser.fullName}) created a new proficiency badge: "${newBadge.name}"`;
      onAuditLog(logMsg);
    }

    setIsEditOpen(false);
  };

  const handleDeleteBadge = (id: string, name: string) => {
    if (!confirm(`Delete proficiency badge "${name}"?`)) return;

    setBadges(prev => prev.filter(b => b.id !== id));
    onAuditLog(`Admin/Leader (${currentUser.fullName}) deleted badge "${name}" from curriculum.`);
  };

  // Awards logic
  const handleOpenEditAward = (aw: AwardType) => {
    setEditingAwardId(aw.id);
    setAwardTitle(aw.title);
    setAwardMinBadges(aw.minBadgesRequired);
    setAwardLevel(aw.badgeLevel);
    setIsAwardOpen(true);
  };

  const handleOpenAddAward = () => {
    setEditingAwardId(null);
    setAwardTitle('');
    setAwardMinBadges(5);
    setAwardLevel('First Class');
    setIsAwardOpen(true);
  };

  const handleSaveAward = (e: React.FormEvent) => {
    e.preventDefault();
    if (!awardTitle.trim()) return;

    if (editingAwardId) {
      setAwards(prev => prev.map(aw => aw.id === editingAwardId ? {
        ...aw,
        title: awardTitle.trim(),
        minBadgesRequired: Number(awardMinBadges),
        badgeLevel: awardLevel
      } : aw));

      onAuditLog(`Admin/Leader (${currentUser.fullName}) modified Award: "${awardTitle}"`);
    } else {
      const newAw: AwardType = {
        id: `aw-${Date.now()}`,
        title: awardTitle.trim(),
        minBadgesRequired: Number(awardMinBadges),
        badgeLevel: awardLevel
      };
      setAwards(prev => [...prev, newAw]);
      onAuditLog(`Admin/Leader (${currentUser.fullName}) added a new official Award: "${newAw.title}"`);
    }

    setIsAwardOpen(false);
  };

  const handleDeleteAward = (id: string, title: string) => {
    if (!confirm(`Permanently delete the award "${title}"?`)) return;

    setAwards(prev => prev.filter(aw => aw.id !== id));
    onAuditLog(`Admin/Leader (${currentUser.fullName}) removed Award: "${title}"`);
  };

  const isEligibleToEdit = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="space-y-6 text-left">
      
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h3 className="font-sans font-black text-xl text-brand-green flex items-center gap-2">
            <Award className="w-5 h-5 text-brand-gold" />
            <span>⚜️ Badges & Troop Awards Curriculum</span>
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Configure different categories of Proficiency Badges and official Scout Honors. Leaders modify syllabus specifications.
          </p>
        </div>

        {/* Tab switch */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 gap-1 shrink-0 self-start">
          <button
            onClick={() => setActiveTab('badges')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'badges' ? 'bg-brand-green text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Badges
          </button>
          <button
            onClick={() => setActiveTab('awards')}
            className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer ${
              activeTab === 'awards' ? 'bg-brand-green text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Awards
          </button>
        </div>
      </div>

      {/* Role Notice */}
      <div className="bg-amber-50 border-l-4 border-brand-gold p-4 rounded-r-xl flex items-start gap-3 text-xs leading-relaxed text-slate-600 font-light">
        <HelpCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p>
            <strong>Role Constraint Notice:</strong> Scout leaders and admins can edit badge properties, categories, requirements and upload photos. However, <strong>Leaders/Admins cannot earn badges or awards themselves in this website.</strong> Only youth registered Scout Members are eligible to hold active earned badge portfolios.
          </p>
        </div>
      </div>

      {/* Adding buttons */}
      {isEligibleToEdit && (
        <div className="flex justify-end pt-1">
          {activeTab === 'badges' ? (
            <button
              onClick={handleOpenAddBadge}
              className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Badge</span>
            </button>
          ) : (
            <button
              onClick={handleOpenAddAward}
              className="bg-brand-green hover:bg-brand-green-light text-white text-xs font-black uppercase tracking-wider px-3.5 py-2 rounded-xl cursor-pointer flex items-center gap-1.5 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Create Award</span>
            </button>
          )}
        </div>
      )}

      {/* Tab 1: Badges display */}
      {activeTab === 'badges' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {badges.map(b => (
            <div 
              key={b.id}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-sm hover:border-brand-gold/30 transition flex flex-col justify-between"
            >
              <div>
                {/* Photo space */}
                <div className="h-32 bg-slate-100 relative overflow-hidden">
                  <img 
                    src={b.imageUrl || 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&w=400&q=80'} 
                    alt={b.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                  
                  {/* Category overlay */}
                  <span className="absolute top-2.5 left-2.5 bg-brand-green/90 text-white text-[8px] font-black uppercase px-2 py-0.5 rounded tracking-widest">
                    {b.category}
                  </span>

                  <span className="absolute bottom-2 left-2 text-2xl">
                    {b.icon}
                  </span>
                </div>

                <div className="p-4 space-y-3">
                  <h4 className="font-sans font-black text-sm text-slate-800 leading-tight">
                    {b.name} Badge
                  </h4>

                  <div className="space-y-1">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Syllabus Requirements</span>
                    <ul className="list-disc list-inside text-[11px] text-slate-500 space-y-1 pl-1 font-light leading-relaxed">
                      {b.requirements.map((req, idx) => (
                        <li key={idx} className="truncate" title={req}>{req}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Edit bar footer */}
              {isEligibleToEdit && (
                <div className="bg-slate-50/80 border-t border-slate-100 p-3 flex items-center justify-between text-[10px] font-bold">
                  <span className="text-slate-400 font-mono">ID: {b.id.substring(0, 10)}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEditBadge(b)}
                      className="p-1.5 text-slate-500 hover:text-brand-green hover:bg-white rounded transition cursor-pointer"
                      title="Edit properties"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBadge(b.id, b.name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-white rounded transition cursor-pointer"
                      title="Delete Badge"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Awards display */}
      {activeTab === 'awards' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {awards.map(aw => (
            <div 
              key={aw.id}
              className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs hover:border-brand-gold/30 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">🏆</span>
                  <span className="text-[10px] bg-amber-500/10 text-amber-600 font-black px-2 py-0.5 rounded uppercase">
                    Level: {aw.badgeLevel}
                  </span>
                </div>

                <div>
                  <h4 className="font-sans font-black text-sm text-slate-800">{aw.title}</h4>
                  <p className="text-xs text-slate-500 font-light mt-1 leading-relaxed">
                    Awarded upon earning at least <strong>{aw.minBadgesRequired} Proficiency Badges</strong> at the {aw.badgeLevel} scope level.
                  </p>
                </div>
              </div>

              {isEligibleToEdit && (
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end gap-1.5">
                  <button
                    onClick={() => handleOpenEditAward(aw)}
                    className="p-1.5 text-slate-400 hover:text-brand-green hover:bg-slate-50 rounded transition cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteAward(aw.id, aw.title)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* --- EDIT BADGE DIALOG --- */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">
              {editingBadgeId ? 'Edit Badge Properties' : 'Create Proficiency Badge'}
            </h3>

            <form onSubmit={handleSaveBadge} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Badge Name*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Backwoods Camper"
                    value={badgeName}
                    onChange={(e) => setBadgeName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Badge Emoji*</label>
                  <input
                    type="text"
                    required
                    value={badgeIcon}
                    onChange={(e) => setBadgeIcon(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Category*</label>
                <select
                  value={badgeCategory}
                  onChange={(e: any) => setBadgeCategory(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                >
                  <option value="Cubs">Cubs Section Badge</option>
                  <option value="Outdoors">Outdoors & Pioneering</option>
                  <option value="Public Service">Public Service & Civics</option>
                  <option value="Specialist">Specialist Hobbies</option>
                  <option value="Water Sports">Water Sports & Rescue</option>
                </select>
              </div>

              {/* IMAGE BOX SPECIFIC FOR PHOTO */}
              <div className="space-y-1 border-2 border-dashed border-slate-200 p-3 rounded-xl bg-slate-50">
                <label className="text-[10px] font-black text-brand-green uppercase tracking-wider block flex items-center gap-1">
                  <Image className="w-3.5 h-3.5 text-brand-gold" />
                  <span>Badge Graphic / Illustration Photo (Image Box)*</span>
                </label>
                <input
                  type="url"
                  placeholder="Paste badge vector image url..."
                  value={badgeImgUrl}
                  onChange={(e) => setBadgeImgUrl(e.target.value)}
                  className="w-full bg-white border border-slate-200 rounded-lg p-2 text-xs font-mono text-slate-800 focus:outline-none mt-1.5"
                />
                <span className="text-[9px] text-slate-400 italic block mt-1">
                  Specify any public visual image url to update the graphic!
                </span>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Requirements (One per line)*</label>
                <textarea
                  required
                  rows={3}
                  value={badgeReqs}
                  onChange={(e) => setBadgeReqs(e.target.value)}
                  placeholder="e.g. Complete 5 nights under standard self-made canvas..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light shadow-xs"
                >
                  Save Badge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- EDIT AWARD DIALOG --- */}
      {isAwardOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-4">
            <h3 className="font-sans font-black text-lg text-brand-green border-b border-slate-100 pb-3">
              {editingAwardId ? 'Modify Award Honors' : 'Add Official Award'}
            </h3>

            <form onSubmit={handleSaveAward} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Award Title*</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bushman's Thong Medal"
                  value={awardTitle}
                  onChange={(e) => setAwardTitle(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Min Badges Required*</label>
                  <input
                    type="number"
                    required
                    value={awardMinBadges}
                    onChange={(e) => setAwardMinBadges(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Syllabus Scope level*</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. First Class / Cub Star"
                    value={awardLevel}
                    onChange={(e) => setAwardLevel(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAwardOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg font-bold uppercase hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-brand-green text-white rounded-lg font-bold uppercase hover:bg-brand-green-light shadow-xs"
                >
                  Save Award
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
