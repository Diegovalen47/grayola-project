'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export async function signup(data: { email: string, password: string }) {
  const supabase = await createClient()

  const { error, data: signUpData } = await supabase.auth.signUp(data)

  console.log('signUpData', signUpData)
  console.log('error signup', error)

  if (error) {
    return { error: 'Error creating account' }
  }

  revalidatePath('/email/message', 'layout')
  redirect('/email/message')
}