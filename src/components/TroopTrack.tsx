import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Award, 
  CheckSquare, 
  Calendar, 
  FileText, 
  UserPlus, 
  Search, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  User, 
  ShieldAlert, 
  Trash2, 
  Edit, 
  Plus, 
  BookOpen, 
  MapPin, 
  Droplet, 
  Flame, 
  Cookie, 
  Compass, 
  ChevronRight, 
  Activity, 
  DollarSign, 
  Sparkles,
  RefreshCw,
  Sliders,
  Check,
  UserCheck,
  LogOut,
  Camera,
  MessageSquare,
  Cloud,
  FolderLock
} from 'lucide-react';
import { EVENTS_DATA, BADGES_DATA } from '../data';
import Login from './Login';

// Import newly created modular sub-components
import PhotoAlbums from './PhotoAlbums';
import ELibrary from './ELibrary';
import ScoutChat from './ScoutChat';
import GoogleCalendar from './GoogleCalendar';
import TroopSettingsPanel from './TroopSettingsPanel';
import PatrolManager from './PatrolManager';
import StorageManager from './StorageManager';
import MyProfile from './MyProfile';
import BadgesEditor from './BadgesEditor';
import MoneyBook from './MoneyBook';

// Define Interface for Scout
interface Scout {
  id: string;
  name: string;
  firstName?: string;
  lastName?: string;
  photoUrl?: string;
  dob?: string;
  doj?: string;
  membershipNo?: string;
  nic?: string;
  address?: string;
  parentName?: string;
  relationship?: string;
  parentPhone?: string;
  whatsapp?: string;
  email?: string;
  section: 'cubs' | 'scouts' | 'rovers';
  patrol: string;
  rank: string;
  role: string;
  attendanceRate: number;
  duesStatus: 'Paid' | 'Pending' | 'Overdue';
  duesAmount: number;
  earnedBadges: string[]; // Badge IDs
  rankRequirements: { [reqId: string]: 'Not Started' | 'Proposed' | 'Completed' };
}

// Define Interface for Duty Roster
interface DutyAssignment {
  id: string;
  eventName: string;
  date: string;
  cookId: string;
  fireBuilderId: string;
  waterCarrierId: string;
  quartermasterId: string;
  firstAiderId: string;
}

// Define Initial Scouts Data
const INITIAL_SCOUTS: Scout[] = [
  {
    id: 'sc-1',
    name: 'Ranuka Samarasinghe',
    section: 'scouts',
    patrol: 'Eagle Patrol',
    rank: 'Second Class',
    role: 'Patrol Leader',
    attendanceRate: 95,
    duesStatus: 'Paid',
    duesAmount: 0,
    earnedBadges: ['tenderfoot', 'athlete-cub'],
    rankRequirements: {
      'first-class-1': 'Completed',
      'first-class-2': 'Proposed',
      'first-class-3': 'Not Started',
      'first-class-4': 'Not Started',
      'first-class-5': 'Not Started'
    }
  },
  {
    id: 'sc-2',
    name: 'Senesh Karunaratne',
    section: 'scouts',
    patrol: 'Eagle Patrol',
    rank: 'Tenderfoot',
    role: 'Scout',
    attendanceRate: 88,
    duesStatus: 'Pending',
    duesAmount: 500,
    earnedBadges: ['tenderfoot'],
    rankRequirements: {
      'second-class-1': 'Completed',
      'second-class-2': 'Completed',
      'second-class-3': 'Proposed',
      'second-class-4': 'Not Started',
      'second-class-5': 'Not Started'
    }
  },
  {
    id: 'sc-3',
    name: 'Devika Perera',
    section: 'scouts',
    patrol: 'Panther Patrol',
    rank: 'First Class',
    role: 'Patrol Leader',
    attendanceRate: 96,
    duesStatus: 'Paid',
    duesAmount: 0,
    earnedBadges: ['tenderfoot', 'second-class', 'camper-badge'],
    rankRequirements: {
      'presidents-1': 'Completed',
      'presidents-2': 'Proposed',
      'presidents-3': 'Proposed',
      'presidents-4': 'Not Started',
      'presidents-5': 'Not Started'
    }
  },
  {
    id: 'sc-4',
    name: 'Bilal Ibrahim',
    section: 'cubs',
    patrol: 'Lion Six',
    rank: 'Silver Star',
    role: 'Sixer',
    attendanceRate: 92,
    duesStatus: 'Paid',
    duesAmount: 0,
    earnedBadges: ['bronze-star', 'artist-cub'],
    rankRequirements: {
      'gold-star-1': 'Completed',
      'gold-star-2': 'Completed',
      'gold-star-3': 'Not Started',
      'gold-star-4': 'Proposed',
      'gold-star-5': 'Not Started'
    }
  },
  {
    id: 'sc-5',
    name: 'Michelle de Silva',
    section: 'rovers',
    patrol: 'Rover Crew Alpha',
    rank: 'Rover Aspirant',
    role: 'Crew Leader',
    attendanceRate: 100,
    duesStatus: 'Paid',
    duesAmount: 0,
    earnedBadges: ['rover-aspirant'],
    rankRequirements: {
      'service-1': 'Completed',
      'service-2': 'Proposed',
      'service-3': 'Not Started'
    }
  },
  {
    id: 'sc-6',
    name: 'Dulan Wijewardene',
    section: 'scouts',
    patrol: 'Panther Patrol',
    rank: 'Tenderfoot',
    role: 'Assistant Patrol Leader',
    attendanceRate: 85,
    duesStatus: 'Overdue',
    duesAmount: 1500,
    earnedBadges: ['tenderfoot'],
    rankRequirements: {
      'second-class-1': 'Completed',
      'second-class-2': 'Not Started',
      'second-class-3': 'Not Started',
      'second-class-4': 'Not Started',
      'second-class-5': 'Not Started'
    }
  }
];

// Core Rank Requirements Data for the Tracker
const RANK_REQUIREMENTS_CONFIG = {
  cubs: {
    title: 'Gold Star Requirements',
    requirements: [
      { id: 'gold-star-1', text: 'Must have completed the Silver Star.' },
      { id: 'gold-star-2', text: 'Understand simple health and hygiene rules, including dental care.' },
      { id: 'gold-star-3', text: 'Know the national flag, national anthem, and district commissioner\'s name.' },
      { id: 'gold-star-4', text: 'Guide a blindfolded person safely through obstacles.' },
      { id: 'gold-star-5', text: 'Explain the purpose of standard first aid items.' }
    ]
  },
  scouts: {
    title: 'First Class Requirements',
    requirements: [
      { id: 'first-class-1', text: 'Must be a Second Class Scout for at least 6 months.' },
      { id: 'first-class-2', text: 'Lead a pioneering project (e.g. A-frame trestle or tripod) with your patrol.' },
      { id: 'first-class-3', text: 'Map a 1km route with landmarks, estimating heights and distances.' },
      { id: 'first-class-4', text: 'Swim 50 meters dressed in light clothes, or demonstrate land rescue methods.' },
      { id: 'first-class-5', text: 'Plan, pack, and lead an overnight hiking camp for your Patrol.' }
    ],
    title2: 'Second Class Requirements',
    requirements2: [
      { id: 'second-class-1', text: 'Must be a Tenderfoot Scout for at least 3 months.' },
      { id: 'second-class-2', text: 'Cook a simple meal for your Patrol outdoors using a campfire.' },
      { id: 'second-class-3', text: 'Demonstrate how to treat basic injuries: cuts, burns, and sprains.' },
      { id: 'second-class-4', text: 'Use a magnetic compass to take bearings and navigate a 1km course.' },
      { id: 'second-class-5', text: 'Participate in a service project of at least 6 hours.' }
    ],
    title3: "President's Scout Award Requirements",
    requirements3: [
      { id: 'presidents-1', text: 'Must have achieved First Class Badge.' },
      { id: 'presidents-2', text: 'Hold at least 8 key Merit Badges including First Aid, Camper, Pioneer, and Citizen.' },
      { id: 'presidents-3', text: 'Complete a major community development project with 50+ hours of service.' },
      { id: 'presidents-4', text: 'Pass a rigorous district-wide theoretical and practical evaluation.' },
      { id: 'presidents-5', text: 'Maintain an exemplary record of school performance, discipline, and scout spirit.' }
    ]
  },
  rovers: {
    title: 'Rover Service Medal Requirements',
    requirements: [
      { id: 'service-1', text: 'Plan and execute a major environmental restoration or social relief project (min 100 hours).' },
      { id: 'service-2', text: 'Provide regular service as an instructor or helper in the Cub or Scout sections for 6 months.' },
      { id: 'service-3', text: 'Organize a Blood Donation Camp or disaster resilience workshop.' }
    ]
  }
};

// Initial Attendance Records
interface AttendanceSession {
  id: string;
  eventName: string;
  date: string;
  records: { [scoutId: string]: 'Present' | 'Excused' | 'Absent' };
}

const INITIAL_ATTENDANCE: AttendanceSession[] = [
  {
    id: 'att-1',
    eventName: 'Weekly Troop & Cub Meeting',
    date: '2026-07-11',
    records: {
      'sc-1': 'Present',
      'sc-2': 'Present',
      'sc-3': 'Present',
      'sc-4': 'Present',
      'sc-5': 'Present',
      'sc-6': 'Absent'
    }
  },
  {
    id: 'att-2',
    eventName: 'Ananda Sastralaya Investiture Ceremony',
    date: '2026-07-25',
    records: {
      'sc-1': 'Present',
      'sc-2': 'Excused',
      'sc-3': 'Present',
      'sc-4': 'Present',
      'sc-5': 'Present',
      'sc-6': 'Present'
    }
  }
];

// Initial Duty Assignments
const INITIAL_DUTY: DutyAssignment[] = [
  {
    id: 'dy-1',
    eventName: 'Annual Pioneering Campout',
    date: '2026-08-15',
    cookId: 'sc-1',
    fireBuilderId: 'sc-2',
    waterCarrierId: 'sc-6',
    quartermasterId: 'sc-3',
    firstAiderId: 'sc-5'
  }
];

export default function TroopTrack() {
  // Roster states
  const [scouts, setScouts] = useState<Scout[]>(() => {
    const local = localStorage.getItem('51_scouttrack_scouts');
    return local ? JSON.parse(local) : INITIAL_SCOUTS;
  });

  // Attendance states
  const [attendanceSessions, setAttendanceSessions] = useState<AttendanceSession[]>(() => {
    const local = localStorage.getItem('51_scouttrack_attendance');
    return local ? JSON.parse(local) : INITIAL_ATTENDANCE;
  });

  // Duty Roster states
  const [duties, setDuties] = useState<DutyAssignment[]>(() => {
    const local = localStorage.getItem('51_scouttrack_duties');
    return local ? JSON.parse(local) : INITIAL_DUTY;
  });

  // User session state
  const [currentUser, setCurrentUser] = useState<{ username: string; role: 'admin' | 'leader' | 'member'; fullName: string } | null>(() => {
    const saved = localStorage.getItem('51_scouttrack_user');
    return saved ? JSON.parse(saved) : null;
  });

  // Role simulator state
  const [userRole, setUserRole] = useState<'leader' | 'scout'>('leader');

  useEffect(() => {
    if (currentUser) {
      setUserRole(currentUser.role === 'member' ? 'scout' : 'leader');
    }
  }, [currentUser]);
  const [activeScoutId, setActiveScoutId] = useState<string>('sc-1');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<'all' | 'cubs' | 'scouts' | 'rovers'>('all');
  const [subTab, setSubTab] = useState<
    'roster' | 'advancement' | 'attendance' | 'duty' | 'albums' | 'elibrary' | 'chat' | 'calendar' | 'patrols' | 'storage' | 'my-profile' | 'badges-editor' | 'money-book' | 'troop-settings'
  >('roster');

  // Modular States for Live Audit warning dispatches
  const [photoSizeMB, setPhotoSizeMB] = useState(0);
  const [elibrarySizeMB, setElibrarySizeMB] = useState(0);
  const [receiptSizeMB, setReceiptSizeMB] = useState(0);
  const [auditLogs, setAuditLogs] = useState<string[]>(() => {
    const saved = localStorage.getItem('51_scouttrack_audit_logs');
    return saved ? JSON.parse(saved) : [
      'System Node loaded successfully.',
      'Google Drive managementsystermscout@gmail.com mounted with 15.0 GB limit.',
      'Welcome Kapila Jayawardene (GSL) & Ananda Sastralaya Kotte leaders.'
    ];
  });

  const handleAuditLog = (msg: string) => {
    setAuditLogs(prev => {
      const updated = [...prev, msg];
      localStorage.setItem('51_scouttrack_audit_logs', JSON.stringify(updated));
      return updated;
    });
  };

  // Form states for adding/editing a scout
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingScoutId, setEditingScoutId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    firstName: '',
    lastName: '',
    photoUrl: '',
    dob: '',
    doj: '',
    membershipNo: '',
    nic: '',
    address: '',
    parentName: '',
    relationship: '',
    parentPhone: '',
    whatsapp: '',
    email: '',
    section: 'scouts' as 'cubs' | 'scouts' | 'rovers',
    patrol: 'Eagle Patrol',
    rank: 'Tenderfoot',
    role: 'Member',
    duesStatus: 'Paid' as 'Paid' | 'Pending' | 'Overdue',
    duesAmount: 0
  });

  // Form states for Duty Assignment
  const [isDutyFormOpen, setIsDutyFormOpen] = useState(false);
  const [dutyFormData, setDutyFormData] = useState({
    eventName: '',
    date: '',
    cookId: '',
    fireBuilderId: '',
    waterCarrierId: '',
    quartermasterId: '',
    firstAiderId: ''
  });

  // Form states for Attendance Session
  const [isAttFormOpen, setIsAttFormOpen] = useState(false);
  const [attFormData, setAttFormData] = useState({
    eventName: 'Weekly Troop & Cub Meeting',
    date: new Date().toISOString().split('T')[0]
  });

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem('51_scouttrack_scouts', JSON.stringify(scouts));
  }, [scouts]);

  useEffect(() => {
    localStorage.setItem('51_scouttrack_attendance', JSON.stringify(attendanceSessions));
  }, [attendanceSessions]);

  useEffect(() => {
    localStorage.setItem('51_scouttrack_duties', JSON.stringify(duties));
  }, [duties]);

  // Handle Scout Form submit
  const handleScoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.lastName.trim()) return;

    const combinedName = `${formData.firstName.trim()} ${formData.lastName.trim()}`;

    if (editingScoutId) {
      setScouts(prev => prev.map(s => s.id === editingScoutId ? {
        ...s,
        name: combinedName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoUrl: formData.photoUrl,
        dob: formData.dob,
        doj: formData.doj,
        membershipNo: formData.membershipNo,
        nic: formData.nic,
        address: formData.address,
        parentName: formData.parentName,
        relationship: formData.relationship,
        parentPhone: formData.parentPhone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        section: formData.section,
        patrol: formData.patrol,
        rank: formData.rank,
        role: formData.role,
        duesStatus: formData.duesStatus,
        duesAmount: Number(formData.duesAmount)
      } : s));
      setEditingScoutId(null);
    } else {
      const newScout: Scout = {
        id: `sc-${Date.now()}`,
        name: combinedName,
        firstName: formData.firstName,
        lastName: formData.lastName,
        photoUrl: formData.photoUrl,
        dob: formData.dob,
        doj: formData.doj,
        membershipNo: formData.membershipNo,
        nic: formData.nic,
        address: formData.address,
        parentName: formData.parentName,
        relationship: formData.relationship,
        parentPhone: formData.parentPhone,
        whatsapp: formData.whatsapp,
        email: formData.email,
        section: formData.section,
        patrol: formData.patrol,
        rank: formData.rank,
        role: formData.role,
        attendanceRate: 100,
        duesStatus: formData.duesStatus,
        duesAmount: Number(formData.duesAmount),
        earnedBadges: [],
        rankRequirements: {}
      };
      setScouts(prev => [...prev, newScout]);
    }

    setFormData({
      name: '',
      firstName: '',
      lastName: '',
      photoUrl: '',
      dob: '',
      doj: '',
      membershipNo: '',
      nic: '',
      address: '',
      parentName: '',
      relationship: '',
      parentPhone: '',
      whatsapp: '',
      email: '',
      section: 'scouts',
      patrol: 'Eagle Patrol',
      rank: 'Tenderfoot',
      role: 'Member',
      duesStatus: 'Paid',
      duesAmount: 0
    });
    setIsFormOpen(false);
  };

  // Open Edit Scout form
  const handleEditScout = (scout: Scout) => {
    setEditingScoutId(scout.id);
    const spaceIdx = scout.name.indexOf(' ');
    const fName = scout.firstName || (spaceIdx !== -1 ? scout.name.substring(0, spaceIdx) : scout.name);
    const lName = scout.lastName || (spaceIdx !== -1 ? scout.name.substring(spaceIdx + 1) : '');

    setFormData({
      name: scout.name,
      firstName: fName,
      lastName: lName,
      photoUrl: scout.photoUrl || '',
      dob: scout.dob || '',
      doj: scout.doj || '',
      membershipNo: scout.membershipNo || '',
      nic: scout.nic || '',
      address: scout.address || '',
      parentName: scout.parentName || '',
      relationship: scout.relationship || '',
      parentPhone: scout.parentPhone || '',
      whatsapp: scout.whatsapp || '',
      email: scout.email || '',
      section: scout.section,
      patrol: scout.patrol,
      rank: scout.rank,
      role: scout.role,
      duesStatus: scout.duesStatus,
      duesAmount: scout.duesAmount
    });
    setIsFormOpen(true);
  };

  // Delete Scout
  const handleDeleteScout = (id: string) => {
    if (confirm('Are you sure you want to delete this scout from the roster?')) {
      setScouts(prev => prev.filter(s => s.id !== id));
      if (activeScoutId === id) {
        setActiveScoutId(scouts.find(s => s.id !== id)?.id || '');
      }
    }
  };

  // Toggle rank requirements (Advancement Tab)
  const toggleRequirement = (reqId: string, currentStatus: 'Not Started' | 'Proposed' | 'Completed') => {
    setScouts(prev => prev.map(s => {
      if (s.id !== activeScoutId) return s;

      const currentReqs = { ...s.rankRequirements };
      let nextStatus: 'Not Started' | 'Proposed' | 'Completed' = 'Not Started';

      if (userRole === 'leader') {
        // Leaders cycle between Not Started -> Completed -> Not Started
        nextStatus = currentStatus === 'Completed' ? 'Not Started' : 'Completed';
      } else {
        // Scouts can propose or retract proposal
        nextStatus = currentStatus === 'Proposed' ? 'Not Started' : 'Proposed';
      }

      currentReqs[reqId] = nextStatus;
      return { ...s, rankRequirements: currentReqs };
    }));
  };

  // Leaders approve proposed requirements
  const approveRequirement = (scoutId: string, reqId: string) => {
    setScouts(prev => prev.map(s => {
      if (s.id !== scoutId) return s;
      const currentReqs = { ...s.rankRequirements };
      currentReqs[reqId] = 'Completed';
      return { ...s, rankRequirements: currentReqs };
    }));
  };

  // Handle Attendance changes
  const updateAttendance = (sessionId: string, scoutId: string, status: 'Present' | 'Excused' | 'Absent') => {
    setAttendanceSessions(prev => prev.map(session => {
      if (session.id !== sessionId) return session;
      const updatedRecords = { ...session.records, [scoutId]: status };
      return { ...session, records: updatedRecords };
    }));

    // Recalculate average attendance rate for the scout
    setTimeout(() => {
      setScouts(prevScouts => prevScouts.map(scout => {
        const scoutSessions = attendanceSessions.map(s => {
          if (s.id === sessionId) {
            return status;
          }
          return s.records[scout.id] || 'Absent';
        });
        const presents = scoutSessions.filter(st => st === 'Present' || st === 'Excused').length;
        const total = scoutSessions.length || 1;
        const newRate = Math.round((presents / total) * 100);
        return { ...scout, attendanceRate: newRate };
      }));
    }, 100);
  };

  // Create new attendance session
  const handleCreateAttendanceSession = (e: React.FormEvent) => {
    e.preventDefault();
    const initialRecords: { [scoutId: string]: 'Present' | 'Excused' | 'Absent' } = {};
    scouts.forEach(s => {
      initialRecords[s.id] = 'Present';
    });

    const newSession: AttendanceSession = {
      id: `att-${Date.now()}`,
      eventName: attFormData.eventName,
      date: attFormData.date,
      records: initialRecords
    };

    setAttendanceSessions(prev => [newSession, ...prev]);
    setIsAttFormOpen(false);
  };

  // Create new duty assignment
  const handleCreateDuty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dutyFormData.eventName || !dutyFormData.date) return;

    const newDuty: DutyAssignment = {
      id: `dy-${Date.now()}`,
      eventName: dutyFormData.eventName,
      date: dutyFormData.date,
      cookId: dutyFormData.cookId || scouts[0]?.id || '',
      fireBuilderId: dutyFormData.fireBuilderId || scouts[1]?.id || '',
      waterCarrierId: dutyFormData.waterCarrierId || scouts[2]?.id || '',
      quartermasterId: dutyFormData.quartermasterId || scouts[3]?.id || '',
      firstAiderId: dutyFormData.firstAiderId || scouts[4]?.id || ''
    };

    setDuties(prev => [newDuty, ...prev]);
    setIsDutyFormOpen(false);
    setDutyFormData({
      eventName: '',
      date: '',
      cookId: '',
      fireBuilderId: '',
      waterCarrierId: '',
      quartermasterId: '',
      firstAiderId: ''
    });
  };

  // Delete duty
  const handleDeleteDuty = (id: string) => {
    if (confirm('Are you sure you want to delete this duty assignment?')) {
      setDuties(prev => prev.filter(d => d.id !== id));
    }
  };

  const filteredScouts = scouts.filter(s => {
    const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          s.patrol.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          s.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSection = selectedSection === 'all' || s.section === selectedSection;
    return matchesSearch && matchesSection;
  });

  const selectedScout = scouts.find(s => s.id === activeScoutId) || scouts[0];

  // Get active requirements based on selected scout's section
  const getScoutRequirements = (scout: Scout) => {
    if (!scout) return [];
    if (scout.section === 'cubs') {
      return RANK_REQUIREMENTS_CONFIG.cubs.requirements;
    } else if (scout.section === 'rovers') {
      return RANK_REQUIREMENTS_CONFIG.rovers.requirements;
    } else {
      // Boy/Girl Scouts can have multiple. Let's merge or choose based on rank
      if (scout.rank === 'First Class' || scout.rank === "President's Scout") {
        return RANK_REQUIREMENTS_CONFIG.scouts.requirements3; // President's Scout reqs
      } else if (scout.rank === 'Second Class') {
        return RANK_REQUIREMENTS_CONFIG.scouts.requirements; // First class reqs
      } else {
        return RANK_REQUIREMENTS_CONFIG.scouts.requirements2; // Second class reqs
      }
    }
  };

  const getRequirementsTitle = (scout: Scout) => {
    if (!scout) return '';
    if (scout.section === 'cubs') {
      return RANK_REQUIREMENTS_CONFIG.cubs.title;
    } else if (scout.section === 'rovers') {
      return RANK_REQUIREMENTS_CONFIG.rovers.title;
    } else {
      if (scout.rank === 'First Class' || scout.rank === "President's Scout") {
        return RANK_REQUIREMENTS_CONFIG.scouts.title3;
      } else if (scout.rank === 'Second Class') {
        return RANK_REQUIREMENTS_CONFIG.scouts.title;
      } else {
        return RANK_REQUIREMENTS_CONFIG.scouts.title2;
      }
    }
  };

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="bg-brand-cream text-slate-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header with Title and Role Simulator Switch */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 mb-8 border-b-2 border-slate-200/60 pb-6">
          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1.5 bg-brand-green/10 border border-brand-green/20 px-3 py-1 rounded-full text-brand-green text-xs font-bold uppercase tracking-wider">
              <Sliders className="w-3.5 h-3.5 text-brand-gold fill-brand-gold" />
              <span>TroopTrack Dashboard</span>
            </div>
            <h2 className="font-sans font-black text-3xl sm:text-4xl tracking-tight text-brand-green">
              ScoutTrack Management System
            </h2>
            <p className="text-slate-600 text-sm font-light">
              Official roster tracker, advancement progress log, attendance register, and patrol duty planner for Ananda Sastralaya Kotte.
            </p>
          </div>

          {/* Authenticated User Profile Panel & Logout */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-white border border-slate-200 rounded-2xl p-4 shadow-sm shrink-0">
            <div className="flex items-center gap-3 text-left w-full sm:w-auto">
              <div className="w-10 h-10 rounded-xl bg-brand-green text-brand-gold border border-brand-gold/30 flex items-center justify-center text-lg font-black font-mono shadow-sm">
                {currentUser?.fullName.charAt(0)}
              </div>
              <div className="min-w-[120px]">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-black text-slate-800 line-clamp-1">{currentUser?.fullName}</span>
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider shrink-0 ${
                    currentUser?.role === 'admin' ? 'bg-red-600 text-white' :
                    currentUser?.role === 'leader' ? 'bg-brand-green text-brand-gold' :
                    'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {currentUser?.role}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 block mt-0.5">
                  ID: {currentUser?.username.toUpperCase()} • ASK Campus Net
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-100 pt-2 sm:pt-0 sm:pl-3 justify-between sm:justify-start">
              {/* Leader override toggle for quick evaluation on the same screen (smart tool feature!) */}
              <button
                onClick={() => {
                  setUserRole(prev => prev === 'leader' ? 'scout' : 'leader');
                }}
                className={`px-2.5 py-1.5 rounded-lg text-[9px] font-bold uppercase transition cursor-pointer flex items-center gap-1 border ${
                  userRole === 'leader'
                    ? 'bg-brand-green/5 text-brand-green border-brand-green/20'
                    : 'bg-brand-gold/10 text-brand-gold-hover border-brand-gold/20'
                }`}
                title="Toggle testing permission role on current dashboard view"
              >
                <span>Override: {userRole.toUpperCase()}</span>
              </button>

              <button
                onClick={() => {
                  localStorage.removeItem('51_scouttrack_user');
                  setCurrentUser(null);
                }}
                className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-400 hover:text-rose-600 border border-slate-200 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                title="Logout from Session"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="sm:hidden text-[10px]">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Sub-tabs Selection Toolbar */}
        <div className="bg-white border border-slate-200 rounded-2xl p-2 mb-8 flex flex-wrap gap-1.5 shadow-xs">
          <button
            onClick={() => setSubTab('roster')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'roster'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Roster</span>
          </button>
          <button
            onClick={() => setSubTab('patrols')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'patrols'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Patrols</span>
          </button>
          <button
            onClick={() => setSubTab('advancement')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'advancement'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Award className="w-3.5 h-3.5" />
            <span>Advancement Log</span>
          </button>
          <button
            onClick={() => setSubTab('badges-editor')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'badges-editor'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <FolderLock className="w-3.5 h-3.5" />
            <span>Badges/Awards</span>
          </button>
          <button
            onClick={() => setSubTab('attendance')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'attendance'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Attendance</span>
          </button>
          <button
            onClick={() => setSubTab('duty')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'duty'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Duty Roster</span>
          </button>
          <button
            onClick={() => setSubTab('money-book')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'money-book'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <DollarSign className="w-3.5 h-3.5" />
            <span>Money Book</span>
          </button>
          <button
            onClick={() => setSubTab('calendar')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'calendar'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
          <button
            onClick={() => setSubTab('albums')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'albums'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Albums</span>
          </button>
          <button
            onClick={() => setSubTab('elibrary')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'elibrary'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>E-Library</span>
          </button>
          <button
            onClick={() => setSubTab('chat')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'chat'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Chat</span>
          </button>
          <button
            onClick={() => setSubTab('storage')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'storage'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-3.5 h-3.5" />
            <span>Drive Space</span>
          </button>
          <button
            onClick={() => setSubTab('my-profile')}
            className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
              subTab === 'my-profile'
                ? 'bg-brand-green text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>My Profile</span>
          </button>
          {(currentUser?.role === 'admin' || currentUser?.role === 'leader') && (
            <button
              onClick={() => setSubTab('troop-settings')}
              className={`flex items-center space-x-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                subTab === 'troop-settings'
                  ? 'bg-brand-gold text-brand-green shadow-sm'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Troop Settings</span>
            </button>
          )}
        </div>

        {/* ----------------- SUBTAB 1: PATROL ROSTER ----------------- */}
        {subTab === 'roster' && (
          <div className="space-y-6">
            
            {/* Filter and Search Bar */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-xs">
              <div className="relative flex-grow">
                <Search className="w-4 h-4 absolute left-3 top-3.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search scouts by name, patrol or role..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 focus:outline-none focus:border-brand-green placeholder-slate-400"
                />
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs text-slate-500 font-bold whitespace-nowrap">Filter Section:</span>
                <div className="flex bg-slate-100 p-1 rounded-lg border border-slate-200">
                  {(['all', 'cubs', 'scouts', 'rovers'] as const).map((sec) => (
                    <button
                      key={sec}
                      onClick={() => setSelectedSection(sec)}
                      className={`px-3 py-1 rounded text-[10px] font-bold uppercase transition-all cursor-pointer ${
                        selectedSection === sec
                          ? 'bg-brand-green text-white shadow-xs'
                          : 'text-slate-500 hover:text-slate-800'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>

                {userRole === 'leader' && (
                  <button
                    onClick={() => {
                      setEditingScoutId(null);
                      setFormData({
                        name: '',
                        firstName: '',
                        lastName: '',
                        photoUrl: '',
                        dob: '',
                        doj: '',
                        membershipNo: '',
                        nic: '',
                        address: '',
                        parentName: '',
                        relationship: '',
                        parentPhone: '',
                        whatsapp: '',
                        email: '',
                        section: 'scouts',
                        patrol: 'Eagle Patrol',
                        rank: 'Tenderfoot',
                        role: 'Member',
                        duesStatus: 'Paid',
                        duesAmount: 0
                      });
                      setIsFormOpen(true);
                    }}
                    className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-3 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Add Scout</span>
                  </button>
                )}
              </div>
            </div>

            {/* Scouts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredScouts.map((scout) => (
                <div 
                  key={scout.id}
                  className={`bg-white border-2 rounded-2xl p-5 shadow-xs transition duration-200 hover:shadow-md relative overflow-hidden ${
                    activeScoutId === scout.id ? 'border-brand-green bg-emerald-50/10' : 'border-slate-200/80'
                  }`}
                >
                  {/* Category Ribbon */}
                  <div className="absolute top-0 right-0">
                    <span className={`text-[8px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-wider text-white ${
                      scout.section === 'cubs' ? 'bg-amber-500' :
                      scout.section === 'scouts' ? 'bg-brand-green' :
                      'bg-rose-600'
                    }`}>
                      {scout.section}
                    </span>
                  </div>

                  <div className="flex items-start space-x-3.5">
                    {scout.photoUrl ? (
                      <img 
                        src={scout.photoUrl} 
                        alt={scout.name}
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-xl shrink-0">
                        {scout.section === 'cubs' ? '🦊' : scout.section === 'scouts' ? '⚜️' : '🧗'}
                      </div>
                    )}
                    <div className="space-y-0.5">
                      <h4 className="font-sans font-black text-sm text-slate-800 leading-snug">{scout.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider leading-none">
                        {scout.role} • {scout.patrol}
                      </p>
                      <div className="flex items-center space-x-1.5 pt-1">
                        <span className="text-[10px] text-brand-green-light font-bold bg-brand-green/10 px-2 py-0.5 rounded-full">
                          {scout.rank}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Scout Quick details list */}
                  <div className="grid grid-cols-2 gap-3 mt-4 border-t border-slate-100 pt-3.5 text-xs text-left">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Attendance Rate</span>
                      <span className="font-semibold text-slate-700 block mt-1 flex items-center gap-1">
                        <Activity className="w-3.5 h-3.5 text-brand-green" />
                        {scout.attendanceRate}%
                      </span>
                    </div>

                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Dues Balance</span>
                      <span className={`font-semibold block mt-1 flex items-center gap-0.5 ${
                        scout.duesStatus === 'Paid' ? 'text-brand-green' :
                        scout.duesStatus === 'Pending' ? 'text-amber-600' :
                        'text-rose-600 font-bold'
                      }`}>
                        <DollarSign className="w-3.5 h-3.5" />
                        {scout.duesStatus === 'Paid' ? 'Fully Paid' : `LKR ${scout.duesAmount} (${scout.duesStatus})`}
                      </span>
                    </div>
                  </div>

                  {/* Badges overview */}
                  <div className="mt-4 border-t border-slate-100 pt-3 text-left">
                    <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none mb-1.5">Earned Badges</span>
                    <div className="flex flex-wrap gap-1 min-h-6">
                      {scout.earnedBadges.length === 0 ? (
                        <span className="text-[10px] text-slate-400 font-light italic">No formal merit badges earned yet.</span>
                      ) : (
                        scout.earnedBadges.map(bId => {
                          const badgeObj = BADGES_DATA.find(b => b.id === bId);
                          return (
                            <span 
                              key={bId}
                              title={badgeObj?.name || bId}
                              className="text-[10px] bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 flex items-center gap-0.5 text-slate-600"
                            >
                              <span>{badgeObj?.icon || '🏅'}</span>
                              <span className="font-medium">{badgeObj?.name.split(' ')[0]}</span>
                            </span>
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      onClick={() => {
                        setActiveScoutId(scout.id);
                        setSubTab('advancement');
                      }}
                      className="text-[10px] text-brand-green font-extrabold hover:text-brand-green-light cursor-pointer flex items-center space-x-1 uppercase tracking-wider"
                    >
                      <span>Track Advancement</span>
                      <ChevronRight className="w-3 h-3" />
                    </button>

                    {userRole === 'leader' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEditScout(scout)}
                          className="p-1.5 text-slate-400 hover:text-brand-green hover:bg-slate-50 rounded-lg transition"
                          title="Edit Scout Details"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteScout(scout.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="Delete Scout"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredScouts.length === 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                <p className="text-sm font-medium">No scouts found matching your search or filters.</p>
              </div>
            )}
          </div>
        )}

        {/* ----------------- SUBTAB 2: ADVANCEMENT LOG ----------------- */}
        {subTab === 'advancement' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left Selector: Scouts Roster Sidebar */}
            <div className="lg:col-span-4 space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest px-1">
                Select Scout
              </span>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {scouts.map((s) => {
                  const isSelected = s.id === activeScoutId;
                  // Calculate rank progress %
                  const reqs = getScoutRequirements(s);
                  const completedCount = reqs.filter(r => s.rankRequirements[r.id] === 'Completed').length;
                  const progressPct = reqs.length ? Math.round((completedCount / reqs.length) * 100) : 0;

                  return (
                    <button
                      key={s.id}
                      onClick={() => setActiveScoutId(s.id)}
                      className={`w-full text-left p-3.5 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-white border-brand-green shadow-sm scale-[1.01]'
                          : 'bg-white/70 hover:bg-white border-slate-200 hover:border-brand-green/30 shadow-xs'
                      }`}
                    >
                      <div className="text-left space-y-0.5">
                        <h4 className={`font-sans font-bold text-xs leading-none ${isSelected ? 'text-brand-green' : 'text-slate-800'}`}>
                          {s.name}
                        </h4>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                          {s.rank} • {s.patrol}
                        </p>
                        
                        {/* Progress bar info */}
                        <div className="flex items-center space-x-2 pt-1.5 w-32">
                          <div className="w-full bg-slate-100 h-1 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-green rounded-full transition-all duration-300"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                          <span className="text-[8px] font-mono font-bold text-slate-500">{progressPct}%</span>
                        </div>
                      </div>

                      <Compass className={`w-4 h-4 shrink-0 ${isSelected ? 'text-brand-green' : 'text-slate-300'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right Panel: Selected Scout advancement details */}
            <div className="lg:col-span-8">
              {selectedScout ? (
                <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden text-slate-800">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-green/5 rounded-full filter blur-2xl pointer-events-none" />

                  {/* Scout Header Info */}
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-5 mb-6 gap-4">
                    <div className="flex items-start gap-4">
                      {selectedScout.photoUrl ? (
                        <img 
                          src={selectedScout.photoUrl} 
                          alt={selectedScout.name}
                          referrerPolicy="no-referrer"
                          className="w-16 h-16 rounded-2xl object-cover border-2 border-brand-green/20 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-2xl bg-slate-50 border-2 border-slate-100 flex items-center justify-center text-3xl shrink-0">
                          {selectedScout.section === 'cubs' ? '🦊' : selectedScout.section === 'scouts' ? '⚜️' : '🧗'}
                        </div>
                      )}
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-bold bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full text-slate-500 uppercase tracking-widest">
                            {selectedScout.section} section
                          </span>
                          <span className="text-[9px] font-bold bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full uppercase tracking-wider">
                            Current Rank: {selectedScout.rank}
                          </span>
                        </div>
                        <h3 className="font-sans font-black text-2xl text-brand-green mt-1">{selectedScout.name}</h3>
                        <p className="text-xs text-slate-400 mt-0.5 font-sans font-medium uppercase tracking-wider">
                          {selectedScout.role} • {selectedScout.patrol}
                        </p>
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-center min-w-20 self-stretch sm:self-center flex flex-col justify-center">
                      <span className="text-[9px] text-slate-400 uppercase font-bold tracking-wider block">Requirements</span>
                      <span className="text-lg font-black text-brand-green leading-none block mt-1">
                        {getScoutRequirements(selectedScout).filter(r => selectedScout.rankRequirements[r.id] === 'Completed').length} / {getScoutRequirements(selectedScout).length}
                      </span>
                    </div>
                  </div>

                  {/* Scout Bio Expanded Details Grid */}
                  <div className="bg-slate-50/50 border border-slate-100 rounded-xl p-4 mb-6 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-left">
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Membership No</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.membershipNo || 'COL51-M-' + selectedScout.id}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Date of Birth</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.dob || '2012-05-15'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Date of Joining</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.doj || '2023-01-10'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">NIC Number</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.nic || 'Not Provided'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Parent/Guardian</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.parentName || 'Kapila Wickramasinghe'} ({selectedScout.relationship || 'Father'})</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Parent's Phone</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.parentPhone || '+94 77 111 2222'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Whatsapp</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.whatsapp || '+94 77 333 4444'}</span>
                    </div>
                    <div>
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">E-mail</span>
                      <span className="font-semibold text-slate-700 block mt-0.5 truncate">{selectedScout.email || 'parent@sastralaya.lk'}</span>
                    </div>
                    <div className="col-span-2 sm:col-span-3">
                      <span className="text-[9px] text-slate-400 font-bold block uppercase tracking-wider">Address</span>
                      <span className="font-semibold text-slate-700 block mt-0.5">{selectedScout.address || 'No 42, Kotte Road, Kotte'}</span>
                    </div>
                  </div>

                  {/* Interactive Requirement Checkbox List */}
                  <div className="space-y-4 text-left">
                    <div className="flex justify-between items-center px-1">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {getRequirementsTitle(selectedScout)}
                      </span>
                      <span className="text-[10px] text-slate-400 font-light">
                        {userRole === 'leader' ? '*Click to toggle sign-off' : '*Click to propose completion'}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {getScoutRequirements(selectedScout).map((req, index) => {
                        const status = selectedScout.rankRequirements[req.id] || 'Not Started';
                        return (
                          <div 
                            key={req.id}
                            className={`p-4 rounded-xl border transition duration-150 flex items-start justify-between gap-4 ${
                              status === 'Completed' ? 'bg-emerald-50/20 border-brand-green/30' :
                              status === 'Proposed' ? 'bg-amber-50/20 border-amber-500/30' :
                              'bg-slate-50/50 border-slate-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className="flex items-start space-x-3 text-xs leading-relaxed">
                              <span className="font-mono font-bold text-slate-400 mt-0.5">0{index + 1}.</span>
                              <div>
                                <p className={`font-medium ${status === 'Completed' ? 'text-slate-800 font-semibold' : 'text-slate-600'}`}>
                                  {req.text}
                                </p>
                                {status === 'Proposed' && (
                                  <span className="inline-flex items-center text-[9px] font-bold text-amber-600 uppercase tracking-wider mt-1.5">
                                    <Clock className="w-3 h-3 mr-1" />
                                    Proposed by Scout - Pending Scoutmaster Sign-off
                                  </span>
                                )}
                                {status === 'Completed' && (
                                  <span className="inline-flex items-center text-[9px] font-bold text-brand-green uppercase tracking-wider mt-1.5">
                                    <CheckCircle2 className="w-3 h-3 mr-1" />
                                    Approved & Logged by Scoutmaster
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0">
                              {/* Quick Approve button for leaders on proposed items */}
                              {userRole === 'leader' && status === 'Proposed' && (
                                <button
                                  onClick={() => approveRequirement(selectedScout.id, req.id)}
                                  className="bg-brand-green hover:bg-brand-green-light text-white text-[10px] font-bold px-2 py-1 rounded cursor-pointer shadow-xs mr-1 uppercase tracking-wider"
                                >
                                  Approve
                                </button>
                              )}

                              <button
                                onClick={() => toggleRequirement(req.id, status)}
                                className={`w-6 h-6 rounded-full border flex items-center justify-center cursor-pointer transition ${
                                  status === 'Completed' ? 'bg-brand-green border-brand-green text-white shadow-xs' :
                                  status === 'Proposed' ? 'bg-amber-500 border-amber-500 text-white' :
                                  'bg-white border-slate-300 hover:border-brand-green'
                                }`}
                              >
                                {status === 'Completed' && <Check className="w-3.5 h-3.5" />}
                                {status === 'Proposed' && <Clock className="w-3.5 h-3.5" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Advancements Safety Warning */}
                  <div className="mt-8 p-4 bg-brand-green/5 border border-brand-green/20 rounded-xl flex items-start space-x-3 text-[11px] text-slate-500 leading-relaxed text-left">
                    <UserCheck className="w-4 h-4 text-brand-green shrink-0 mt-0.5" />
                    <p>
                      <strong className="text-brand-green font-bold block mb-0.5">Honest Advancement Standard:</strong>
                      A scout is trustworthy. Ranks must be earned honestly and verified on-field through practical skills evaluation before final official registry recording.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400">
                  <Users className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">Select a scout on the left to inspect rank and badge progress.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ----------------- SUBTAB 3: ATTENDANCE REGISTER ----------------- */}
        {subTab === 'attendance' && (
          <div className="space-y-6">
            
            {/* Header toolbar for creating new session */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Attendance Sessions</span>
                <span className="text-[11px] text-slate-400">Total Recorded: {attendanceSessions.length} session logs</span>
              </div>

              {userRole === 'leader' && (
                <button
                  onClick={() => setIsAttFormOpen(true)}
                  className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-3 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Log Meeting Attendance</span>
                </button>
              )}
            </div>

            {/* Attendance Table per Session */}
            <div className="space-y-8 text-left">
              {attendanceSessions.map((session) => {
                const sessionAttendees = session.records;
                const totalPresent = Object.values(sessionAttendees).filter(s => s === 'Present').length;
                const totalExcused = Object.values(sessionAttendees).filter(s => s === 'Excused').length;
                const totalAbsent = Object.values(sessionAttendees).filter(s => s === 'Absent').length;
                const totalCount = Object.keys(sessionAttendees).length || 1;
                const rate = Math.round(((totalPresent + totalExcused) / totalCount) * 100);

                return (
                  <div key={session.id} className="bg-white border border-slate-200 rounded-2xl p-5 sm:p-6 shadow-xs">
                    
                    {/* Session Meta */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 mb-4 gap-4">
                      <div>
                        <h4 className="font-sans font-black text-base text-brand-green">{session.eventName}</h4>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                          Date: {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-center text-xs">
                          <span className="text-slate-400 font-bold uppercase block text-[8px] leading-none">Turnout Pct</span>
                          <span className="font-bold text-brand-green">{rate}%</span>
                        </div>
                        <div className="bg-emerald-50 text-brand-green px-2.5 py-1.5 rounded-lg text-center text-xs">
                          <span className="font-bold text-[8px] block uppercase leading-none">Present</span>
                          <span className="font-bold">{totalPresent}</span>
                        </div>
                        <div className="bg-amber-50 text-amber-600 px-2.5 py-1.5 rounded-lg text-center text-xs">
                          <span className="font-bold text-[8px] block uppercase leading-none">Excused</span>
                          <span className="font-bold">{totalExcused}</span>
                        </div>
                        <div className="bg-rose-50 text-rose-600 px-2.5 py-1.5 rounded-lg text-center text-xs">
                          <span className="font-bold text-[8px] block uppercase leading-none">Absent</span>
                          <span className="font-bold">{totalAbsent}</span>
                        </div>
                      </div>
                    </div>

                    {/* Scouts list attendance check */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {scouts.map(scout => {
                        const status = sessionAttendees[scout.id] || 'Absent';
                        return (
                          <div 
                            key={scout.id}
                            className="bg-slate-50/50 border border-slate-100 p-3.5 rounded-xl flex items-center justify-between"
                          >
                            <div className="text-left">
                              <span className="font-bold text-xs text-slate-800 block">{scout.name}</span>
                              <span className="text-[9px] text-slate-400 uppercase tracking-wider">{scout.patrol}</span>
                            </div>

                            {/* Attendance Controls */}
                            <div className="flex items-center space-x-1">
                              {userRole === 'leader' ? (
                                <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                                  <button
                                    onClick={() => updateAttendance(session.id, scout.id, 'Present')}
                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                      status === 'Present' ? 'bg-brand-green text-white shadow-xs' : 'text-slate-500'
                                    }`}
                                  >
                                    P
                                  </button>
                                  <button
                                    onClick={() => updateAttendance(session.id, scout.id, 'Excused')}
                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                      status === 'Excused' ? 'bg-amber-500 text-white shadow-xs' : 'text-slate-500'
                                    }`}
                                  >
                                    E
                                  </button>
                                  <button
                                    onClick={() => updateAttendance(session.id, scout.id, 'Absent')}
                                    className={`px-2 py-1 rounded text-[9px] font-bold transition-all cursor-pointer ${
                                      status === 'Absent' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500'
                                    }`}
                                  >
                                    A
                                  </button>
                                </div>
                              ) : (
                                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                                  status === 'Present' ? 'bg-brand-green/10 text-brand-green' :
                                  status === 'Excused' ? 'bg-amber-100 text-amber-700' :
                                  'bg-rose-100 text-rose-600'
                                }`}>
                                  {status}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ----------------- SUBTAB 4: PATROL DUTY ROSTER ----------------- */}
        {subTab === 'duty' && (
          <div className="space-y-6">
            
            {/* Header Block */}
            <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 shadow-xs">
              <div className="text-left">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Camp & Event Duty Roster</span>
                <span className="text-[11px] text-slate-400 font-light">Assign core responsibilities to patrol members for safety and structured operations.</span>
              </div>

              {userRole === 'leader' && (
                <button
                  onClick={() => setIsDutyFormOpen(true)}
                  className="bg-brand-green hover:bg-brand-green-light text-white font-bold px-3 py-2 rounded-lg text-xs uppercase tracking-wider flex items-center space-x-1.5 cursor-pointer shadow-xs shrink-0 self-start sm:self-center"
                >
                  <Plus className="w-4 h-4" />
                  <span>Assign Duty Roster</span>
                </button>
              )}
            </div>

            {/* Duties list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-left">
              {duties.map((duty) => {
                const cook = scouts.find(s => s.id === duty.cookId);
                const fire = scouts.find(s => s.id === duty.fireBuilderId);
                const water = scouts.find(s => s.id === duty.waterCarrierId);
                const qm = scouts.find(s => s.id === duty.quartermasterId);
                const fa = scouts.find(s => s.id === duty.firstAiderId);

                return (
                  <div key={duty.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-gold/5 rounded-full filter blur-2xl pointer-events-none" />
                    
                    {/* Title */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-4 mb-5">
                      <div>
                        <h4 className="font-sans font-black text-base text-brand-green">{duty.eventName}</h4>
                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                          📅 Scheduled Date: {duty.date}
                        </span>
                      </div>

                      {userRole === 'leader' && (
                        <button
                          onClick={() => handleDeleteDuty(duty.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                          title="Delete Duty Roster"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    {/* Roles Assignment Grid */}
                    <div className="space-y-3">
                      
                      {/* Cook */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="bg-brand-gold/20 p-2 rounded-lg text-amber-700">
                            <Cookie className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Patrol Cook 🍳</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{cook?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono italic">Campfire Chef</span>
                      </div>

                      {/* Fire Builder */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="bg-rose-50 p-2 rounded-lg text-rose-600">
                            <Flame className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Fire Marshal 🔥</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{fire?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono italic">Fuel & Wood</span>
                      </div>

                      {/* Water Carrier */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                            <Droplet className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Water Carrier 💧</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{water?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono italic">Hydration Boss</span>
                      </div>

                      {/* Site Quartermaster */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="bg-emerald-50 p-2 rounded-lg text-brand-green">
                            <Compass className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">Quartermaster 🏕️</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{qm?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono italic">Camp & Gear</span>
                      </div>

                      {/* First Aid Expert */}
                      <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                        <div className="flex items-center space-x-3 text-xs">
                          <div className="bg-red-50 p-2 rounded-lg text-red-600">
                            <Activity className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-400 font-bold block uppercase leading-none">First Aider 🩹</span>
                            <span className="text-slate-800 font-bold block mt-0.5">{fa?.name || 'Unassigned'}</span>
                          </div>
                        </div>
                        <span className="text-[9px] text-slate-500 font-mono italic">Safety Patrol</span>
                      </div>

                    </div>
                  </div>
                );
              })}

              {duties.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center text-slate-400 col-span-2">
                  <Flame className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                  <p className="text-sm font-medium">No campout duty rosters have been set up yet.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {subTab === 'patrols' && (
          <PatrolManager 
            currentUser={currentUser}
            scouts={scouts}
            onUpdateScoutPatrol={(scoutId, newPatrolName) => {
              setScouts(prev => {
                const updated = prev.map(s => s.id === scoutId ? { ...s, patrol: newPatrolName } : s);
                localStorage.setItem('51_scouttrack_scouts', JSON.stringify(updated));
                return updated;
              });
            }}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'badges-editor' && (
          <BadgesEditor 
            currentUser={currentUser}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'calendar' && (
          <GoogleCalendar 
            currentUser={currentUser}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'albums' && (
          <PhotoAlbums 
            userRole={userRole}
            currentUser={currentUser}
            onStorageChange={setPhotoSizeMB}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'elibrary' && (
          <ELibrary 
            currentUser={currentUser}
            onStorageChange={setElibrarySizeMB}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'chat' && (
          <ScoutChat 
            currentUser={currentUser}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'storage' && (
          <StorageManager 
            photoSizeMB={photoSizeMB}
            elibrarySizeMB={elibrarySizeMB}
            receiptSizeMB={receiptSizeMB}
            currentUser={currentUser}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'money-book' && (
          <MoneyBook 
            currentUser={currentUser}
            scouts={scouts}
            onStorageChange={setReceiptSizeMB}
            onAuditLog={handleAuditLog}
          />
        )}

        {subTab === 'my-profile' && (
          <MyProfile 
            currentUser={currentUser}
            onUpdateSession={(newSession) => {
              setCurrentUser(newSession);
              localStorage.setItem('51_scouttrack_user', JSON.stringify(newSession));
            }}
            onAuditLog={handleAuditLog}
            auditLogs={auditLogs}
          />
        )}

        {subTab === 'troop-settings' && (
          <TroopSettingsPanel onAuditLog={handleAuditLog} />
        )}

        {/* ----------------- MODAL FORM: ADD / EDIT SCOUT ----------------- */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl space-y-5 text-slate-800 relative animate-fadeIn text-left">
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <h3 className="font-sans font-black text-xl text-brand-green border-b border-slate-100 pb-3 flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-brand-gold" />
                <span>{editingScoutId ? 'Edit Scout Details' : 'Register New Scout Member'}</span>
              </h3>

              <form onSubmit={handleScoutSubmit} className="space-y-4">
                
                {/* Visual Section: Personal Details */}
                <h4 className="text-[10px] font-black uppercase text-brand-green border-b border-slate-100 pb-1 tracking-wider">
                  01. Personal Details
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">First Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                      placeholder="e.g. Dineth"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Last Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                      placeholder="e.g. Jayasuriya"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Scout Photo URL</label>
                    <input
                      type="url"
                      value={formData.photoUrl}
                      onChange={(e) => setFormData(prev => ({ ...prev, photoUrl: e.target.value }))}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                    <p className="text-[9px] text-slate-400">Optional profile picture URL</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Membership No*</label>
                    <input
                      type="text"
                      required
                      value={formData.membershipNo}
                      onChange={(e) => setFormData(prev => ({ ...prev, membershipNo: e.target.value }))}
                      placeholder="e.g. COL51-M-140"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Date of Birth*</label>
                    <input
                      type="date"
                      required
                      value={formData.dob}
                      onChange={(e) => setFormData(prev => ({ ...prev, dob: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green cursor-pointer"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Date of Joining</label>
                    <input
                      type="date"
                      value={formData.doj}
                      onChange={(e) => setFormData(prev => ({ ...prev, doj: e.target.value }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green cursor-pointer"
                    />
                    <p className="text-[9px] text-slate-400">Optional joining date</p>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">NIC Number</label>
                    <input
                      type="text"
                      value={formData.nic}
                      onChange={(e) => setFormData(prev => ({ ...prev, nic: e.target.value }))}
                      placeholder="e.g. 200512345678"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                    <p className="text-[9px] text-slate-400">Optional for juniors</p>
                  </div>
                </div>

                {/* Section 2: Scouting Structure */}
                <h4 className="text-[10px] font-black uppercase text-brand-green border-b border-slate-100 pb-1 tracking-wider pt-2">
                  02. Troop Structure
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Scouting Section*</label>
                    <select
                      value={formData.section}
                      onChange={(e) => setFormData(prev => ({ ...prev, section: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                    >
                      <option value="cubs">Cub Scouts (7-11)</option>
                      <option value="scouts">Boy/Girl Scouts (11-15)</option>
                      <option value="rovers">Rover Scouts (15-24)</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Patrol / Six Group*</label>
                    <input
                      type="text"
                      required
                      value={formData.patrol}
                      onChange={(e) => setFormData(prev => ({ ...prev, patrol: e.target.value }))}
                      placeholder="e.g. Eagle Patrol / Lion Six"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Current Rank*</label>
                    <input
                      type="text"
                      required
                      value={formData.rank}
                      onChange={(e) => setFormData(prev => ({ ...prev, rank: e.target.value }))}
                      placeholder="e.g. Tenderfoot / Gold Star"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider mb-1">Position / Leadership Role*</label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-lg border border-slate-200">
                    {[
                      'Member',
                      'Patrol Leader',
                      'Asst. Patrol Leader',
                      'Asst. Troop Leader',
                      'Troop Quatermaster',
                      'Troop Treasure',
                      'Senior'
                    ].map((roleOption) => (
                      <label key={roleOption} className="flex items-center space-x-2 text-slate-600 font-medium hover:text-brand-green cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.role === roleOption}
                          onChange={() => setFormData(prev => ({ ...prev, role: roleOption }))}
                          className="rounded border-slate-300 text-brand-green focus:ring-brand-green w-4 h-4 cursor-pointer"
                        />
                        <span className="text-[11px] select-none">{roleOption}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Section 3: Contact & Parents details */}
                <h4 className="text-[10px] font-black uppercase text-brand-green border-b border-slate-100 pb-1 tracking-wider pt-2">
                  03. Contact & Parent Details
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Parent/Guardian Full Name*</label>
                    <input
                      type="text"
                      required
                      value={formData.parentName}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
                      placeholder="e.g. Kapila Wickramasinghe"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Relationship to Scout*</label>
                    <input
                      type="text"
                      required
                      value={formData.relationship}
                      onChange={(e) => setFormData(prev => ({ ...prev, relationship: e.target.value }))}
                      placeholder="e.g. Father / Mother"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Parent Contact Number*</label>
                    <input
                      type="text"
                      required
                      value={formData.parentPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, parentPhone: e.target.value }))}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Whatsapp Number*</label>
                    <input
                      type="text"
                      required
                      value={formData.whatsapp}
                      onChange={(e) => setFormData(prev => ({ ...prev, whatsapp: e.target.value }))}
                      placeholder="e.g. +94 77 123 4567"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Email Address*</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="e.g. parent@email.com"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider">Home Address*</label>
                  <textarea
                    required
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="e.g. No 42, Kotte Road, Kotte"
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green resize-none"
                  />
                </div>

                {/* Section 4: Dues info */}
                <h4 className="text-[10px] font-black uppercase text-brand-green border-b border-slate-100 pb-1 tracking-wider pt-2">
                  04. Troop Ledger / Financial Dues
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Troop Dues Status*</label>
                    <select
                      value={formData.duesStatus}
                      onChange={(e) => setFormData(prev => ({ ...prev, duesStatus: e.target.value as any }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-600 focus:outline-none focus:border-brand-green cursor-pointer"
                    >
                      <option value="Paid">Fully Paid</option>
                      <option value="Pending">Pending</option>
                      <option value="Overdue">Overdue Balance</option>
                    </select>
                  </div>

                  <div className="space-y-1 text-xs">
                    <label className="text-slate-500 font-bold uppercase block tracking-wider">Dues Amount (LKR)*</label>
                    <input
                      type="number"
                      required
                      value={formData.duesAmount}
                      onChange={(e) => setFormData(prev => ({ ...prev, duesAmount: Number(e.target.value) }))}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                    />
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-green text-white rounded-lg text-xs font-bold uppercase hover:bg-brand-green-light transition cursor-pointer shadow-xs"
                  >
                    {editingScoutId ? 'Save Changes' : 'Enroll Scout'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- MODAL FORM: CREATE ATTENDANCE SESSION ----------------- */}
        {isAttFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-xl space-y-5 text-slate-800 relative animate-fadeIn text-left">
              <button
                onClick={() => setIsAttFormOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <h3 className="font-sans font-black text-xl text-brand-green border-b border-slate-100 pb-3 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-brand-gold" />
                <span>Initialize Meeting Attendance</span>
              </h3>

              <form onSubmit={handleCreateAttendanceSession} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider">Event Name / Meeting*</label>
                  <input
                    type="text"
                    required
                    value={attFormData.eventName}
                    onChange={(e) => setAttFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g. Patrol Leader Council Meeting"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider">Meeting Date*</label>
                  <input
                    type="date"
                    required
                    value={attFormData.date}
                    onChange={(e) => setAttFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsAttFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-green text-white rounded-lg text-xs font-bold uppercase hover:bg-brand-green-light transition cursor-pointer shadow-xs"
                  >
                    Create Register Log
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ----------------- MODAL FORM: CREATE DUTY ROSTER ----------------- */}
        {isDutyFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-xl space-y-5 text-slate-800 relative animate-fadeIn text-left">
              <button
                onClick={() => setIsDutyFormOpen(false)}
                className="absolute top-4 right-4 p-1 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>

              <h3 className="font-sans font-black text-xl text-brand-green border-b border-slate-100 pb-3 flex items-center gap-2">
                <Flame className="w-5 h-5 text-brand-gold" />
                <span>Plan Camp Patrol Duty Roster</span>
              </h3>

              <form onSubmit={handleCreateDuty} className="space-y-4">
                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider">Campout / Event Name*</label>
                  <input
                    type="text"
                    required
                    value={dutyFormData.eventName}
                    onChange={(e) => setDutyFormData(prev => ({ ...prev, eventName: e.target.value }))}
                    placeholder="e.g. Annual District Camporee 2026"
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="text-slate-500 font-bold uppercase block tracking-wider">Date*</label>
                  <input
                    type="date"
                    required
                    value={dutyFormData.date}
                    onChange={(e) => setDutyFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-800 focus:outline-none focus:border-brand-green"
                  />
                </div>

                <div className="border-t border-slate-100 pt-3 space-y-3">
                  <span className="text-xs font-black text-slate-500 uppercase block mb-1">Assign Patrol Roles</span>

                  {/* Cook */}
                  <div className="grid grid-cols-3 items-center gap-3 text-xs">
                    <label className="text-slate-500 font-bold uppercase">Patrol Cook</label>
                    <select
                      value={dutyFormData.cookId}
                      onChange={(e) => setDutyFormData(prev => ({ ...prev, cookId: e.target.value }))}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Scout...</option>
                      {scouts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>)}
                    </select>
                  </div>

                  {/* Fire Marshall */}
                  <div className="grid grid-cols-3 items-center gap-3 text-xs">
                    <label className="text-slate-500 font-bold uppercase">Fire Marshal</label>
                    <select
                      value={dutyFormData.fireBuilderId}
                      onChange={(e) => setDutyFormData(prev => ({ ...prev, fireBuilderId: e.target.value }))}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Scout...</option>
                      {scouts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>)}
                    </select>
                  </div>

                  {/* Water Carrier */}
                  <div className="grid grid-cols-3 items-center gap-3 text-xs">
                    <label className="text-slate-500 font-bold uppercase">Water Carrier</label>
                    <select
                      value={dutyFormData.waterCarrierId}
                      onChange={(e) => setDutyFormData(prev => ({ ...prev, waterCarrierId: e.target.value }))}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Scout...</option>
                      {scouts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>)}
                    </select>
                  </div>

                  {/* Quartermaster */}
                  <div className="grid grid-cols-3 items-center gap-3 text-xs">
                    <label className="text-slate-500 font-bold uppercase">Quartermaster</label>
                    <select
                      value={dutyFormData.quartermasterId}
                      onChange={(e) => setDutyFormData(prev => ({ ...prev, quartermasterId: e.target.value }))}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Scout...</option>
                      {scouts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>)}
                    </select>
                  </div>

                  {/* First Aider */}
                  <div className="grid grid-cols-3 items-center gap-3 text-xs">
                    <label className="text-slate-500 font-bold uppercase">First Aider</label>
                    <select
                      value={dutyFormData.firstAiderId}
                      onChange={(e) => setDutyFormData(prev => ({ ...prev, firstAiderId: e.target.value }))}
                      className="col-span-2 bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-600 focus:outline-none cursor-pointer"
                    >
                      <option value="">Select Scout...</option>
                      {scouts.map(s => <option key={s.id} value={s.id}>{s.name} ({s.patrol})</option>)}
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setIsDutyFormOpen(false)}
                    className="px-4 py-2 border border-slate-200 text-slate-600 rounded-lg text-xs font-bold uppercase hover:bg-slate-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-brand-green text-white rounded-lg text-xs font-bold uppercase hover:bg-brand-green-light transition cursor-pointer shadow-xs"
                  >
                    Deploy Duty Roster
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
