import { createClient } from '@supabase/supabase-js';

export const supabaseConfig = {
  url: import.meta.env.VITE_SUPABASE_URL || 'https://dcfmjmsmobatabophxun.supabase.co',
  anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRjZm1qbXNtb2JhdGFib3BoeHVuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU5NTYwMjEsImV4cCI6MjA5MTUzMjAyMX0.THNXtEq50eJ4U9iL2ArlKxlxmGcyxD-Fv1PiMahekEU',
  mediaBucketId: 'media',
  servicesBucketId: 'services-images',
  portfolioBucketId: 'portfolio-images',
};

export const supabase = createClient(supabaseConfig.url, supabaseConfig.anonKey);

// Compatibility polyfill for Appwrite's ID.unique()
export const ID = {
  unique: () => crypto.randomUUID()
};

// --- Interfaces ---
export interface PortfolioItem {
  id: string; // Changed from $id
  $id?: string;
  title: string;
  image_url: string;
  category: string;
  description: string;
  created_at: string;
}

export interface Testimonial {
  id: string; // Changed from $id
  $id?: string;
  name: string;
  message: string;
  rating: number;
}

export interface GalleryItem {
  id: string; // Changed from $id
  $id?: string;
  title: string;
  image_url: string;
  category: 'wedding' | 'event' | 'destination';
  description: string;
  created_at: string;
}

export interface TeamMember {
  id: string; // Changed from $id
  $id?: string;
  name: string;
  role: string;
  image_url: string;
  bio: string;
  social_links: any; // JSONb
  created_at: string;
}

// --- Content Document Helpers (Replaces databases.getDocument) ---
export async function getContentDocument(id: string) {
  const { data, error } = await supabase.from('website_content').select('*').eq('id', id).single();
  if (error) throw error;
  // To match appwrite return format (spreading jsonb 'data' into top level along with id)
  return { id: data.id, ...data.data };
}

export async function createContentDocument(id: string, payload: any) {
  const { data, error } = await supabase.from('website_content').insert([{ id, data: payload }]).select().single();
  if (error) throw error;
  return data;
}

export async function updateContentDocument(id: string, payload: any) {
  const { data, error } = await supabase.from('website_content').update({ data: payload }).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

// --- Portfolio Helpers ---
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  const { data, error } = await supabase.from('portfolio').select('*').order('created_at', { ascending: false }).limit(50);
  if (error) { console.error('Failed to fetch portfolio:', error); return []; }
  return data.map(item => ({ ...item, $id: item.id })) as unknown as PortfolioItem[]; // $id for backward comp
}

export async function addPortfolioItem(item: Omit<PortfolioItem, 'id' | '$id' | 'created_at'>) {
  const { data, error } = await supabase.from('portfolio').insert([item]).select().single();
  if (error) throw error;
  return data;
}

export async function updatePortfolioItem(id: string, item: Partial<Omit<PortfolioItem, 'id' | '$id' | 'created_at'>>) {
  const { data, error } = await supabase.from('portfolio').update(item).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deletePortfolioItem(id: string) {
  const { error } = await supabase.from('portfolio').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Gallery Helpers ---
export async function getGalleryItems(): Promise<GalleryItem[]> {
  const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false }).limit(100);
  if (error) return [];
  return data.map(item => ({ ...item, $id: item.id })) as unknown as GalleryItem[];
}

export async function addGalleryItem(item: Omit<GalleryItem, 'id' | '$id' | 'created_at'>) {
  const { data, error } = await supabase.from('gallery').insert([item]).select().single();
  if (error) throw error;
  return data;
}

export async function deleteGalleryItem(id: string) {
  const { error } = await supabase.from('gallery').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Team Helpers ---
export async function getTeamMembers(): Promise<TeamMember[]> {
  const { data, error } = await supabase.from('team').select('*').order('name', { ascending: true }).limit(50);
  if (error) return [];
  return data.map(item => ({ ...item, $id: item.id })) as unknown as TeamMember[];
}

export async function addTeamMember(member: Omit<TeamMember, 'id' | '$id' | 'created_at'>) {
  const { data, error } = await supabase.from('team').insert([member]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTeamMember(id: string, member: Partial<TeamMember>) {
  const { data, error } = await supabase.from('team').update(member).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTeamMember(id: string) {
  const { error } = await supabase.from('team').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Testimonial Helpers ---
export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase.from('testimonials').select('*').limit(20);
  if (error) return [];
  return data.map(item => ({ ...item, $id: item.id })) as unknown as Testimonial[];
}

export async function addTestimonial(testimonial: Omit<Testimonial, 'id' | '$id'>) {
  const { data, error } = await supabase.from('testimonials').insert([testimonial]).select().single();
  if (error) throw error;
  return data;
}

export async function updateTestimonial(id: string, item: Partial<Omit<Testimonial, 'id' | '$id'>>) {
  const { data, error } = await supabase.from('testimonials').update(item).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteTestimonial(id: string) {
  const { error } = await supabase.from('testimonials').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- Storage Helpers ---
export async function uploadMedia(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${ID.unique()}.${fileExt}`;
  
  const { error } = await supabase.storage.from(supabaseConfig.mediaBucketId).upload(fileName, file);
  if (error) throw error;
  
  const { data } = supabase.storage.from(supabaseConfig.mediaBucketId).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadServiceImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${ID.unique()}.${fileExt}`;
  const contentType = file.type || (fileExt === 'png' ? 'image/png' : 'image/jpeg');
  
  const { error } = await supabase.storage.from(supabaseConfig.servicesBucketId).upload(fileName, file, { contentType });
  if (error) throw error;
  
  const { data } = supabase.storage.from(supabaseConfig.servicesBucketId).getPublicUrl(fileName);
  return data.publicUrl;
}

export async function uploadPortfolioImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${ID.unique()}.${fileExt}`;
  const contentType = file.type || (fileExt === 'png' ? 'image/png' : 'image/jpeg');
  
  const { error } = await supabase.storage.from(supabaseConfig.portfolioBucketId).upload(fileName, file, { contentType });
  if (error) throw error;
  
  const { data } = supabase.storage.from(supabaseConfig.portfolioBucketId).getPublicUrl(fileName);
  return data.publicUrl;
}

// --- ServiceItem Interface ---
export interface ServiceItem {
  id: string;
  $id?: string;
  title: string;
  description: string;
  image_url: string;
  icon: string; // icon name key e.g. 'Heart'
  sort_order: number;
  created_at: string;
}

// --- Services CRUD ---
export async function getServices(): Promise<ServiceItem[]> {
  const { data, error } = await supabase.from('services').select('*').order('sort_order', { ascending: true });
  if (error) { console.error('Failed to fetch services:', error); return []; }
  return data.map(item => ({ ...item, $id: item.id })) as unknown as ServiceItem[];
}

export async function addService(item: Omit<ServiceItem, 'id' | '$id' | 'created_at'>) {
  const { data, error } = await supabase.from('services').insert([item]).select().single();
  if (error) throw error;
  return data;
}

export async function updateService(id: string, item: Partial<Omit<ServiceItem, 'id' | '$id' | 'created_at'>>) {
  const { data, error } = await supabase.from('services').update(item).eq('id', id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteService(id: string) {
  const { error } = await supabase.from('services').delete().eq('id', id);
  if (error) throw error;
  return true;
}

// --- System Status ---
export async function checkSystemStatus() {
  const status = { database: false, portfolio: false, testimonials: false, content: false, gallery: false, team: false };
  try {
    const { error } = await supabase.from('website_content').select('id').limit(1);
    if (!error) {
      status.database = true;
      status.content = true;
    }
  } catch (error) {
    status.database = false;
  }
  return status;
}
