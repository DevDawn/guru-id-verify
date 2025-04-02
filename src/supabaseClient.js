import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://eobywtedvuefduyulhrh.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVvYnl3dGVkdnVlZmR1eXVsaHJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM1Mzg0MjIsImV4cCI6MjA1OTExNDQyMn0.XiVz48bIY_oNKUXtK5pVqsTtwAtK8cs19rtj7aFc7Cw';

export const supabase = createClient(supabaseUrl, supabaseKey);