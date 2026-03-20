import { createClient } from '@supabase/supabase-js';

// Reemplaza estas dos variables con los valores exactos que te dio Supabase en Project Settings > API
const supabaseUrl = 'https://rwjcmamxmhdjyvbefank.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ3amNtYW14bWhkanl2YmVmYW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NzE5MTEsImV4cCI6MjA4OTM0NzkxMX0.Hr8dxw5nGwcL3qZYmeHUCPSgWmo9wi55S9zq4E4Uwyw';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);