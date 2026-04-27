// Supabase Client Configuration
// Successfully initialized with project credentials

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/database'

const supabaseUrl = "https://zpvezqlndvxuwviricio.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpwdmV6cWxuZHZ4dXd2aXJpY2lvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUzODQ1OTksImV4cCI6MjA5MDk2MDU5OX0.RKPmZ2GPacTqvG8pMREFVcnepMjlVcZITcfTIQwlr18"

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
