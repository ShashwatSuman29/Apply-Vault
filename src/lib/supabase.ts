import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xnfuykkmujyvqdwmsmbv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhuZnV5a2ttdWp5dnFkd21zbWJ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDI3MTIzNDMsImV4cCI6MjA1ODI4ODM0M30.WWzFqJHXFhMY9ABSb8QT3u-YHk94vjHSoN1iUdGK94s'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 