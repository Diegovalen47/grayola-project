import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { NewProjectBtn } from '@/components/dashboard/client/new-project-btn'
import { ProjectsList } from '@/components/dashboard/client/projects-list'

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

  return (
    <div className="flex flex-col items-center justify-center mt-16">
      <div className="flex items-center justify-between w-full">
        <h2 className="text-2xl font-bold">Projects</h2>
        <NewProjectBtn text="New Project" />
      </div>
      {/* <ProjectsList user={data.user} /> */}
    </div>
  )
}