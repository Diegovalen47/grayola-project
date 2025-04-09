'use client'

import { NewProjectBtn } from "./new-project-btn"
import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"

export async function ProjectsList({ user }: { user: User }) {

  const supabase = createClient()

  const { data: projects, error } = await supabase
    .from('projects')
    .select('*')
    .eq('created_by_user_id', user.id)

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
        <p className="text-muted-foreground">Error fetching projects</p>
      </div>
    )
  }

  if (!projects) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-80 gap-4">
        <p className="text-muted-foreground">No projects found</p>
        <NewProjectBtn text="Create Project" />
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {projects.map((project) => (
        <div key={project.id}>
          <h3>{project.name}</h3>
        </div>
      ))}
    </div>
  )
}