'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function login(data: { email: string, password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    return { error: "Invalid credentials" }
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (profileError) {
    return { error: "Error loggin in" }
  }

  revalidatePath(`/${userProfile.role}`, 'layout')
  redirect(`/${userProfile.role}`)
}

export async function signup(data: { email: string, password: string }) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signUp(data)

  if (error) {
    return { error: 'Error creating account' }
  }

  revalidatePath('/email/message', 'layout')
  redirect('/email/message')
}
