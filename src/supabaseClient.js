// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qwqmgcmjiakblvajgvwz.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3cW1nY21qaWFrYmx2YWpndnd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mjk5Mzg0NjcsImV4cCI6MjA0NTUxNDQ2N30._5oUIMi0mc2yglgZZpzrLQdm-3L7H5iyIgJVKT_xiZQ'; // Replace with your Supabase anon key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
