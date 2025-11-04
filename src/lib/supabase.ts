
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://lswyxckumfvkruxsqvau.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imxzd3l4Y2t1bWZ2a3J1eHNxdmF1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MjA3ODksImV4cCI6MjA2NTM5Njc4OX0.QaZdrKqZ3D92nWulx37kRJM3XPhEnktLz2JmKT9c3P8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
