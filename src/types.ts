export type ActiveView = 'home' | 'sections' | 'badges' | 'uniform' | 'knots' | 'events' | 'about' | 'join';

export interface ScoutSection {
  id: string;
  name: string;
  tagline: string;
  ageRange: string;
  meetingTime: string;
  colorClass: string;
  textColor: string;
  bgGradient: string;
  accentColor: string;
  description: string;
  motto: string;
  promise: string;
  law: string[];
  activities: string[];
  badges: string[];
}

export interface Badge {
  id: string;
  name: string;
  category: 'efficiency' | 'merit' | 'general' | 'award';
  section: 'cubs' | 'scouts' | 'rovers';
  icon: string;
  description: string;
  requirements: string[];
}

export interface ScoutEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  category: 'camp' | 'meeting' | 'community' | 'competition' | 'ceremony';
  description: string;
  section: 'all' | 'cubs' | 'scouts' | 'rovers';
}

export interface Knot {
  id: string;
  name: string;
  sinhalaName?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'joining' | 'loop' | 'hitch' | 'shortening';
  description: string;
  uses: string;
  steps: string[];
  interactiveIllustration: string; // ASCII or SVG concept key
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  icon: string;
}

export interface Registration {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  section: 'cubs' | 'scouts' | 'rovers';
  schoolGrade: string;
  parentName: string;
  parentPhone: string;
  medicalConditions: string;
  bloodGroup: string;
  registeredAt: string;
  memberId: string;
}
