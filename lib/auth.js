import { supabase } from './supabase';

export async function signUp(email, password) {
  return supabase.auth.signUp({
    email,
    password,
  });
}

export async function signIn(email, password) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signOutUser() {
  return supabase.auth.signOut();
}

export async function getCurrentUser() {
  const { data, error } = await supabase.auth.getUser();
  return { user: data.user, error };
}

export async function getSession() {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
}

export async function getMyProfile() {
  const { data: authData, error: authError } = await supabase.auth.getUser();

  if (authError || !authData.user) {
    return { profile: null, error: authError || null };
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', authData.user.id)
    .single();

  return { profile: data, error };
}