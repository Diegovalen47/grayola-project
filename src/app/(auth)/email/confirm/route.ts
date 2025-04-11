import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const token_hash = searchParams.get('token_hash')
  const type = searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const supabase = await createClient()

    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    })

    
    if (!error) {
      const { data, error: getUserError } = await supabase.auth.getUser()

      if (getUserError) {
        redirect('/error')
      }

      const { data: userProfile, error: profileError } = await supabase
        .from('profile')
        .select('*')
        .eq('id', data.user.id)
  
      if (profileError) {
        redirect('/error')
      }
      redirect(`/${userProfile[0].role}`)
    }
  }

  // redirect the user to an error page with some instructions
  redirect('/error')
}