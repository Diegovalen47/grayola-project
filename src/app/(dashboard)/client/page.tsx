import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function ClientPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (profileError) {
    redirect('/error')
  }

  if (userProfile.role !== 'client') {
    redirect('/home')
  }

  return <p>Hello {data.user.email}</p>
}