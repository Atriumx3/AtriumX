export interface MockUser {
  id: string;
  fullName: string;
  email: string;
  campus: string;
  residence: string;
  avatarInitials: string;
  avatarColor: string;
  avgRating: number;
  totalRatings: number;
  totalListings: number;
  joinedDate: string;
  isVerified: boolean;
  isAdmin: boolean;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    fullName: 'Amahle Dlamini',
    email: 'amahle.dlamini@wits.ac.za',
    campus: 'Wits University',
    residence: 'Dalrymple House',
    avatarInitials: 'AD',
    avatarColor: '#1A5F7A',
    avgRating: 4.8,
    totalRatings: 14,
    totalListings: 6,
    joinedDate: '2024-02-10',
    isVerified: true,
    isAdmin: false,
  },
  {
    id: 'u2',
    fullName: 'Thabo Mokoena',
    email: 'thabo.mokoena@wits.ac.za',
    campus: 'Wits University',
    residence: 'Jubilee Hall',
    avatarInitials: 'TM',
    avatarColor: '#2A7A9A',
    avgRating: 4.2,
    totalRatings: 8,
    totalListings: 3,
    joinedDate: '2024-03-15',
    isVerified: true,
    isAdmin: false,
  },
  {
    id: 'u3',
    fullName: 'Naledi Phiri',
    email: 'naledi.phiri@wits.ac.za',
    campus: 'Wits University',
    residence: 'International House',
    avatarInitials: 'NP',
    avatarColor: '#D97706',
    avgRating: 2.1,
    totalRatings: 3,
    totalListings: 2,
    joinedDate: '2024-05-20',
    isVerified: true,
    isAdmin: false,
  },
  {
    id: 'u4',
    fullName: 'Lerato Khumalo',
    email: 'lerato.khumalo@wits.ac.za',
    campus: 'Wits University',
    residence: 'Knockando Hall',
    avatarInitials: 'LK',
    avatarColor: '#F97316',
    avgRating: 4.5,
    totalRatings: 11,
    totalListings: 4,
    joinedDate: '2024-01-08',
    isVerified: true,
    isAdmin: false,
  },
  {
    id: 'u5',
    fullName: 'Sipho Ndlovu',
    email: 'sipho.ndlovu@wits.ac.za',
    campus: 'Wits University',
    residence: 'Alan Paton Hall',
    avatarInitials: 'SN',
    avatarColor: '#22C55E',
    avgRating: 4.0,
    totalRatings: 6,
    totalListings: 5,
    joinedDate: '2024-04-12',
    isVerified: true,
    isAdmin: true,
  },
  {
    id: 'u6',
    fullName: 'Zanele Mthembu',
    email: 'zanele.mthembu@wits.ac.za',
    campus: 'Wits University',
    residence: 'Dalrymple House',
    avatarInitials: 'ZM',
    avatarColor: '#FBBF24',
    avgRating: 3.9,
    totalRatings: 9,
    totalListings: 3,
    joinedDate: '2024-06-01',
    isVerified: false,
    isAdmin: false,
  },
];
