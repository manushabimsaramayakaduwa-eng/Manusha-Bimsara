import { UserAccount, Registration, Album, EDocument, ChatMessage, AttendanceRecord, Patrol, NotificationLog, Badge } from '../types';
import { BADGES_DATA } from '../data';

// Helper to safely load JSON from localStorage
function getLocalItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading key ${key} from localStorage`, error);
    return defaultValue;
  }
}

// Helper to save JSON to localStorage
function setLocalItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving key ${key} to localStorage`, error);
  }
}

// Default Admin Accounts
const DEFAULT_ADMINS: UserAccount[] = [
  {
    username: 'Dineth_Jayasuriya',
    password: 'Jayasuriya@2026',
    role: 'admin',
    fullName: 'Dineth Jayasuriya',
    email: 'dineth.jayasuriya@gmail.com',
    whatsapp: '+94 77 123 4567',
    address: '28, Kotte Road, Kotte, Sri Lanka',
    parentsPhone: '+94 11 269 6681',
    nic: '200612345678',
  },
  {
    username: 'Manusha_Bimsara',
    password: 'Manusha@2010',
    role: 'admin',
    fullName: 'Manusha Bimsara',
    email: 'manusha.bimsara@gmail.com',
    whatsapp: '+94 71 987 6543',
    address: 'Ananda Sastralaya Campus, Kotte, Sri Lanka',
    parentsPhone: '+94 11 269 6681',
    nic: '201098765432',
  },
];

// Default Patrols
const DEFAULT_PATROLS_LIST = [
  'Salalihini',
  'Woodpecker',
  'Pigeon',
  'Eagle',
  'Parrot',
  'Kingfisher',
  'Hawk',
  'Senior',
];

// Initial Members list (Registered scouts)
const DEFAULT_MEMBERS: Registration[] = [
  {
    memberId: 'M-51001',
    fullName: 'Nimsara Perera',
    dateOfBirth: '2011-04-12',
    gender: 'Male',
    email: 'nimsara.perera@gmail.com',
    phone: '+94 77 345 6789',
    address: '45, Kotte Road, Kotte',
    section: 'scouts',
    schoolGrade: 'Grade 9',
    parentName: 'Gamini Perera',
    parentPhone: '+94 77 999 1122',
    medicalConditions: 'None',
    bloodGroup: 'A+',
    registeredAt: '2025-01-15T10:00:00.000Z',
    // Added new fields
    // First Name, Last Name are split from Full Name
    // Scout Photo URL
    // Position, Date of Joining, NIC, Whatsapp Number, Relationship to scout
  }
];

// Populate fully compatible mock registrations
const INITIAL_REGISTRATIONS: Registration[] = [
  {
    memberId: 'M-51001',
    fullName: 'Nimsara Perera',
    dateOfBirth: '2012-05-14',
    gender: 'Male',
    email: 'nimsara.perera@gmail.com',
    phone: '+94 77 555 1122',
    address: '45, Kotte Road, Kotte, Sri Lanka',
    section: 'scouts',
    schoolGrade: 'Grade 8',
    parentName: 'Gamini Perera',
    parentPhone: '+94 77 999 1122',
    medicalConditions: 'None',
    bloodGroup: 'O+',
    registeredAt: '2025-01-15T10:00:00.000Z',
  },
  {
    memberId: 'M-51002',
    fullName: 'Senuka de Silva',
    dateOfBirth: '2011-08-22',
    gender: 'Male',
    email: 'senuka.desilva@gmail.com',
    phone: '+94 71 444 3322',
    address: '12/1, Pagoda Road, Kotte',
    section: 'scouts',
    schoolGrade: 'Grade 9',
    parentName: 'Chandra de Silva',
    parentPhone: '+94 71 888 7766',
    medicalConditions: 'Asthma (has inhaler)',
    bloodGroup: 'B+',
    registeredAt: '2024-06-10T09:30:00.000Z',
  },
  {
    memberId: 'M-51003',
    fullName: 'Kavindu Bandara',
    dateOfBirth: '2014-11-02',
    gender: 'Male',
    email: 'kavindu.bandara@gmail.com',
    phone: '+94 72 222 8888',
    address: '88, Mirihana Road, Nugegoda',
    section: 'cubs',
    schoolGrade: 'Grade 5',
    parentName: 'Wimal Bandara',
    parentPhone: '+94 72 111 2222',
    medicalConditions: 'Peanut Allergy',
    bloodGroup: 'AB+',
    registeredAt: '2025-02-20T11:00:00.000Z',
  }
];

// Extend members structure with our exact custom scout fields
export interface DetailedScout {
  memberId: string;
  firstName: string;
  lastName: string;
  scoutPhoto?: string; // Base64 or standard mock photo
  dateOfBirth: string;
  dateOfJoining?: string;
  membershipNo: string;
  patrol: string;
  nic?: string;
  position: 'Member' | 'Patrol Leader' | 'Asst. Patrol Leader' | 'Asst. Troop Leader' | 'Troop Quatermaster' | 'Troop Treasure' | 'Senior';
  address: string;
  parentName: string;
  relationshipToScout: string;
  parentPhone: string;
  whatsappNumber: string;
  email: string;
  earnedBadges: string[]; // Badge IDs
  earnedAwards: string[]; // Award Names
}

const INITIAL_SCOUT_MEMBERS: DetailedScout[] = [
  {
    memberId: 'M-51001',
    firstName: 'Nimsara',
    lastName: 'Perera',
    scoutPhoto: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
    dateOfBirth: '2012-05-14',
    dateOfJoining: '2024-01-10',
    membershipNo: 'ASK-2024-012',
    patrol: 'Woodpecker',
    nic: '',
    position: 'Patrol Leader',
    address: '45, Flower Road, Colombo 00300, Sri Lanka',
    parentName: 'Gamini Perera',
    relationshipToScout: 'Father',
    parentPhone: '+94 77 999 1122',
    whatsappNumber: '+94 77 555 1122',
    email: 'nimsara.perera@gmail.com',
    earnedBadges: ['tenderfoot', 'second-class', 'camper-badge'],
    earnedAwards: ['Troop Honour Ribbon'],
  },
  {
    memberId: 'M-51002',
    firstName: 'Senuka',
    lastName: 'de Silva',
    scoutPhoto: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
    dateOfBirth: '2011-08-22',
    dateOfJoining: '2023-05-15',
    membershipNo: 'ASK-2023-045',
    patrol: 'Eagle',
    nic: '',
    position: 'Asst. Patrol Leader',
    address: '12/1, Pagoda Road, Kotte, Sri Lanka',
    parentName: 'Chandra de Silva',
    relationshipToScout: 'Father',
    parentPhone: '+94 71 888 7766',
    whatsappNumber: '+94 71 444 3322',
    email: 'senuka.desilva@gmail.com',
    earnedBadges: ['tenderfoot', 'first-aid-scout'],
    earnedAwards: ['Best Pioneering Award 2024'],
  },
  {
    memberId: 'M-51003',
    firstName: 'Kavindu',
    lastName: 'Bandara',
    scoutPhoto: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150',
    dateOfBirth: '2014-11-02',
    dateOfJoining: '2025-02-20',
    membershipNo: 'ASK-2025-002',
    patrol: 'Salalihini',
    nic: '',
    position: 'Member',
    address: '88, Mirihana Road, Nugegoda, Sri Lanka',
    parentName: 'Wimal Bandara',
    relationshipToScout: 'Father',
    parentPhone: '+94 72 111 2222',
    whatsappNumber: '+94 72 222 8888',
    email: 'kavindu.bandara@gmail.com',
    earnedBadges: ['bronze-star', 'athlete-cub'],
    earnedAwards: [],
  },
];

// Initial default albums (Facebook-like structure)
const INITIAL_ALBUMS: Album[] = [
  {
    id: 'alb-1',
    name: 'District Camporee 2026',
    description: 'Relive the highlights of the massive Camporee event at Viharamahadevi Park. Over 3000 scouts participating.',
    createdAt: '2026-06-15T12:00:00.000Z',
    photos: [
      { id: 'p-1', url: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=800', description: 'Weekly meeting practice on stretcher carries and splints.', uploadedAt: '2026-06-15T12:05:00.000Z' },
      { id: 'p-2', url: 'https://images.unsplash.com/photo-1523987355122-830d31ff84ef?auto=format&fit=crop&q=80&w=800', description: 'Opening campfire with other scout troops.', uploadedAt: '2026-06-15T12:10:00.000Z' },
    ],
  },
  {
    id: 'alb-2',
    name: 'Pioneering Tower Build',
    description: 'Constructing a 12-foot self-standing signal tower using square and diagonal lashings.',
    createdAt: '2026-05-10T14:30:00.000Z',
    photos: [
      { id: 'p-3', url: 'https://images.unsplash.com/photo-1501555088652-021faa106b9b?auto=format&fit=crop&q=80&w=800', description: 'Laying the base structural poles.', uploadedAt: '2026-05-10T14:35:00.000Z' },
      { id: 'p-4', url: 'https://images.unsplash.com/photo-1464547323744-4edd0cd0c746?auto=format&fit=crop&q=80&w=800', description: 'Final inspection of the knots by the Scout Master.', uploadedAt: '2026-05-10T14:40:00.000Z' },
    ],
  },
];

// Initial default E-Library documents
const INITIAL_LIBRARY_DOCUMENTS: EDocument[] = [
  {
    id: 'doc-1',
    title: 'Ananda Sastralaya Kotte Pioneer\'s Handbook',
    category: 'Ropework & Lashings',
    description: 'Detailed manual on knots, splices, rigging, and heavy structures (A-frame, trestles, suspension bridges) used by our scout troop.',
    fileSize: '4.8 MB',
    fileType: 'PDF Document',
    url: '#download-handbook',
    uploadedAt: '2026-01-20T09:00:00.000Z',
  },
  {
    id: 'doc-2',
    title: 'Standard Scout Proficiency Badge Syllabus',
    category: 'Regulations',
    description: 'Official SLSA guidelines for earning Cub Stars, Scout Proficiency Badges, and the President\'s Scout Award.',
    fileSize: '2.5 MB',
    fileType: 'PDF Manual',
    url: '#download-badges',
    uploadedAt: '2026-03-12T10:30:00.000Z',
  },
  {
    id: 'doc-3',
    title: 'Outdoor Campfire Songbook (Colloquial)',
    category: 'Campfire',
    description: 'Collection of traditional Sri Lankan and international scout songs, yells, and campfire ceremonies.',
    fileSize: '1.2 MB',
    fileType: 'EPUB / eBook',
    url: '#download-songs',
    uploadedAt: '2026-04-18T15:00:00.000Z',
  },
];

// Initial Chat messages
const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  {
    id: 'msg-1',
    username: 'Dineth_Jayasuriya',
    fullName: 'Dineth Jayasuriya',
    role: 'admin',
    message: 'Welcome everyone to the new Ananda Sastralaya Kotte digital scout hub! Feel free to chat here.',
    timestamp: '2026-07-01T10:00:00.000Z',
  },
  {
    id: 'msg-2',
    username: 'nimsara_p',
    fullName: 'Nimsara Perera',
    role: 'member',
    message: 'This is amazing! Now we can track our badges and view the uniform guidelines on our mobile phones easily.',
    timestamp: '2026-07-02T14:25:00.000Z',
  },
  {
    id: 'msg-3',
    username: 'Manusha_Bimsara',
    fullName: 'Manusha Bimsara',
    role: 'admin',
    message: 'Yes, and admins can mark attendance right from the field. Keep preparing for the upcoming bridge building challenge!',
    timestamp: '2026-07-03T09:12:00.000Z',
  },
];

// Initial Attendance
const INITIAL_ATTENDANCE: AttendanceRecord[] = [
  {
    date: '2026-06-20',
    attendees: ['M-51001', 'M-51002'],
    notes: 'Weekly drill on first aid simulation and pioneering bridge construction.',
  },
  {
    date: '2026-06-27',
    attendees: ['M-51001', 'M-51002', 'M-51003'],
    notes: 'General inspection of uniforms and badge distribution ceremony.',
  },
];

// Google Drive Storage parameters
const GOOGLE_DRIVE_MAX_GB = 15.0;
// We starts with 14.2 GB so users can easily test drive full notifications!
const INITIAL_DRIVE_USED_GB = 14.15;

export class ScoutStore {
  static getAccounts(): UserAccount[] {
    return getLocalItem<UserAccount[]>('scout_accounts', DEFAULT_ADMINS);
  }

  static saveAccounts(accounts: UserAccount[]): void {
    setLocalItem('scout_accounts', accounts);
  }

  static getScouts(): DetailedScout[] {
    return getLocalItem<DetailedScout[]>('scout_members', INITIAL_SCOUT_MEMBERS);
  }

  static saveScouts(scouts: DetailedScout[]): void {
    setLocalItem('scout_members', scouts);
  }

  static getAlbums(): Album[] {
    return getLocalItem<Album[]>('scout_albums', INITIAL_ALBUMS);
  }

  static saveAlbums(albums: Album[]): void {
    setLocalItem('scout_albums', albums);
  }

  static getDocuments(): EDocument[] {
    return getLocalItem<EDocument[]>('scout_documents', INITIAL_LIBRARY_DOCUMENTS);
  }

  static saveDocuments(docs: EDocument[]): void {
    setLocalItem('scout_documents', docs);
  }

  static getChatMessages(): ChatMessage[] {
    return getLocalItem<ChatMessage[]>('scout_chat', INITIAL_CHAT_MESSAGES);
  }

  static saveChatMessages(msgs: ChatMessage[]): void {
    setLocalItem('scout_chat', msgs);
  }

  static getAttendance(): AttendanceRecord[] {
    return getLocalItem<AttendanceRecord[]>('scout_attendance', INITIAL_ATTENDANCE);
  }

  static saveAttendance(attendance: AttendanceRecord[]): void {
    setLocalItem('scout_attendance', attendance);
  }

  static getPatrols(): Patrol[] {
    // Dynamically calculate based on members or stored list
    const stored = localStorage.getItem('scout_patrols');
    if (stored) {
      return JSON.parse(stored);
    }
    const patrols: Patrol[] = DEFAULT_PATROLS_LIST.map((name) => {
      const members = this.getScouts().filter((s) => s.patrol.toLowerCase() === name.toLowerCase());
      return {
        id: name.toLowerCase(),
        name,
        memberIds: members.map((m) => m.memberId),
      };
    });
    this.savePatrols(patrols);
    return patrols;
  }

  static savePatrols(patrols: Patrol[]): void {
    setLocalItem('scout_patrols', patrols);
  }

  static getBadges(): Badge[] {
    return getLocalItem<Badge[]>('scout_badges_config', BADGES_DATA);
  }

  static saveBadges(badges: Badge[]): void {
    setLocalItem('scout_badges_config', badges);
  }

  static getNotificationLogs(): NotificationLog[] {
    return getLocalItem<NotificationLog[]>('scout_notification_logs', []);
  }

  static saveNotificationLogs(logs: NotificationLog[]): void {
    setLocalItem('scout_notification_logs', logs);
  }

  static getDriveUsedGB(): number {
    return getLocalItem<number>('scout_drive_used', INITIAL_DRIVE_USED_GB);
  }

  static saveDriveUsedGB(used: number): void {
    setLocalItem('scout_drive_used', Number(used.toFixed(3)));
  }

  // Trigger simulated Email & WhatsApp Notifications
  static triggerNotification(subject: string, body: string): void {
    const logs = this.getNotificationLogs();
    const newLogs: NotificationLog[] = [
      {
        id: `log-${Date.now()}-e`,
        timestamp: new Date().toISOString(),
        type: 'email',
        recipient: 'managementsystermscout@gmail.com',
        subject: `[Scout Portal Alert] ${subject}`,
        body,
      },
      {
        id: `log-${Date.now()}-w`,
        timestamp: new Date().toISOString(),
        type: 'whatsapp',
        recipient: '+94 51st Admin Group',
        subject: `⚠️ ALERT: ${subject}`,
        body,
      },
      ...logs,
    ];
    // Keep last 100 notifications
    this.saveNotificationLogs(newLogs.slice(0, 100));
  }

  // Check Drive space and add to drive
  static uploadFileSimulation(sizeMB: number): { success: boolean; message: string; isNearLimit: boolean } {
    const currentUsed = this.getDriveUsedGB();
    const addedGB = sizeMB / 1024;
    const nextUsed = currentUsed + addedGB;

    if (nextUsed >= GOOGLE_DRIVE_MAX_GB) {
      // Notify Admin
      this.triggerNotification(
        'Google Drive Full Emergency',
        `The scout storage Google Drive (managementsystermscout@gmail.com) is FULL (${nextUsed.toFixed(2)}GB of 15GB). Upload blocked! Please free up storage immediately.`
      );
      return { success: false, message: 'Google Drive is full! Upload blocked.', isNearLimit: true };
    }

    this.saveDriveUsedGB(nextUsed);

    const isNearLimit = nextUsed >= 14.5; // Warning at 14.5GB
    if (isNearLimit) {
      this.triggerNotification(
        'Google Drive Storage Warning',
        `Warning: Scout storage Google Drive (managementsystermscout@gmail.com) is almost full. Space utilized: ${nextUsed.toFixed(2)}GB of 15GB. Please download important documents and clear older archives.`
      );
    }

    return { success: true, message: 'File uploaded successfully to Google Drive.', isNearLimit };
  }

  // Pure old messages cleanup (1 month)
  static purgeOldChatMessages(): number {
    const messages = this.getChatMessages();
    const oneMonthAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const initialCount = messages.length;
    const remaining = messages.filter((m) => new Date(m.timestamp).getTime() > oneMonthAgo);
    this.saveChatMessages(remaining);
    return initialCount - remaining.length;
  }
}
