import { LoginForm } from '@/components/auth/login-form'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function LoginPage() {

  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (data?.user) {
    redirect('/home')
  }

  return (
    <LoginForm />
  )
}