import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface User {
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  phone?: string;
  wallet_address?: string;
  user_type: 'individual' | 'hospital';
  verified: boolean;
  id_proof_url?: string;
  family_members?: any[];
  healthcoin_balance: number;
  created_at: string;
}

export interface Hospital {
  id: string;
  firebase_uid: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  wallet_address?: string;
  verified: boolean;
  created_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  hospital_id: string;
  amount: number;
  healthcoin_amount: number;
  status: 'pending' | 'confirmed' | 'audited' | 'negotiable' | 'failed';
  tx_hash?: string;
  bill_url?: string;
  audited_amount?: number;
  negotiable_amount?: number;
  created_at: string;
  updated_at: string;
}
