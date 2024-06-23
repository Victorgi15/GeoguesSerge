const supabaseUrl = 'https://rglwwchomsjdplbpbvmu.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbHd3Y2hvbXNqZHBsYnBidm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNTk3NzUsImV4cCI6MjAzNDYzNTc3NX0.nqWlhycZYDT-8KKjECYdJXx4Ezt4Mtc5nfOSFGHpqUw'
const db_client = supabase.createClient(supabaseUrl, supabaseKey)
const game_container = document.getElementById('game')
const auth_container = document.getElementById('auth')
const map_container = document.getElementById('map')