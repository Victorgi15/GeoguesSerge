
var supabaseUrl = 'https://rglwwchomsjdplbpbvmu.supabase.co'
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJnbHd3Y2hvbXNqZHBsYnBidm11Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTkwNTk3NzUsImV4cCI6MjAzNDYzNTc3NX0.nqWlhycZYDT-8KKjECYdJXx4Ezt4Mtc5nfOSFGHpqUw'
var db_client = supabase.createClient(supabaseUrl, supabaseKey)
var game_container = document.getElementById('game')
var auth_container = document.getElementById('auth')
