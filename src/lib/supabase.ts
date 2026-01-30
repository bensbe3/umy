import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export for testing
export const supabaseConfig = {
  url: supabaseUrl,
  key: supabaseAnonKey
};

// Debug logging
if (import.meta.env.DEV) {
  console.log('Supabase Config:', {
    url: supabaseUrl ? '✓ Set' : '✗ Missing',
    key: supabaseAnonKey ? '✓ Set' : '✗ Missing',
    keyLength: supabaseAnonKey?.length || 0,
    keyPrefix: supabaseAnonKey?.substring(0, 20) || 'none'
  });
}

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables!');
  console.error('URL:', supabaseUrl);
  console.error('Key:', supabaseAnonKey ? 'Present' : 'Missing');
  console.warn('Some features may not work. Please check .env.local file.');
}

// Validate API key format
const isValidAnonKey = (key: string) => {
  // Supabase anon keys are JWT tokens that start with 'eyJ'
  // or sometimes other formats, but typically JWT
  return key && key.length > 20;
};

export const supabase = supabaseUrl && supabaseAnonKey && isValidAnonKey(supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;

if (supabaseUrl && supabaseAnonKey && !isValidAnonKey(supabaseAnonKey)) {
  console.warn('⚠️ API key format might be incorrect. Supabase anon keys typically start with "eyJ" (JWT format).');
  console.warn('Please check Supabase Dashboard → Settings → API → "anon public" key');
  console.warn('Current key starts with:', supabaseAnonKey.substring(0, 20));
}

// Database types
export interface ContactSubmission {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  interest?: string;
  organization?: string;
  linkedin?: string;
  status: 'new' | 'read' | 'replied' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  cover_image_url?: string;
  featured_image_url?: string;
  author_id: string;
  author_name?: string;
  author_bio?: string;
  editor_name?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  read_time_minutes?: number;
  views_count?: number;
  is_featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Actualite {
  id: string;
  commission_id: 'ir' | 'mp' | 'sd';
  title: string;
  content: string;
  image_url?: string;
  author_id: string;
  author_name?: string;
  category?: string;
  meta_title?: string;
  meta_description?: string;
  read_time_minutes?: number;
  views_count?: number;
  is_featured?: boolean;
  status: 'draft' | 'published' | 'archived';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface AppUser {
  id: string;
  username?: string;
  role: 'editor' | 'super_admin';
  commissions_role?: 'ir' | 'mp' | 'sd' | 'full';
}

export interface User {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
}

export interface EditorialTeamMember {
  id: string;
  user_id?: string;
  full_name: string;
  role: string;
  bio?: string;
  profile_image_url?: string;
  email?: string;
  linkedin_url?: string;
  twitter_url?: string;
  display_order: number;
  is_active: boolean;
  joined_date: string;
  created_at: string;
}

export interface ArticleCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  color?: string;
  icon?: string;
  display_order: number;
  created_at: string;
}
