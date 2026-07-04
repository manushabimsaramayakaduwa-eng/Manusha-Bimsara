import React, { useState } from 'react';
import { Sliders, Save, RefreshCw, HelpCircle, ShieldCheck } from 'lucide-react';
import { getTroopDetails, saveTroopDetails, TroopDetails, DEFAULT_TROOP_DETAILS } from '../lib/troopConfig';

interface TroopSettingsPanelProps {
  onAuditLog: (msg: string) => void;
}

export default function TroopSettingsPanel({ onAuditLog }: TroopSettingsPanelProps) {
  const [details, setDetails] = useState<TroopDetails>(getTroopDetails);
  const [isSaved, setIsSaved] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    saveTroopDetails(details);
    setIsSaved(true);
    onAuditLog(`Leader/Admin updated customizable troop configurations: ${details.shortName}`);
    setTimeout(() => setIsSaved(false), 4000);
  };

  const handleResetToDefault = () => {
    if (confirm('Are you sure you want to reset all troop details back to the default Ananda Sastralaya Kotte configurations?')) {
      saveTroopDetails(DEFAULT_TROOP_DETAILS);
      setDetails(DEFAULT_TROOP_DETAILS);
      onAuditLog('Reset troop details to original school default values.');
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    }
  };

  return (
    <div id="troop-settings-panel" className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 text-slate-800 text-left animate-fadeIn">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-100 pb-4 gap-4">
        <div>
          <h2 className="font-sans font-black text-2xl text-brand-green flex items-center gap-2">
            <Sliders className="w-6 h-6 text-brand-gold" />
            <span>Customize Troop Details</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Configure how the entire public-facing website, hero banners, footer links, and title logos render. Changes apply instantly.
          </p>
        </div>
        
        <button
          type="button"
          onClick={handleResetToDefault}
          className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-red-200 hover:bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-center"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {isSaved && (
        <div className="bg-emerald-50 border-l-4 border-emerald-500 text-emerald-800 p-4 rounded-r-xl text-xs font-semibold flex items-center space-x-2 animate-fadeIn">
          <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Troop configurations saved successfully! Changes are propagated across the whole portal.</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Core Identity Row */}
        <div className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200/50 space-y-4">
          <h3 className="text-xs font-black uppercase text-brand-green tracking-wider border-b border-slate-200/60 pb-1.5">1. Troop Identity & Branding</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            
            <div className="space-y-1 text-xs md:col-span-6">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Official Group Name</label>
              <input
                type="text"
                name="name"
                required
                value={details.name}
                onChange={handleChange}
                placeholder="e.g. Ananda Sastralaya Kotte Scout Group"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
              <p className="text-[10px] text-slate-400">Renders in the footer and main greeting title.</p>
            </div>

            <div className="space-y-1 text-xs md:col-span-3">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Short Initials / Logo</label>
              <input
                type="text"
                name="logo"
                required
                maxLength={8}
                value={details.logo}
                onChange={handleChange}
                placeholder="e.g. ASK"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
              <p className="text-[10px] text-slate-400">Circular avatar text (max 8 chars).</p>
            </div>

            <div className="space-y-1 text-xs md:col-span-3">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Display Nickname</label>
              <input
                type="text"
                name="shortName"
                required
                value={details.shortName}
                onChange={handleChange}
                placeholder="e.g. ASK Kotte"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 font-bold focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
              <p className="text-[10px] text-slate-400">Renders in top-left brand title.</p>
            </div>

          </div>

          <div className="space-y-1 text-xs">
            <label className="text-slate-500 font-bold uppercase tracking-wider block">Slogan / Short Description</label>
            <input
              type="text"
              name="slogan"
              required
              value={details.slogan}
              onChange={handleChange}
              placeholder="A short motto or description about passwordless login and purpose"
              className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
            />
          </div>
        </div>

        {/* Institution & Contact Info */}
        <div className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200/50 space-y-4">
          <h3 className="text-xs font-black uppercase text-brand-green tracking-wider border-b border-slate-200/60 pb-1.5">2. School & Contact Info</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">School Name</label>
              <input
                type="text"
                name="schoolName"
                required
                value={details.schoolName}
                onChange={handleChange}
                placeholder="e.g. Ananda Sastralaya, Kotte"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Contact Telephone</label>
              <input
                type="text"
                name="phone"
                required
                value={details.phone}
                onChange={handleChange}
                placeholder="+94 11 269 6681"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Official Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={details.email}
                onChange={handleChange}
                placeholder="scouts@sastralaya.lk"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Physical Headquarters Address</label>
              <input
                type="text"
                name="address"
                required
                value={details.address}
                onChange={handleChange}
                placeholder="Full address of the school group headquarters"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
            </div>

          </div>
        </div>

        {/* GSL Welcome Details */}
        <div className="bg-slate-50/50 p-4 sm:p-5 rounded-xl border border-slate-200/50 space-y-4">
          <h3 className="text-xs font-black uppercase text-brand-green tracking-wider border-b border-slate-200/60 pb-1.5">3. Group Scout Leader Address</h3>
          
          <div className="grid grid-cols-1 gap-4">
            
            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">Group Scout Leader (GSL) Name</label>
              <input
                type="text"
                name="gslName"
                required
                value={details.gslName}
                onChange={handleChange}
                placeholder="e.g. Kapila Jayawardene"
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition"
              />
            </div>

            <div className="space-y-1 text-xs">
              <label className="text-slate-500 font-bold uppercase tracking-wider block">GSL Welcome Address Quote</label>
              <textarea
                name="gslQuote"
                required
                rows={3}
                value={details.gslQuote}
                onChange={handleChange}
                placeholder="Enter GSL quote statement displayed on home page."
                className="w-full bg-white border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green transition leading-relaxed resize-none"
              />
            </div>

          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            id="save-troop-settings-btn"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded-xl text-xs uppercase tracking-widest shadow-md hover:shadow-lg transition cursor-pointer"
          >
            <Save className="w-4 h-4 text-brand-gold" />
            <span>Save Settings</span>
          </button>
        </div>

      </form>
    </div>
  );
}
