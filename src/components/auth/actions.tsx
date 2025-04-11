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

  const { data: user, error: userError } = await supabase.auth.getUser()

  if (userError) {
    return { error: "Error fetching user" }
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', user.user.id)

  if (profileError) {
    return { error: "Error loggin in" }
  }

  console.log('userProfile', userProfile)

  revalidatePath(`/${userProfile![0].role}`, 'layout')
  redirect(`/${userProfile![0].role}`)
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
