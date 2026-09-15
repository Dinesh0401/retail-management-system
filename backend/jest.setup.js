// jest.setup.js
// Set dummy environment variables for Supabase so tests don't require real credentials
process.env.SUPABASE_URL = 'https://test-supabase.co';
process.env.SUPABASE_ANON_KEY = 'test-anon-key';
