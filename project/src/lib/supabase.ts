import { createClient } from '@supabase/supabase-js'

// Provide fallback values for development when Supabase is not configured
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder_anon_key'

// Only create the client if we have real values (not placeholders)
const isSupabaseConfigured = supabaseUrl !== 'https://placeholder.supabase.co' && supabaseAnonKey !== 'placeholder_anon_key'

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Helper function to check if Supabase is available
export const isSupabaseAvailable = () => isSupabaseConfigured

export type Profile = {
  id: string
  email: string
  full_name?: string
  avatar_url?: string
  role: 'user' | 'admin'
  created_at: string
}

export type Order = {
  id: string
  user_id: string
  printify_order_id?: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
  total: number
  items: any[]
  shipping_address: any
  payment_info?: any
  created_at: string
  updated_at: string
}
