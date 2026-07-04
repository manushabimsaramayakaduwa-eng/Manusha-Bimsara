import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle,
  BellRing,
  Smartphone,
  Eye,
  KeyRound
} from 'lucide-react';

interface UserSession {
  username: string;
  role: 'admin' | 'leader' | 'member';
  fullName: string;
  email?: string;
  whatsapp?: string;
  nic?: string;
  parentPhone?: string;
  homeAddress?: string;
}

interface MyProfileProps {
  currentUser: UserSession;
  onUpdateSession: (newSession: UserSession) => void;
  onAuditLog: (action: string) => void;
  auditLogs: string[];
}

export default function MyProfile({ currentUser, onUpdateSession, onAuditLog, auditLogs }: MyProfileProps) {
  // Local forms
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email || 'scout51@cis.edu.lk');
  const [whatsapp, setWhatsapp] = useState(currentUser.whatsapp || '+94 77 123 4567');
  const [parentPhone, setParentPhone] = useState(currentUser.parentPhone || '+94 71 999 8888');
  const [homeAddress, setHomeAddress] = useState(currentUser.homeAddress || 'No 51, Flower Road, Colombo 07');

  const [username, setUsername] = useState(currentUser.username);
  const [password, setPassword] = useState('Password@2026'); // Simulated current password
  const [newPassword, setNewPassword] = useState('');

  const [successMsg, setSuccessMsg] = useState('');

  // Handle saving general profile attributes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updated: UserSession = {
      ...currentUser,
      fullName,
      email,
      whatsapp,
      parentPhone,
      homeAddress
    };

    onUpdateSession(updated);

    // Dynamic warning logs according to user rules:
    // "11. If admin / Leader changes enything in website inform it to Admins Email or whatsapp"
    // "13. If Scout Member change thier profile's enythin inform that to Admins E mail or Whatsapp"
    let alertText = '';
    if (currentUser.role === 'admin' || currentUser.role === 'leader') {
      alertText = `[ADMIN EMAIL & WHATSAPP ALERT] - Leader ${fullName} modified their contact profile info.`;
    } else {
      alertText = `[MEMBER UPDATE DISPATCH] - Scout Member ${fullName} changed their personal profile fields. En-route to Group Scout Leader kapila@cis.lk / Whatsapp (+94 77 111 2222).`;
    }

    onAuditLog(alertText);
    setSuccessMsg('Profile details updated successfully! Live notifications dispatched.');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Handle changing credentials (username & passwords)
  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    const updated: UserSession = {
      ...currentUser,
      username
    };

    // Store in localStorage custom registration database too
    const allUsers = JSON.parse(localStorage.getItem('51_scouttrack_registered_users') || '[]');
    const userIndex = allUsers.findIndex((u: any) => u.username === currentUser.username);
    if (userIndex !== -1) {
      allUsers[userIndex].username = username;
      if (newPassword) {
        allUsers[userIndex].password = newPassword;
      }
      localStorage.setItem('51_scouttrack_registered_users', JSON.stringify(allUsers));
    }

    onUpdateSession(updated);

    let auditText = `User "${currentUser.username}" changed login credentials to username: "${username}"`;
    if (newPassword) {
      auditText += ` with a new password change request.`;
    }

    onAuditLog(`[CREDENTIALS SECURITY ALERT]: ` + auditText);
    setSuccessMsg('Credentials changed successfully! Security logs published.');
    setNewPassword('');
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  const isMember = currentUser.role === 'member';
  const isAdminOrLeader = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      
      {/* Left Columns - Form Area (8 cols) */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Success Alert */}
        {successMsg && (
          <div className="bg-emerald-50 border-l-4 border-brand-green p-4 rounded-r-lg flex items-center gap-3 animate-fadeIn">
            <CheckCircle className="w-5 h-5 text-brand-green" />
            <span className="text-xs text-slate-700 font-medium">{successMsg}</span>
          </div>
        )}

        {/* Profile Card Summary */}
        <div className="bg-gradient-to-r from-brand-green to-brand-green-light text-white p-6 sm:p-8 rounded-2xl shadow-sm border-b-4 border-brand-gold relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 relative z-10">
            <span className="text-[10px] bg-brand-gold text-brand-green font-black px-2.5 py-1 rounded uppercase tracking-wider">
              {currentUser.role} Account Profile
            </span>
            <h3 className="font-sans font-black text-2xl text-white">{currentUser.fullName}</h3>
            <p className="text-xs text-slate-100 font-light max-w-lg leading-relaxed">
              Welcome back to the 51st Colombo Portal. You have active access to the online system. Below you can edit your coordinates.
            </p>
          </div>

          <div className="w-20 h-20 bg-white/10 rounded-full border border-white/20 flex items-center justify-center text-4xl shrink-0">
            {currentUser.role === 'admin' ? '🛡️' : currentUser.role === 'leader' ? '👔' : '⚜️'}
          </div>
        </div>

        {/* Edit Contact Details Form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h4 className="font-sans font-black text-base text-brand-green border-b border-slate-100 pb-3 flex items-center gap-2">
            <User className="w-5 h-5 text-brand-gold" />
            <span>Update Contact Info</span>
          </h4>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            
            {/* Conditional Info warning for Scout Members */}
            {isMember && (
              <p className="text-[10px] text-amber-600 bg-amber-50 p-2.5 rounded-lg border border-amber-200/50 leading-relaxed font-light">
                * Note: Scout Members are only permitted to update their <strong>Name, Email, Whatsapp, Address, and Parents Contact Numbers</strong>. All other rank/badge records are managed exclusively by Leaders.
              </p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Full Name*</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Email Address*</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Whatsapp Phone Number*</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Parent's Contact Phone*</label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={parentPhone}
                    onChange={(e) => setParentPhone(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Home Address*</label>
              <div className="relative">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  value={homeAddress}
                  onChange={(e) => setHomeAddress(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-light text-white font-black uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer transition shadow-xs"
              >
                Save Contact Info
              </button>
            </div>
          </form>
        </div>

        {/* Change Username & Password credentials form */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-4">
          <h4 className="font-sans font-black text-base text-brand-green border-b border-slate-100 pb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-brand-gold" />
            <span>Secure Credentials Manager</span>
          </h4>

          <form onSubmit={handleSaveCredentials} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Active Username*</label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">New Password (Optional)</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="Leave blank to keep same"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-brand-green hover:bg-brand-green-light text-white font-black uppercase tracking-wider px-5 py-2.5 rounded-xl cursor-pointer transition shadow-xs"
              >
                Change Credentials
              </button>
            </div>
          </form>
        </div>

      </div>

      {/* Right Column - Audit Log Feed (4 cols) */}
      <div className="lg:col-span-4 space-y-4">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1 flex items-center gap-1">
          <BellRing className="w-4 h-4 text-brand-gold animate-bounce" />
          <span>Live Notifications dispatch logs</span>
        </span>

        <div className="bg-slate-900 text-slate-200 font-mono text-[10px] p-4 rounded-2xl h-[480px] overflow-y-auto space-y-2 border border-slate-800 shadow-lg text-left">
          <div className="text-brand-gold border-b border-slate-800 pb-1.5 uppercase font-bold text-[9px] tracking-widest flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Secure Web & SMS Relay log</span>
          </div>

          <div className="space-y-2.5">
            {auditLogs.slice().reverse().map((log, i) => (
              <div key={i} className="leading-normal p-1.5 border-b border-slate-800/40">
                <span className="text-emerald-500">[{new Date().toLocaleTimeString()}]</span> {log}
              </div>
            ))}

            {auditLogs.length === 0 && (
              <p className="text-slate-500 italic font-light pt-4">No recent notification alerts dispatched to Admin email/WhatsApp.</p>
            )}
          </div>
        </div>
      </div>

    </div>
  );
}
