import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env.local file.');
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey, {
  auth: {
    autoRefreshToken: false, // Disable auto-refresh to prevent auto-relogin
    persistSession: false,   // Don't persist session to prevent auto-relogin
    detectSessionInUrl: false // Disable URL session detection
  }
});

// Type-safe database interface
export type Database = {
  public: {
    Tables: {
      claims: {
        Row: {
          id: string;
          user_id: string;
          claim_type: 'IFR' | 'CFRR' | 'CR';
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
          // Add other fields as needed
        };
        Insert: {
          user_id: string;
          claim_type: 'IFR' | 'CFRR' | 'CR';
          status?: 'pending' | 'approved' | 'rejected';
        };
        Update: {
          status?: 'pending' | 'approved' | 'rejected';
        };
      };
      documents: {
        Row: {
          id: string;
          claim_id: string;
          file_url: string;
          document_type: string;
          created_at: string;
        };
        Insert: {
          claim_id: string;
          file_url: string;
          document_type: string;
        };
        Update: {
          file_url?: string;
          document_type?: string;
        };
      };
    };
  };
};