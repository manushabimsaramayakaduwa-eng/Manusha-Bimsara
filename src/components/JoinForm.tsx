import React, { useState, useEffect } from 'react';
import { Registration } from '../types';
import { ShieldCheck, Calendar, Phone, Mail, User, MapPin, Sparkles, Printer, RefreshCw, Award } from 'lucide-react';

export default function JoinForm() {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Male',
    email: '',
    phone: '',
    address: '',
    section: 'scouts' as 'cubs' | 'scouts' | 'rovers',
    schoolGrade: '',
    parentName: '',
    parentPhone: '',
    medicalConditions: '',
    bloodGroup: 'O+',
  });

  const [activeRegistration, setActiveRegistration] = useState<Registration | null>(null);

  // Load active registration on mount
  useEffect(() => {
    const saved = localStorage.getItem('51_scout_membership');
    if (saved) {
      try {
        setActiveRegistration(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading registration', e);
      }
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Generate unique ID and mock timestamp
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const secPrefix = formData.section === 'cubs' ? 'CUB' : formData.section === 'scouts' ? 'SCT' : 'RVR';
    const memberId = `ASK-${secPrefix}-2026-${randomNum}`;
    const registeredAt = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    const newReg: Registration = {
      ...formData,
      memberId,
      registeredAt
    };

    setActiveRegistration(newReg);
    localStorage.setItem('51_scout_membership', JSON.stringify(newReg));
  };

  const handleReset = () => {
    setActiveRegistration(null);
    localStorage.removeItem('51_scout_membership');
    setFormData({
      fullName: '',
      dateOfBirth: '',
      gender: 'Male',
      email: '',
      phone: '',
      address: '',
      section: 'scouts',
      schoolGrade: '',
      parentName: '',
      parentPhone: '',
      medicalConditions: '',
      bloodGroup: 'O+',
    });
  };

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
            <span>Online Enrollment</span>
          </div>
          <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
            Apply for Kotte Scout Group Membership
          </h2>
          <p className="text-slate-600 text-sm sm:text-base mt-2 font-light">
            Open exclusively to students of Ananda Sastralaya, Kotte. Submit your registration details below to join the troop and generate your official digital scout membership pass.
          </p>
        </div>

        {/* Form or Card Split View */}
        <div className="max-w-4xl mx-auto">
          {activeRegistration ? (
            
            /* REGISTRATION CARD GENERATED STATE */
            <div className="space-y-8 animate-fadeIn text-slate-800">
              
              <div className="text-center space-y-2">
                <div className="inline-flex p-3 bg-brand-green/10 border border-brand-green/20 text-brand-green rounded-full mb-2">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h3 className="font-sans font-black text-2xl text-brand-green">Enrollment Application Received!</h3>
                <p className="text-sm text-slate-500 max-w-lg mx-auto font-light">
                  Your application has been stored in local memory and sent to the Scout Master's roster for final woggle allocation. Show your card below at the next meeting!
                </p>
              </div>

              {/* High-Fidelity Membership Pass UI (Designed like a real badge) */}
              <div className="relative max-w-md mx-auto bg-white border-2 border-brand-gold/40 rounded-2xl overflow-hidden shadow-md p-6">
                
                {/* Visual Watermark Emblem in Background */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
                  <span className="text-9xl">⚜️</span>
                </div>

                {/* Top header strip of Card */}
                <div className="flex justify-between items-start border-b-2 border-slate-100 pb-4 mb-5">
                  <div>
                    <h4 className="font-sans font-black text-xs text-brand-green uppercase tracking-widest leading-none">
                      Ananda Sastralaya Kotte Scout Group
                    </h4>
                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                      Ananda Sastralaya, Kotte
                    </p>
                  </div>
                  <div className="bg-slate-50 p-1.5 rounded border border-slate-200 text-[10px] text-brand-green font-mono font-bold">
                    ID: {activeRegistration.memberId}
                  </div>
                </div>

                {/* Content columns */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                  
                  {/* Photo representation column */}
                  <div className="sm:col-span-4 flex flex-col items-center">
                    <div className="w-24 h-28 bg-slate-50 border-2 border-slate-100 rounded flex flex-col items-center justify-center text-center shadow-inner relative overflow-hidden">
                      {/* Generates a nice silhouette */}
                      <span className="text-3xl">👤</span>
                      <span className="text-[8px] text-brand-green mt-2 font-semibold uppercase tracking-wider">
                        ASK Scout
                      </span>
                      {/* Small badge overlay */}
                      <div className="absolute top-1 right-1 bg-brand-green text-white text-[6px] px-1 font-bold rounded">
                        {activeRegistration.section === 'cubs' ? 'Cub' : activeRegistration.section === 'scouts' ? 'Scout' : 'Rover'}
                      </div>
                    </div>

                    <div className="mt-3 text-[9px] text-slate-400 font-mono text-center">
                      Blood Group: <strong className="text-brand-gold">{activeRegistration.bloodGroup}</strong>
                    </div>
                  </div>

                  {/* Text details column */}
                  <div className="sm:col-span-8 space-y-3.5 text-xs text-left">
                    <div>
                      <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Scout Full Name</span>
                      <span className="text-slate-800 font-extrabold text-sm block mt-1">{activeRegistration.fullName}</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Section Group</span>
                        <span className="text-brand-green font-bold capitalize block mt-1">{activeRegistration.section} Pack</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider leading-none">School Grade</span>
                        <span className="text-slate-700 font-semibold block mt-1">Grade {activeRegistration.schoolGrade}</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Enroll Date</span>
                        <span className="text-slate-600 block mt-1">{activeRegistration.registeredAt}</span>
                      </div>
                      <div>
                        <span className="text-[8px] text-slate-400 font-bold uppercase block tracking-wider leading-none">Youth Status</span>
                        <span className="text-brand-gold font-black tracking-wide block mt-1">ACTIVE ⚜️</span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Bottom Signatures block of Card */}
                <div className="border-t border-slate-100 pt-4 mt-5 flex justify-between items-end text-[8px] text-slate-50">
                  <div className="text-left leading-tight">
                    <span className="block italic text-slate-600 font-serif">Kapila Jayawardene</span>
                    <span className="font-semibold uppercase tracking-widest text-[7px] text-slate-400">Group Scout Leader</span>
                  </div>
                  
                  <div className="text-right leading-tight">
                    <span className="block text-slate-600 font-semibold">{activeRegistration.parentName}</span>
                    <span className="font-semibold uppercase tracking-widest text-[7px] text-slate-400">Parent Consent</span>
                  </div>
                </div>

              </div>

              {/* Actions below pass */}
              <div className="flex justify-center gap-3">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded shadow-sm text-xs cursor-pointer uppercase tracking-wider"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  <span>Print Roster Pass</span>
                </button>

                <button
                  onClick={handleReset}
                  className="inline-flex items-center justify-center px-4 py-2.5 bg-white hover:bg-slate-50 text-rose-600 border border-slate-200 font-bold rounded shadow-xs text-xs cursor-pointer uppercase tracking-wider"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  <span>Register Another Member</span>
                </button>
              </div>

            </div>

          ) : (
            
            /* REGISTRATION FORM VIEW */
            <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-md space-y-6 text-slate-800">
              
              {/* Form Section 1: Candidate Details */}
              <div className="space-y-4">
                <h3 className="font-sans font-bold text-sm text-brand-green uppercase tracking-wider flex items-center gap-1.5">
                  <User className="w-4 h-4 text-brand-gold" />
                  <span>01. Candidate Information</span>
                </h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Candidate Full Name*</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Ranuka Samarasinghe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Date of Birth*</label>
                    <input
                      type="date"
                      name="dateOfBirth"
                      required
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Gender*</label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      disabled
                      className="w-full bg-slate-100 border border-slate-200 rounded-lg p-3 text-slate-500 focus:outline-none cursor-not-allowed opacity-75"
                    >
                      <option value="Male">Male (Boys Only School)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">School Grade*</label>
                    <input
                      type="text"
                      name="schoolGrade"
                      required
                      value={formData.schoolGrade}
                      onChange={handleChange}
                      placeholder="e.g. 7-A or 10-C"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Section Eligibility*</label>
                    <select
                      name="section"
                      value={formData.section}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200 cursor-pointer"
                    >
                      <option value="cubs">Cub Scouts (Ages 7-11)</option>
                      <option value="scouts">Boy/Girl Scouts (Ages 11-15)</option>
                      <option value="rovers">Rover Scouts (Ages 15-24)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Form Section 2: Contact Details */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-sans font-bold text-sm text-brand-green uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-brand-gold" />
                  <span>02. Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Email Address*</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. parents@gmail.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Personal / Mobile Phone*</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-left">
                  <label className="text-slate-500 font-bold uppercase tracking-wider">Home Address*</label>
                  <textarea
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    placeholder="Residential address in Colombo"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                  />
                </div>
              </div>

              {/* Form Section 3: Parent & Consent */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <h3 className="font-sans font-bold text-sm text-brand-green uppercase tracking-wider flex items-center gap-1.5">
                  <Phone className="w-4 h-4 text-brand-gold" />
                  <span>03. Parent / Guardian Consent</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Parent / Guardian Full Name*</label>
                    <input
                      type="text"
                      name="parentName"
                      required
                      value={formData.parentName}
                      onChange={handleChange}
                      placeholder="e.g. Devika Samarasinghe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Parent Emergency Phone*</label>
                    <input
                      type="tel"
                      name="parentPhone"
                      required
                      value={formData.parentPhone}
                      onChange={handleChange}
                      placeholder="e.g. +94 77 987 6543"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1.5 text-xs text-left sm:col-span-2">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Medical Conditions or Allergies (Optional)</label>
                    <input
                      type="text"
                      name="medicalConditions"
                      value={formData.medicalConditions}
                      onChange={handleChange}
                      placeholder="e.g. Asthma, peanut allergy, or none"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200"
                    />
                  </div>

                  <div className="space-y-1.5 text-xs text-left">
                    <label className="text-slate-500 font-bold uppercase tracking-wider">Blood Group*</label>
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-slate-600 focus:outline-none focus:border-brand-green focus:bg-white transition duration-200 cursor-pointer"
                    >
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <div className="border-t border-slate-100 pt-6 text-center">
                <button
                  type="submit"
                  id="submit-register-btn"
                  className="w-full sm:w-64 inline-flex items-center justify-center px-6 py-3.5 bg-brand-green hover:bg-brand-green-light text-white font-bold rounded shadow-md transition-all cursor-pointer uppercase tracking-wider"
                >
                  <Award className="w-5 h-5 mr-2 text-brand-gold" />
                  <span>Submit & Generate Card</span>
                </button>
                <p className="text-[10px] text-slate-400 mt-2">
                  *By submitting this, you certify that the candidate is a student at Ananda Sastralaya, Kotte.
                </p>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
}
