/**
 * Test Supabase Connection
 * Run this in browser console to diagnose connection issues
 */

export async function testSupabaseConnection() {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

  console.log('=== Supabase Connection Test ===');
  console.log('URL:', url);
  console.log('Key present:', !!key);
  console.log('Key length:', key?.length || 0);
  console.log('Key prefix:', key?.substring(0, 30) || 'none');

  if (!url || !key) {
    console.error('❌ Missing environment variables!');
    return false;
  }

  // Test 1: Check if URL is reachable
  try {
    console.log('\n1. Testing URL reachability...');
    const response = await fetch(`${url}/rest/v1/`, {
      method: 'GET',
      headers: {
        'apikey': key,
        'Authorization': `Bearer ${key}`
      }
    });
    console.log('✅ URL is reachable. Status:', response.status);
  } catch (error: any) {
    console.error('❌ Cannot reach Supabase URL:', error.message);
    return false;
  }

  // Test 2: Test authentication endpoint
  try {
    console.log('\n2. Testing authentication endpoint...');
    const authResponse = await fetch(`${url}/auth/v1/health`, {
      method: 'GET'
    });
    console.log('✅ Auth endpoint reachable. Status:', authResponse.status);
  } catch (error: any) {
    console.error('❌ Auth endpoint error:', error.message);
  }

  // Test 3: Test with Supabase client
  try {
    console.log('\n3. Testing Supabase client...');
    const { createClient } = await import('@supabase/supabase-js');
    const testClient = createClient(url, key);
    const { data, error } = await testClient.auth.getSession();
    if (error) {
      console.log('⚠️ Session check (expected if not logged in):', error.message);
    } else {
      console.log('✅ Supabase client working');
    }
  } catch (error: any) {
    console.error('❌ Supabase client error:', error.message);
    return false;
  }

  console.log('\n=== Test Complete ===');
  return true;
}

// Make it available globally for browser console
if (typeof window !== 'undefined') {
  (window as any).testSupabase = testSupabaseConnection;
}
