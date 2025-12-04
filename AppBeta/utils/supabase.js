// lib/supabase.js   (or src/lib/supabase.js)
import { createClient } from '@supabase/supabase-js'

// Replace these two lines with YOUR real values from Supabase dashboard
const supabaseUrl = 'https://trgeyzgpjfdznuyriumu.supabase.co'         // ← your project URL
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRyZ2V5emdwamZkem51eXJpdW11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ4NDA5MTIsImV4cCI6MjA4MDQxNjkxMn0.yTE1aNxw1mPEIDCwMlXIlW3toHLYR2dMuC27XQ6glTQ'  // ← your anon public key

// This is the only thing your MapScreen uses
export const supabase = createClient(supabaseUrl, supabaseAnonKey)