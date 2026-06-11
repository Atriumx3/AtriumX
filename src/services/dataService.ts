import { supabase } from './supabaseClient';
 
// ─── TYPES ────────────────────────────────────────────────────────────────────
 
export interface Profile {
  id: string;
  full_name: string;
  email: string;
  residence: string;
  avatar_initials: string;
  avatar_color: string;
  avg_rating: number;
  total_ratings: number;
  total_listings: number;
  joined_date: string;
  is_verified: boolean;
  is_admin: boolean;
  plan: 'ghost' | 'visible' | 'loud' | 'unmissable';
  plan_expires_at: string | null;
  created_at: string;
}
 
export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  custom_category: string | null;
  image_url: string | null;
  video_url: string | null;
  residence: string | null;
  status: 'pending' | 'active' | 'sold' | 'suspended' | 'expired';
  listing_type: 'single' | 'ongoing';
  report_count: number;
  contact_count: number;
  created_at: string;
  expires_at: string;
}
 
export interface Conversation {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  is_resolved: boolean;
  created_at: string;
  messages?: Message[];
}
 
export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  read: boolean;
  sent_at: string;
}
 
// ─── HELPERS ─────────────────────────────────────────────────────────────────
 
function getExpiryDate(plan: string): string {
  const now = new Date();
  const days = plan === 'ghost' ? 3 : plan === 'visible' ? 7 : plan === 'loud' ? 14 : 30;
  now.setDate(now.getDate() + days);
  return now.toISOString();
}
 
// ─── AUTH ─────────────────────────────────────────────────────────────────────
 
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: Profile | null; error: string | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const message = error.message.includes('Email not confirmed')
      ? 'Please confirm your email before signing in. Check your inbox for the confirmation link.'
      : error.message.includes('Invalid login credentials')
      ? 'Incorrect email or password. Please try again.'
      : error.message;
    return { user: null, error: message };
  }
  if (!data.user) return { user: null, error: 'Login failed. Please try again.' };
  const profile = await getUserById(data.user.id);
  return { user: profile, error: null };
}
 
export async function registerWithEmail(
  email: string,
  password: string,
  fullName: string,
  residence: string
): Promise<{ user: Profile | null; error: string | null; requiresConfirmation?: boolean }> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, residence },
    },
  });
  if (error) return { user: null, error: error.message };
  if (!data.user) return { user: null, error: 'Registration failed.' };

  if (!data.session) {
    return { user: null, error: null, requiresConfirmation: true };
  }

  // Give the trigger a moment then fetch the profile
  await new Promise(r => setTimeout(r, 800));
  let profile = await getUserById(data.user.id);

  // If trigger hasn't fired yet, insert manually
  if (!profile) {
    const initials =
      fullName
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2) || 'NU';
    const { error: insertError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      email,
      residence,
      avatar_initials: initials,
      avatar_color: '#1A5F7A',
      plan: 'ghost',
      is_verified: false,
      is_admin: false,
      avg_rating: 0,
      total_ratings: 0,
      total_listings: 0,
      joined_date: new Date().toISOString().split('T')[0],
    });
    if (insertError) return { user: null, error: `Profile creation failed: ${insertError.message}` };
    profile = await getUserById(data.user.id);
  }

  return { user: profile, error: null };
}
 
export async function logout(): Promise<{ error: string | null }> {
  const { error } = await supabase.auth.signOut();
  return { error: error ? error.message : null };
}
 
export async function getCurrentUser(): Promise<Profile | null> {
  const { data } = await supabase.auth.getUser();
  if (!data.user) return null;
  return getUserById(data.user.id);
}
 
// ─── USERS ────────────────────────────────────────────────────────────────────
 
export async function getUserById(id: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as Profile;
}
 
export async function getUserListings(userId: string): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('seller_id', userId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Listing[];
}
 
// ─── LISTINGS ─────────────────────────────────────────────────────────────────
 
export async function getListings(
  filters: { category?: string; search?: string } = {}
): Promise<Listing[]> {
  let query = supabase
    .from('listings')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
 
  if (filters.category && filters.category !== 'all') {
    query = query.eq('category', filters.category);
  }
  if (filters.search) {
    query = query.ilike('title', `%${filters.search}%`);
  }
 
  const { data, error } = await query;
  if (error || !data) return [];
  return data as Listing[];
}
 
export async function getListingById(id: string): Promise<Listing | null> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return data as Listing;
}
 
export async function createListing(listingData: {
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  customCategory?: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  residence: string;
  listingType: 'single' | 'ongoing';
  plan: string;
}): Promise<{ listing: Listing | null; error: string | null }> {
  const expiresAt = getExpiryDate(listingData.plan);
 
  const { data, error } = await supabase
    .from('listings')
    .insert({
      seller_id: listingData.sellerId,
      title: listingData.title,
      description: listingData.description,
      price: listingData.price,
      category: listingData.category,
      custom_category: listingData.customCategory || null,
      image_url: listingData.imageUrl || null,
      video_url: listingData.videoUrl || null,
      residence: listingData.residence,
      listing_type: listingData.listingType,
      status: 'pending',
      expires_at: expiresAt,
    })
    .select()
    .single();
 
  if (error || !data) return { listing: null, error: error?.message || 'Failed to create listing.' };
  return { listing: data as Listing, error: null };
}
 
export async function markListingAsSold(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('listings')
    .update({ status: 'sold' })
    .eq('id', id);
  return { error: error ? error.message : null };
}
 
export async function renewListing(id: string): Promise<{ error: string | null }> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const { error } = await supabase
    .from('listings')
    .update({ status: 'active', expires_at: expiresAt.toISOString() })
    .eq('id', id);
  return { error: error ? error.message : null };
}
 
export async function reportListing(
  listingId: string,
  reporterId: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('reports')
    .insert({ listing_id: listingId, reporter_id: reporterId });
  return { error: error ? error.message : null };
}
 
// ─── MESSAGES ─────────────────────────────────────────────────────────────────
 
export async function getConversationsForUser(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .or(`buyer_id.eq.${userId},seller_id.eq.${userId}`)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Conversation[];
}
 
export async function getConversationById(convId: string): Promise<Conversation | null> {
  const { data: conv, error: convError } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', convId)
    .single();
  if (convError || !conv) return null;
 
  const { data: messages } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', convId)
    .order('sent_at', { ascending: true });
 
  return { ...(conv as Conversation), messages: (messages as Message[]) || [] };
}
 
export async function sendMessage(
  convId: string,
  senderId: string,
  content: string
): Promise<{ message: Message | null; error: string | null }> {
  const { data, error } = await supabase
    .from('messages')
    .insert({ conversation_id: convId, sender_id: senderId, content })
    .select()
    .single();
  if (error || !data) return { message: null, error: error?.message || 'Failed to send.' };
  return { message: data as Message, error: null };
}
 
export async function startConversation(
  listingId: string,
  buyerId: string,
  sellerId: string
): Promise<{ conversationId: string | null; error: string | null }> {
  // Check if conversation already exists
  const { data: existing } = await supabase
    .from('conversations')
    .select('id')
    .eq('listing_id', listingId)
    .eq('buyer_id', buyerId)
    .single();
 
  if (existing) return { conversationId: existing.id, error: null };
 
  const { data, error } = await supabase
    .from('conversations')
    .insert({ listing_id: listingId, buyer_id: buyerId, seller_id: sellerId })
    .select()
    .single();
 
  if (error || !data) return { conversationId: null, error: error?.message || 'Failed to start conversation.' };
  return { conversationId: data.id, error: null };
}
 
export async function markConversationResolved(convId: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('conversations')
    .update({ is_resolved: true })
    .eq('id', convId);
  return { error: error ? error.message : null };
}
 
// ─── RATINGS ──────────────────────────────────────────────────────────────────
 
export async function submitRating(
  sellerId: string,
  buyerId: string,
  listingId: string,
  stars: number,
  comment?: string
): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('ratings')
    .insert({ seller_id: sellerId, buyer_id: buyerId, listing_id: listingId, stars, comment });
  return { error: error ? error.message : null };
}
 
// ─── ADMIN ────────────────────────────────────────────────────────────────────
 
export async function getPendingListings(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .eq('status', 'pending')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Listing[];
}
 
export async function approveListingById(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('listings')
    .update({ status: 'active' })
    .eq('id', id);
  return { error: error ? error.message : null };
}
 
export async function rejectListingById(id: string): Promise<{ error: string | null }> {
  const { error } = await supabase
    .from('listings')
    .update({ status: 'suspended' })
    .eq('id', id);
  return { error: error ? error.message : null };
}
 
export async function getAllListingsAdmin(): Promise<Listing[]> {
  const { data, error } = await supabase
    .from('listings')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data as Listing[];
}
 
// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
 
export async function getUnreadNotifications(userId: string) {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .eq('read', false)
    .order('created_at', { ascending: false })
    .limit(5);
  if (error || !data) return [];
  return data;
}
 
export async function markNotificationRead(id: string): Promise<void> {
  await supabase.from('notifications').update({ read: true }).eq('id', id);
}
 
export async function createNotification(payload: {
  userId: string;
  message: string;
  type: string;
  listingId?: string;
  conversationId?: string;
}): Promise<void> {
  await supabase.from('notifications').insert({
    user_id: payload.userId,
    message: payload.message,
    type: payload.type,
    listing_id: payload.listingId || null,
    conversation_id: payload.conversationId || null,
  });
}
 
// ─── BUSINESS ─────────────────────────────────────────────────────────────────
 
export async function submitBusinessApplication(data: {
  businessName: string;
  businessType: string;
  customBusinessType?: string;
  contactPerson: string;
  email: string;
  phone: string;
  selectedPackage: string;
  description: string;
}): Promise<{ error: string | null }> {
  const { error } = await supabase.from('business_profiles').insert({
    business_name: data.businessName,
    business_type: data.businessType,
    custom_business_type: data.customBusinessType || null,
    contact_person: data.contactPerson,
    email: data.email,
    phone: data.phone,
    selected_package: data.selectedPackage,
    description: data.description,
    status: 'pending',
  });
  return { error: error ? error.message : null };
}
