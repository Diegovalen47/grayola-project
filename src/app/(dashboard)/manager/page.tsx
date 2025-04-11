import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'
import { ProjectsList } from '@/components/dashboard/client/projects-list'

export default async function ManagerPage() {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .eq('id', data.user.id)

    
  if (profileError) {
    console.error('Error fetching user profile', profileError)
    redirect('/error')
  }

  console.log('userProfile', userProfile)
  const profile = userProfile![0].role
  console.log('profile', profile)

  if (profile !== 'manager') {
    console.log('redirecting to home')
    redirect('/home')
  }

  const { data: projects, error: projectsError } = await supabase
    .from('project')
    .select('*')

  console.log('projects', projects)

  if (projectsError) {
    <ProjectsWrapper userProfile={profile}>
      <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
        <p className="text-muted-foreground">Error fetching projects</p>
      </div>
    </ProjectsWrapper>
  }

  if (!projects || projects.length === 0) {
    return (
      <ProjectsWrapper userProfile={profile}>
        <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
          <p className="text-muted-foreground">No projects created yet</p>
        </div>
      </ProjectsWrapper>
    )
  }

  return (
    <ProjectsWrapper userProfile={profile}>
      <ProjectsList projects={projects} userProfile={profile} />
    </ProjectsWrapper>
  )
}

async function ProjectsWrapper({ children, userProfile }: { children: React.ReactNode, userProfile: string }) {

  const textTitle = userProfile === 'manager' ? 'Here you can see all the projects created by the clients' : userProfile === 'designer' ? 'Here you can see all the projects assigned to you' : 'Here you can see all the projects created by you'

  return (
    <div className="flex flex-col items-center justify-start mt-16 max-h-fit">
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-primary/50">
            {textTitle}
          </p>
        </div>
      </div>
      {children}
    </div>
  )
}