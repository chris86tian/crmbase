import { createClient } from '@supabase/supabase-js';

// Ensure you have NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

if (!supabaseUrl) {
  console.warn('Supabase URL is not defined. Please check your NEXT_PUBLIC_SUPABASE_URL environment variable.');
}
if (!supabaseAnonKey) {
  console.warn('Supabase Anon Key is not defined. Please check your NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Contact = {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  status: 'Lead' | 'Qualifiziert' | 'Kunde' | 'Inaktiv';
  source: string | null;
  notes: string | null;
  created_at: string;
  user_id: string;
};

export type Interaction = {
  id: string;
  contact_id: string;
  type: 'Call' | 'Mail' | 'Meeting' | 'Follow-Up';
  outcome: string | null;
  date: string;
  notes: string | null;
  created_at: string;
  user_id: string;
};

export type Webhook = {
  id: string;
  name: string;
  url: string;
  event_type: string;
  is_active: boolean;
  created_at: string;
  user_id: string;
};
