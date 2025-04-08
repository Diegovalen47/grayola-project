import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function ManagerPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()
  console.log(data)
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

  if (userProfile.role !== 'manager') {
    redirect('/home')
  }

  return <p>Hello {data.user.email}</p>
}