import { MOCK_LISTINGS, type MockListing } from './mock/mockListings';
import { MOCK_USERS, type MockUser } from './mock/mockUsers';
import { MOCK_CONVERSATIONS, type MockConversation, type MockMessage } from './mock/mockMessages';

let listings = [...MOCK_LISTINGS];
let conversations = [...MOCK_CONVERSATIONS].map(c => ({
  ...c,
  messages: [...c.messages],
}));

// --- LISTINGS ---
export async function getListings(filters: { category?: string; search?: string } = {}): Promise<MockListing[]> {
  let result = listings.map(l => ({ ...l }));

  if (filters.category && filters.category !== 'all') {
    result = result.filter(l => l.category === filters.category);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter(
      l => l.title.toLowerCase().includes(q) || l.description.toLowerCase().includes(q)
    );
  }

  return result;
}

export async function getListingById(id: string): Promise<MockListing | undefined> {
  const listing = listings.find(l => l.id === id);
  return listing ? { ...listing } : undefined;
}

export async function createListing(listingData: Omit<MockListing, 'id' | 'status' | 'reportCount' | 'createdAt' | 'expiresAt' | 'contactCount'>): Promise<MockListing> {
  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const newListing: MockListing = {
    ...listingData,
    id: `l${Date.now()}`,
    status: 'active',
    reportCount: 0,
    createdAt: now.toISOString(),
    expiresAt: expires.toISOString(),
    contactCount: 0,
  };
  listings = [newListing, ...listings];
  return { ...newListing };
}

export async function markListingAsSold(id: string): Promise<MockListing | undefined> {
  listings = listings.map(l => l.id === id ? { ...l, status: 'sold' as const } : l);
  const listing = listings.find(l => l.id === id);
  return listing ? { ...listing } : undefined;
}

export async function renewListing(id: string): Promise<MockListing | undefined> {
  const now = new Date();
  const expires = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  listings = listings.map(l => l.id === id ? { ...l, expiresAt: expires.toISOString(), status: 'active' as const } : l);
  const listing = listings.find(l => l.id === id);
  return listing ? { ...listing } : undefined;
}

export async function reportListing(id: string): Promise<MockListing | undefined> {
  listings = listings.map(l => {
    if (l.id !== id) return l;
    const newCount = l.reportCount + 1;
    return { ...l, reportCount: newCount, status: newCount >= 2 ? 'suspended' as const : l.status };
  });
  const listing = listings.find(l => l.id === id);
  return listing ? { ...listing } : undefined;
}

// --- USERS ---
export async function getUserById(id: string): Promise<MockUser | undefined> {
  const user = MOCK_USERS.find(u => u.id === id);
  return user ? { ...user } : undefined;
}

export async function getUserListings(userId: string): Promise<MockListing[]> {
  return listings.filter(l => l.sellerId === userId).map(l => ({ ...l }));
}

export async function getCurrentUser(): Promise<MockUser> {
  return { ...MOCK_USERS[0] };
}

// --- MESSAGES ---
export async function getConversationsForUser(userId: string): Promise<MockConversation[]> {
  return conversations
    .filter(c => c.buyerId === userId || c.sellerId === userId)
    .map(c => ({ ...c, messages: c.messages.map(m => ({ ...m })) }));
}

export async function getConversationById(convId: string): Promise<MockConversation | undefined> {
  const conv = conversations.find(c => c.id === convId);
  return conv ? { ...conv, messages: conv.messages.map(m => ({ ...m })) } : undefined;
}

export async function sendMessage(convId: string, senderId: string, content: string): Promise<MockMessage> {
  const msg: MockMessage = {
    id: `m${Date.now()}`,
    senderId,
    content,
    sentAt: new Date().toISOString(),
    read: false,
  };

  conversations = conversations.map(c =>
    c.id === convId ? { ...c, messages: [...c.messages, { ...msg }] } : c
  );

  return { ...msg };
}

export async function startConversation(listingId: string, buyerId: string): Promise<MockConversation> {
  const listing = listings.find(l => l.id === listingId);
  if (!listing) throw new Error('Listing not found');

  const existing = conversations.find(
    c => c.listingId === listingId && c.buyerId === buyerId
  );
  if (existing) return { ...existing, messages: existing.messages.map(m => ({ ...m })) };

  const newConv: MockConversation = {
    id: `conv${Date.now()}`,
    listingId,
    buyerId,
    sellerId: listing.sellerId,
    isResolved: false,
    messages: [],
  };

  conversations = [newConv, ...conversations];
  return { ...newConv, messages: [] };
}

export async function markConversationResolved(convId: string): Promise<MockConversation | undefined> {
  conversations = conversations.map(c =>
    c.id === convId ? { ...c, isResolved: true } : c
  );
  const conv = conversations.find(c => c.id === convId);
  return conv ? { ...conv, messages: conv.messages.map(m => ({ ...m })) } : undefined;
}

// --- AUTH (stubbed for Phase 1) ---
export async function loginWithEmail(_email: string, _password: string): Promise<{ user: MockUser | null; error: string | null }> {
  return { user: { ...MOCK_USERS[0] }, error: null };
}

export async function registerWithEmail(_email: string, _password: string, _fullName: string): Promise<{ user: MockUser | null; error: string | null }> {
  return { user: { ...MOCK_USERS[0] }, error: null };
}

export async function logout(): Promise<{ error: string | null }> {
  return { error: null };
}

// --- RATINGS ---
export async function submitRating(sellerId: string, stars: number, listingId: string, raterId: string): Promise<{ success: boolean }> {
  const idx = MOCK_USERS.findIndex(u => u.id === sellerId);
  if (idx === -1) return { success: false };
  const seller = MOCK_USERS[idx];
  const newAvg = ((seller.avgRating * seller.totalRatings) + stars) / (seller.totalRatings + 1);
  MOCK_USERS[idx] = {
    ...seller,
    avgRating: Math.round(newAvg * 10) / 10,
    totalRatings: seller.totalRatings + 1,
  };
  return { success: true };
}
