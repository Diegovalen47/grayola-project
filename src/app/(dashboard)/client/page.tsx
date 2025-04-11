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
    .eq('id', data.user.id)

  if (profileError) {
    console.error('Error fetching user profile', profileError)
    redirect('/error')
  }

  const profile = userProfile![0].role as string

  if (profile !== 'client') {
    redirect('/home')
  }

  const { data: projects, error: projectsError } = await supabase
    .from('project')
    .select('*')

  console.log('projects', projects)

  if (projectsError) {
    <ProjectsWrapper>
      <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
        <p className="text-muted-foreground">Error fetching projects</p>
      </div>
    </ProjectsWrapper>
  }

  if (!projects || projects.length === 0) {
    return (
      <ProjectsWrapper>
        <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
          <p className="text-muted-foreground">No projects found</p>
          <NewProjectBtn text="Create Project" />
        </div>
      </ProjectsWrapper>
    )
  }

  return (
    <ProjectsWrapper>
      <ProjectsList projects={projects} userProfile={profile} />
    </ProjectsWrapper>
  )
}

async function ProjectsWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-start mt-16 max-h-fit">
      <div className="flex items-end justify-between w-full">
        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Projects</h2>
          <p className="text-sm text-primary/50">
            Here you can see all the projects you have created
          </p>
        </div>
        <div className="mb-1">
          <NewProjectBtn text="New Project" />
        </div>
      </div>
      {children}
    </div>
  )
}