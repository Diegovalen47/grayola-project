import { createClient } from "@/lib/supabase/server";
import { ProjectCard } from "./project-card";
import { ScrollArea } from "@/components/ui/scroll-area"
import { redirect } from "next/navigation";

export async function ProjectsList({ projects, userProfile }: { projects: { id: string, title: string, description: string }[], userProfile: string }) {

  const supabase = await createClient()

  const { data: designers, error } = await supabase.from('profile').select('id, role, email').eq('role', 'designer')

  if (error) {
    console.log('Error fetching designers', error)
    redirect('/error')
  }

  return (
    <ScrollArea className="w-full max-h-[calc(100vh-40%)] mt-10">
      <div className="flex flex-col items-center justify-center w-full gap-2">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} bucketUrl={process.env.NEXT_PULIC_SUPABASE_BUCKET_URL} userProfile={userProfile} designers={designers} />
        ))}
      </div>
    </ScrollArea>
  )
}