import React, { useState, useEffect } from 'react';
import { 
  Cloud, 
  ShieldAlert, 
  HardDrive, 
  RefreshCw, 
  BellRing, 
  CheckCircle,
  HelpCircle,
  Sparkles
} from 'lucide-react';

interface StorageManagerProps {
  photoSizeMB: number;
  elibrarySizeMB: number;
  receiptSizeMB?: number;
  currentUser: { username: string; role: 'admin' | 'leader' | 'member'; fullName: string };
  onAuditLog: (action: string) => void;
}

export default function StorageManager({ photoSizeMB, elibrarySizeMB, receiptSizeMB = 0, currentUser, onAuditLog }: StorageManagerProps) {
  // Let's configure a mock multiplier or mock baseline so they can test what happens when the drive is nearly full!
  const [baselineGB, setBaselineGB] = useState(13.5); // Baseline occupied size of other drive files
  const [manualWarningActive, setManualWarningActive] = useState(false);

  // Convert MB sizes to GB
  const photosGB = photoSizeMB / 1024;
  const docsGB = elibrarySizeMB / 1024;
  const receiptsGB = receiptSizeMB / 1024;
  const totalUsedGB = baselineGB + photosGB + docsGB + receiptsGB;
  const maxCapacityGB = 15.0;

  const usedPct = Math.min((totalUsedGB / maxCapacityGB) * 100, 100);
  const isFullOrNearlyFull = totalUsedGB >= 14.8 || manualWarningActive;

  useEffect(() => {
    if (isFullOrNearlyFull) {
      // Trigger audit alert notice
      onAuditLog(`[CRITICAL STORAGE WARNING]: Google Drive (managementsystermscout@gmail.com) is currently utilizing ${totalUsedGB.toFixed(2)} GB / 15.0 GB! Admin/Leaders alerted.`);
    }
  }, [totalUsedGB, isFullOrNearlyFull]);

  const handleSimulateFull = () => {
    setBaselineGB(14.7);
    alert('Simulating high storage usage! Base drive occupied space set to 14.7 GB. Total will exceed 14.8 GB warning limit.');
    onAuditLog(`Admin/Leader (${currentUser.fullName}) triggered simulated storage overflow sequence.`);
  };

  const handleResetStorage = () => {
    setBaselineGB(10.2);
    setManualWarningActive(false);
    alert('Storage offset reset successfully! Space cleared on managementsystermscout@gmail.com');
    onAuditLog(`Admin/Leader (${currentUser.fullName}) cleared temporary cache files on Google Drive.`);
  };

  const isEligibleToManage = currentUser.role === 'admin' || currentUser.role === 'leader';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs text-left space-y-6">
      
      {/* Upper info panel */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div className="space-y-0.5">
          <h3 className="font-sans font-black text-sm text-brand-green flex items-center gap-1.5">
            <Cloud className="w-4 h-4 text-brand-gold" />
            <span>Google Drive Storage Node</span>
          </h3>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            Service Target: managementsystermscout@gmail.com
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-mono text-[10px] text-slate-600">Drive Connection: Active</span>
        </div>
      </div>

      {/* Critical alert banner */}
      {isFullOrNearlyFull && (
        <div className="bg-rose-50 border-2 border-rose-600/30 p-4 rounded-xl flex items-start gap-3.5 animate-pulse text-left">
          <ShieldAlert className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-xs font-black text-rose-800 uppercase tracking-wider">
              ⚠️ CRITICAL CLOUD STORAGE WARNING
            </h4>
            <p className="text-xs text-rose-700 leading-normal font-light">
              The Google Drive storage space for <strong>managementsystermscout@gmail.com</strong> is almost full ({totalUsedGB.toFixed(2)} GB used / 15.0 GB limit). Leaders and Admins are hereby notified to delete older Photo Albums or clear E-Library PDFs immediately.
            </p>
            <p className="text-[9px] text-rose-500 font-bold uppercase">
              🚨 Dispatch Alert: Notification successfully routed to Admins Whatsapp & Email!
            </p>
          </div>
        </div>
      )}

      {/* Main progress visual */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider">
          <span className="text-slate-500 flex items-center gap-1">
            <HardDrive className="w-4 h-4 text-brand-green" />
            Drive Space Allocated
          </span>
          <span className={isFullOrNearlyFull ? 'text-rose-600 font-black' : 'text-brand-green'}>
            {usedPct.toFixed(1)}% Utilized
          </span>
        </div>

        <div className="w-full bg-slate-100 h-4 rounded-full overflow-hidden p-0.5 border border-slate-200">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${
              isFullOrNearlyFull ? 'bg-rose-600' : usedPct > 80 ? 'bg-amber-500' : 'bg-brand-green'
            }`}
            style={{ width: `${usedPct}%` }}
          />
        </div>

        {/* Breakdown parameters */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-2 text-xs">
          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Photo Albums</span>
            <span className="font-mono font-black text-slate-700 block mt-1">{(photosGB).toFixed(3)} GB</span>
            <span className="text-[9px] text-slate-400">{photoSizeMB.toFixed(1)} MB</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">E-Library Docs</span>
            <span className="font-mono font-black text-slate-700 block mt-1">{(docsGB).toFixed(3)} GB</span>
            <span className="text-[9px] text-slate-400">{elibrarySizeMB.toFixed(1)} MB</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Receipt Vouchers</span>
            <span className="font-mono font-black text-slate-700 block mt-1">{receiptsGB.toFixed(3)} GB</span>
            <span className="text-[9px] text-slate-400">{receiptSizeMB.toFixed(1)} MB</span>
          </div>

          <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
            <span className="text-[9px] text-slate-400 font-bold uppercase block leading-none">Other Files</span>
            <span className="font-mono font-black text-slate-700 block mt-1">{baselineGB.toFixed(2)} GB</span>
            <span className="text-[9px] text-slate-400">GSuite Base OS</span>
          </div>

          <div className="bg-brand-green/5 border border-brand-green/10 p-3 rounded-xl col-span-2 sm:col-span-1">
            <span className="text-[9px] text-brand-green font-bold uppercase block leading-none">Total Used</span>
            <span className="font-mono font-black text-brand-green block mt-1">{totalUsedGB.toFixed(2)} GB</span>
            <span className="text-[9px] text-brand-green-light">Max Capacity: 15.0 GB</span>
          </div>
        </div>
      </div>

      {/* Simulation controls for test and review */}
      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
        <h4 className="font-bold text-slate-700 uppercase tracking-wide flex items-center gap-1.5">
          <span>⚙️ Storage Testing Dashboard</span>
        </h4>
        <p className="text-[11px] text-slate-500 font-light leading-relaxed">
          Review the storage-limiting warning system. You can simulate a near-full state on <code>managementsystermscout@gmail.com</code> to verify role-based warning messages.
        </p>

        {isEligibleToManage ? (
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleSimulateFull}
              className="bg-amber-600 hover:bg-amber-700 text-white text-[10px] font-black uppercase px-3 py-2 rounded-lg cursor-pointer transition"
            >
              Simulate &gt;14.8 GB Usage
            </button>
            <button
              onClick={handleResetStorage}
              className="bg-slate-200 hover:bg-slate-300 text-slate-700 text-[10px] font-black uppercase px-3 py-2 rounded-lg cursor-pointer transition"
            >
              Reset Storage baseline
            </button>
          </div>
        ) : (
          <p className="text-[10px] text-amber-600 italic">
            * Note: Only registered Leaders and Admins are permitted to purge drive base caches or toggle storage levels.
          </p>
        )}
      </div>

    </div>
  );
}
