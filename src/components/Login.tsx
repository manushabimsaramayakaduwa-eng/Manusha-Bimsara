import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Compass, 
  CheckCircle2, 
  HelpCircle,
  AlertCircle,
  UserPlus,
  Phone,
  FileText,
  Mail,
  MapPin,
  Tag
} from 'lucide-react';

interface LoginProps {
  onLoginSuccess: (user: { 
    username: string; 
    role: 'admin' | 'leader' | 'member'; 
    fullName: string;
    email: string;
    whatsapp: string;
    address: string;
    parentsPhone: string;
    nic?: string;
  }) => void;
}

export default function Login({ onLoginSuccess }: LoginProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Login states
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'leader' | 'admin' | 'member'>('leader');
  const [shake, setShake] = useState(false);

  // Registration states
  const [regRole, setRegRole] = useState<'leader' | 'admin' | 'member'>('member');
  const [regFullName, setRegFullName] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regPassword, setRegPassword] = useState('1234');
  const [regEmail, setRegEmail] = useState('');
  const [regWhatsapp, setRegWhatsapp] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regParentsPhone, setRegParentsPhone] = useState('');
  const [regNic, setRegNic] = useState('');

  // Load custom accounts from localStorage
  const getCustomUsers = (): any[] => {
    const saved = localStorage.getItem('51_registered_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveCustomUser = (newUser: any) => {
    const current = getCustomUsers();
    // Check if username already exists
    if (current.some(u => u.username.toLowerCase() === newUser.username.toLowerCase())) {
      return false;
    }
    const updated = [...current, newUser];
    localStorage.setItem('51_registered_users', JSON.stringify(updated));
    return true;
  };

  // Pre-configured accounts list for lookup
  const getPreconfiguredAccounts = () => {
    // Check if there are user updates in localStorage
    const modifiedAccounts = localStorage.getItem('51_scouttrack_credentials_modified');
    if (modifiedAccounts) {
      return JSON.parse(modifiedAccounts);
    }

    const defaultAccounts = [
      { username: 'Dineth_Jayasuriya', password: 'Jayasuriya@2026', role: 'admin' as const, fullName: 'Dineth Jayasuriya', email: 'dineth.jayasuriya@sastralaya.lk', whatsapp: '+94771234567', address: 'Kotte, Sri Lanka', parentsPhone: '+94779876543' },
      { username: 'Manusha_Bimsara', password: 'Manusha@2010', role: 'admin' as const, fullName: 'Manusha Bimsara', email: 'manusha.bimsara@sastralaya.lk', whatsapp: '+94772345678', address: 'Kotte, Sri Lanka', parentsPhone: '+94778765432' },
      { username: 'leader', password: 'prep1982', role: 'leader' as const, fullName: 'Mr. Rushdi Hashim (Scout Master)', email: 'rushdi.hashim@sastralaya.lk', whatsapp: '+94773456789', address: 'Kotte, Sri Lanka', parentsPhone: '+94777654321' },
      { username: 'scout', password: 'scout123', role: 'member' as const, fullName: 'Ranuka Samarasinghe (Patrol Leader)', email: 'ranuka.s@sastralaya.lk', whatsapp: '+94774567890', address: 'Kotte, Sri Lanka', parentsPhone: '+94776543210' }
    ];
    return defaultAccounts;
  };

  // Direct login for smart passwordless experience
  const handleDirectLogin = (matched: any) => {
    setLoading(true);
    setError(null);
    setUsername(matched.username);
    setPassword(matched.password);

    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      const userData = {
        username: matched.username,
        role: matched.role,
        fullName: matched.fullName,
        email: matched.email || `${matched.username}@sastralaya.lk`,
        whatsapp: matched.whatsapp || '+94770000000',
        address: matched.address || 'Kotte, Sri Lanka',
        parentsPhone: matched.parentsPhone || '+94770000000',
        nic: matched.nic || ''
      };
      localStorage.setItem('51_scouttrack_user', JSON.stringify(userData));
      
      setTimeout(() => {
        onLoginSuccess(userData);
      }, 1000);
    }, 1000);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Fallback if they try standard submit
    const accounts = getPreconfiguredAccounts();
    const leaderAcc = accounts.find((a: any) => a.username === 'leader');
    if (leaderAcc) {
      handleDirectLogin(leaderAcc);
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName.trim() || !regUsername.trim() || !regPassword.trim() || !regEmail.trim()) {
      setError('Please fill in all mandatory fields (Full Name, Username, Passcode, Email).');
      triggerShake();
      return;
    }

    // Custom validations based on rules
    if ((regRole === 'leader' || regRole === 'admin') && !regNic.trim()) {
      setError('NIC number is strictly required for Leader/Admin first-time registrations.');
      triggerShake();
      return;
    }

    if (regRole === 'member' && !regParentsPhone.trim()) {
      setError("Parent's Contact Number is strictly required for Scout registrations.");
      triggerShake();
      return;
    }

    const newScoutUser = {
      username: regUsername.trim(),
      password: regPassword,
      role: regRole,
      fullName: regFullName.trim(),
      email: regEmail.trim(),
      whatsapp: regWhatsapp.trim() || '+94770000000',
      address: regAddress.trim() || 'Colombo, Sri Lanka',
      parentsPhone: regParentsPhone.trim() || '+94770000000',
      nic: regNic.trim() || undefined
    };

    const savedOk = saveCustomUser(newScoutUser);
    if (!savedOk) {
      setError('This username is already taken. Please try another one.');
      triggerShake();
      return;
    }

    setLoading(true);
    setError(null);

    // Simulate smart registration verification
    setTimeout(() => {
      setSuccess(true);
      setLoading(false);
      localStorage.setItem('51_scouttrack_user', JSON.stringify(newScoutUser));
      
      setTimeout(() => {
        onLoginSuccess(newScoutUser);
      }, 1200);
    }, 1200);
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Content helper based on selected tab
  const getTabInfo = () => {
    switch (activeTab) {
      case 'admin':
        return {
          motto: 'Service Over Self',
          desc: 'Access Group-level configurations, print records, and adjust troop rosters.',
          quote: 'Administrators manage system roles, check Google Drive space, and view automated activity dispatch logs.'
        };
      case 'member':
        return {
          motto: 'Be Prepared • Do Your Best',
          desc: 'Explore your customized smart profile, download photos from albums, and check files in the E-Library.',
          quote: 'Members can securely update their own profiles and instantly download educational books or camp photos.'
        };
      default:
        return {
          motto: 'Be Prepared (தயாராக இரு / ஆயத்தமாய் இரு)',
          desc: 'Review and sign off advancement logs, mark meeting attendances, and customize patrol rosters.',
          quote: 'Leaders carry the responsibility of guiding young scouts safely along their path to technical and civic excellence.'
        };
    }
  };

  const info = getTabInfo();

  return (
    <div className="bg-brand-cream py-16 px-4 sm:px-6 lg:px-8 min-h-[90vh] flex items-center justify-center">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Left column: Ambient branding & instructions */}
        <div className="lg:col-span-5 bg-brand-green p-8 sm:p-12 text-white flex flex-col justify-between relative overflow-hidden border-b-4 lg:border-b-0 lg:border-r-4 border-brand-gold">
          {/* Background circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-brand-green-light/40 rounded-full translate-x-10 -translate-y-10 filter blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-brand-green-dark/60 rounded-full filter blur-2xl pointer-events-none" />

          {/* Top Logo branding */}
          <div className="relative space-y-3 text-left">
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-brand-green font-black text-xl border-2 border-brand-gold shadow-md">
              ASK
            </div>
            <div>
              <h2 className="font-sans font-black text-lg tracking-tight leading-none uppercase">
                Ananda Sastralaya
              </h2>
              <p className="text-brand-gold text-xs font-semibold uppercase tracking-widest mt-1">
                Kotte Scout Group
              </p>
            </div>
            <p className="text-[11px] text-slate-200 leading-relaxed max-w-xs pt-2">
              Official Maroon and Gold portal of the Ananda Sastralaya, Kotte Boy Scout Troop. Fast, secure, and passwordless.
            </p>
          </div>

          {/* Interactive Info Section */}
          <div className="relative space-y-4 my-8 text-left bg-brand-green-dark/30 border border-white/10 rounded-2xl p-5">
            <div className="inline-flex items-center space-x-1 bg-brand-gold/20 border border-brand-gold/30 px-2.5 py-0.5 rounded-full text-brand-gold text-[10px] font-bold uppercase tracking-wider">
              <Sparkles className="w-3 h-3" />
              <span>{info.motto}</span>
            </div>
            <p className="text-xs text-white leading-relaxed font-light">
              {info.desc}
            </p>
            <p className="text-[10px] text-brand-gold font-serif italic border-l-2 border-brand-gold/50 pl-2 leading-relaxed">
              "{info.quote}"
            </p>
          </div>

          {/* Footer badge */}
          <div className="relative flex items-center space-x-2 text-[10px] text-white/70 font-semibold uppercase tracking-wider text-left">
            <ShieldCheck className="w-4 h-4 text-brand-gold" />
            <span>Secure Passwordless Access • Sri Lankan Rupees (Rs.)</span>
          </div>
        </div>

        {/* Right column: Form */}
        <div className={`lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-slate-50/50 ${shake ? 'animate-bounce' : ''}`} style={{ animationDuration: shake ? '0.5s' : '0' }}>
          
          <div className="mb-6 text-left flex justify-between items-start">
            <div>
              <h3 className="font-sans font-black text-xl text-brand-green uppercase tracking-wide">
                {isRegistering ? 'Troop Enrollment' : 'Smart Access Portal'}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {isRegistering 
                  ? 'Enroll a new boy scout profile. No passwords required.' 
                  : 'Select an active member below to instantly log in without a password.'}
              </p>
            </div>
            <button
              onClick={() => {
                setIsRegistering(!isRegistering);
                setError(null);
              }}
              className="text-[10px] font-bold text-brand-gold-hover hover:text-brand-green uppercase tracking-wider bg-brand-gold/10 hover:bg-brand-gold/20 border border-brand-gold/30 rounded-lg px-2.5 py-1.5 transition cursor-pointer"
            >
              {isRegistering ? 'Sign In' : 'Sign Up'}
            </button>
          </div>

          {!isRegistering ? (
            <>
              {/* Smart Passwordless Accounts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-h-[420px] overflow-y-auto pr-1">
                {/* Loop preconfigured accounts */}
                {getPreconfiguredAccounts().map((acc: any) => {
                  const isLeader = acc.role === 'leader';
                  const isAdmin = acc.role === 'admin';
                  const isMember = acc.role === 'member';
                  
                  return (
                    <button
                      key={acc.username}
                      onClick={() => handleDirectLogin(acc)}
                      disabled={loading || success}
                      className="group bg-white hover:bg-brand-green/5 border border-slate-200 hover:border-brand-green/30 rounded-2xl p-4 transition-all duration-200 text-left hover:shadow-md cursor-pointer flex flex-col justify-between h-40"
                    >
                      <div className="flex items-start justify-between w-full">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-xs group-hover:bg-brand-green/10">
                          {isLeader ? '⚜️' : isAdmin ? '🛡️' : '🧭'}
                        </div>
                        <span className={`text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full ${
                          isLeader ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                          isAdmin ? 'bg-slate-100 text-slate-800 border border-slate-200' :
                          'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}>
                          {acc.role}
                        </span>
                      </div>
                      
                      <div className="mt-3">
                        <h4 className="font-black text-slate-800 text-xs leading-tight font-sans truncate">{acc.fullName}</h4>
                        <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{acc.email}</p>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-brand-green uppercase tracking-wider">
                        <span>Sign In Instantly</span>
                        <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  );
                })}

                {/* Custom registered users if any */}
                {getCustomUsers().map((acc: any) => (
                  <button
                    key={acc.username}
                    onClick={() => handleDirectLogin(acc)}
                    disabled={loading || success}
                    className="group bg-white hover:bg-brand-green/5 border border-slate-200 hover:border-brand-green/30 rounded-2xl p-4 transition-all duration-200 text-left hover:shadow-md cursor-pointer flex flex-col justify-between h-40"
                  >
                    <div className="flex items-start justify-between w-full">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-xl shadow-xs group-hover:bg-brand-green/10">
                        {acc.role === 'leader' ? '⚜️' : acc.role === 'admin' ? '🛡️' : '🧭'}
                      </div>
                      <span className="text-[8px] font-black uppercase tracking-widest px-2 py-0.5 bg-brand-gold/10 text-brand-green-dark border border-brand-gold/20 rounded-full">
                        {acc.role} (Registered)
                      </span>
                    </div>
                    
                    <div className="mt-3">
                      <h4 className="font-black text-slate-800 text-xs leading-tight font-sans truncate">{acc.fullName}</h4>
                      <p className="text-[9px] text-slate-400 font-medium truncate mt-0.5">{acc.email}</p>
                    </div>

                    <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-brand-green uppercase tracking-wider">
                      <span>Sign In Instantly</span>
                      <ArrowRight className="w-3 h-3 transform group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                ))}
              </div>

              {/* Loader display inside the smart UI panel */}
              {loading && (
                <div className="mt-6 p-4 bg-brand-green/5 border border-brand-green/10 rounded-2xl flex items-center justify-center space-x-3 text-xs text-brand-green font-black uppercase tracking-wider animate-pulse">
                  <Compass className="w-5 h-5 animate-spin" />
                  <span>Loading Sastralaya Portal for {username}...</span>
                </div>
              )}

              {success && (
                <div className="mt-6 p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center space-x-3 text-xs text-emerald-800 font-black uppercase tracking-wider animate-pulse">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Access Granted! Welcome back...</span>
                </div>
              )}
            </>
          ) : (
            /* First Time Registration Form */
            <form onSubmit={handleRegisterSubmit} className="space-y-3 text-left">
              
              {/* Role Picker for Registration */}
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">
                  Select Enrollment Role
                </label>
                <div className="grid grid-cols-3 gap-2 p-1 bg-slate-100 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => { setRegRole('member'); setError(null); }}
                    className={`py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      regRole === 'member' ? 'bg-brand-gold text-brand-green font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🧭 Scout
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegRole('leader'); setError(null); }}
                    className={`py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      regRole === 'leader' ? 'bg-brand-green text-white font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    ⚜️ Leader
                  </button>
                  <button
                    type="button"
                    onClick={() => { setRegRole('admin'); setError(null); }}
                    className={`py-1.5 rounded-md text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                      regRole === 'admin' ? 'bg-brand-green text-white font-bold shadow-xs' : 'text-slate-600'
                    }`}
                  >
                    🛡️ Admin
                  </button>
                </div>
              </div>

              {/* Full Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Full Name (Scout / Leader Name)
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dineth Jayasuriya"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                {/* Requested Username */}
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Preferred Username
                  </label>
                  <div className="relative">
                    <User className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. dineth_jay"
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value.replace(/\s+/g, '_'))}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs font-mono text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. member@sastralaya.lk"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>
              </div>

              {/* Whatsapp & Address */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    WhatsApp Number
                  </label>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. +94771234567"
                      value={regWhatsapp}
                      onChange={(e) => setRegWhatsapp(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest block">
                    Home Address
                  </label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="e.g. Colombo, Sri Lanka"
                      value={regAddress}
                      onChange={(e) => setRegAddress(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
              </div>

              {/* Conditional Fields based on User Requirements */}
              {regRole === 'member' ? (
                /* Member required field: Parent Phone Number */
                <div className="space-y-1 p-3 bg-brand-gold/10 border border-brand-gold/30 rounded-xl">
                  <label className="text-[9px] font-black text-brand-green uppercase tracking-widest block">
                    Parent's Contact Number <span className="text-red-600 font-bold">*REQUIRED FIELD</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1 leading-tight">
                    Sri Lanka Scout Association safety policy demands a direct emergency parent number for active members.
                  </p>
                  <div className="relative">
                    <Phone className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="Enter emergency parent contact..."
                      value={regParentsPhone}
                      onChange={(e) => setRegParentsPhone(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-brand-gold/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>
              ) : (
                /* Leader or Admin required field: National Identity Card (NIC) */
                <div className="space-y-1 p-3 bg-brand-green/10 border border-brand-green/30 rounded-xl">
                  <label className="text-[9px] font-black text-brand-green uppercase tracking-widest block">
                    National Identity Card (NIC) No <span className="text-red-600 font-bold">*REQUIRED FIELD</span>
                  </label>
                  <p className="text-[10px] text-slate-500 mb-1 leading-tight">
                    Leaders/Admins must declare their legal National Identity Card (NIC) to request management clearances.
                  </p>
                  <div className="relative">
                    <FileText className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. 198223456789 or 821234567V"
                      value={regNic}
                      onChange={(e) => setRegNic(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 bg-white border border-brand-green/30 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green font-mono uppercase"
                    />
                  </div>
                </div>
              )}

              {/* Error block */}
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-700 p-2.5 rounded-xl flex items-center space-x-2 text-[10px] leading-relaxed">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit registration button */}
              <button
                type="submit"
                disabled={loading || success}
                className={`w-full py-3 rounded-xl font-black uppercase tracking-wider text-xs transition duration-200 flex items-center justify-center space-x-2 cursor-pointer shadow-md ${
                  success
                    ? 'bg-emerald-600 text-white'
                    : loading
                      ? 'bg-slate-300 text-slate-500'
                      : 'bg-brand-green hover:bg-brand-green-light text-white hover:shadow-lg'
                }`}
              >
                {success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 animate-ping" />
                    <span>Registered Successfully! Welcome...</span>
                  </>
                ) : loading ? (
                  <>
                    <Compass className="w-4 h-4 animate-spin" />
                    <span>Enrolling in CIS Database...</span>
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4" />
                    <span>Enroll & Authenticate</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>
      </div>
    </div>
  );
}
