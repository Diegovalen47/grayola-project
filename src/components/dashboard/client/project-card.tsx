'use client'

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ProjectAsignees } from "./project-asignees"
import { ChevronRight, LucideCheck, Pencil, Plus, Trash  } from "lucide-react"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { EditProjectForm } from "./update-project-form"
import { EditProjectFiles } from "./update-project-files"

interface ProjectCardProps {
  project: {
    id: string
    title: string
    description: string
  }
  bucketUrl: string | undefined
  userProfile: string
  designers: { id: string, role: string, email: string }[] | null
}

export function ProjectCard({ project, bucketUrl, userProfile, designers }: ProjectCardProps) {

  const router = useRouter()

  const [open, setOpen] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  const [openAddDesignerDialog, setOpenAddDesignerDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [stepEdit, setStepEdit] = useState(0)
  const [updatedProjectId, setUpdatedProjectId] = useState<string | null>(null)

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const [selectedDesigners, setSelectedDesigners] = useState<{id: string, email: string}[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [toggleRefresh, setToggleRefresh] = useState(false)

  const [files, setFiles] = useState<{ name: string, url: string }[]>([])
  const [selectedFile, setSelectedFile] = useState<{ name: string, url: string } | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const fetchFiles = async () => {
      console.log("Fetching files")
      const { data: dataFiles, error } = await supabase.storage.from("files").list(`projects/${project.id}`)

      if (error) {
        console.error("Error fetching files", error)
      }

      if (dataFiles) {
        const mappedFiles = dataFiles.map((file) => 
          ({ name: file.name, url: `${bucketUrl}/${project.id}/${file.name}` })
        )
        console.log("Mapped files", project.title, mappedFiles)
        setFiles(mappedFiles)
      }
    }
    fetchFiles()
  }, [supabase, project.id, toggleRefresh])

  useEffect(() => {
    const fetchAsignedDesigners = async () => {
      setIsLoading(true)
      console.log("Fetching designers")
      const { data: dataDesigners, error } = await supabase
        .from("project")
        .select(`
          id,
          asignation (
            project_id,
            designer_id
          )
        `)
        .eq("id", project.id)
        .single()

      if (error) {
        console.error("Error fetching designers", error)
      }

      if (dataDesigners) {
        console.log("Mapped designers", project.id, dataDesigners)
      }

      if (dataDesigners?.asignation) {
        setSelectedDesigners(dataDesigners.asignation.map((asignation) => ({ id: asignation.designer_id, email: designers?.find((designer) => designer.id === asignation.designer_id)?.email || '' })))
      }
      setIsLoading(false)
    }

    fetchAsignedDesigners()
  }, [supabase, project.id, toggleRefresh])

  const handleSelectDesigner = async (designerId: string) => {
    setIsLoading(true)
    if (selectedDesigners.some((designer) => designer.id === designerId)) {
      setSelectedDesigners(selectedDesigners.filter((designer) => designer.id !== designerId))
      const { error: errorDelete } = await supabase.from("asignation").delete().eq("project_id", project.id).eq("designer_id", designerId)
      if (errorDelete) {
        console.error("Error deleting designer", errorDelete)
        setError("Error unassigning designer")
        setIsLoading(false)
        return
      }
      setIsLoading(false)
      setSuccess("Designer unassigned successfully")
      return
    }

    setSelectedDesigners([...selectedDesigners, { id: designerId, email: designers?.find((designer) => designer.id === designerId)?.email || '' }])
    const { error: errorInsert } = await supabase.from("asignation").insert({
      project_id: project.id,
      designer_id: designerId
    })
    if (errorInsert) {
      console.error("Error inserting designer", errorInsert)
      setError("Error assigning designer")
      setIsLoading(false)
      return
    }

    setSuccess("Designer assigned successfully")

    setIsLoading(false)
  }

  const handleDeleteProject = async () => {
    setIsLoading(true)
    const { error: errorDelete } = await supabase.from("project").delete().eq("id", project.id)
    if (errorDelete) {
      console.error("Error deleting project", errorDelete)
      setError("Error deleting project")
      setIsLoading(false)
      return
    }

    setSuccess("Project deleted successfully")
    setIsLoading(false)
    setToggleRefresh(!toggleRefresh)
    setOpen(false)
    router.refresh()
    toast.success("Project deleted successfully", {
      duration: 3000,
      position: "top-right",
      className: "bg-muted border-r-2 border-muted-foreground",
      icon: <LucideCheck className="bg-green-800 text-white rounded-full w-4 h-4" />,
    })
  }

  const handleFilesUploaded = () => {
    setOpen(false)
    setToggleRefresh(!toggleRefresh)
    toast.success("Project updated successfully", {
      duration: 3000,
      position: "top-right",
      className: "bg-muted border-r-2 border-muted-foreground",
      icon: <LucideCheck className="bg-green-800 text-white rounded-full w-4 h-4" />,
    })
    setStepEdit(0)
    setOpenEditDialog(false)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Card className="w-full flex flex-row border-2 bg-muted border-muted-foreground shadow-none p-4 transition-all duration-100 min-h-36 h-full hover:bg-muted/50 cursor-pointer" onClick={() => console.log(project.id)}>
          <div className="w-2/3 flex flex-col justify-between gap-2">
            <CardHeader className="p-0">
              <CardTitle className="text-primary font-bold text-lg">
                {project.title}
              </CardTitle>
              <CardDescription className="text-primary/50">
                {project.description}
              </CardDescription>
              <div className="flex flex-row gap-1 items-end">
              </div>
            </CardHeader>
            {!isLoading && selectedDesigners.length > 0 && (
              <ProjectAsignees asignees={selectedDesigners}  />
            )}
          </div>
          <div className="w-1/3 flex flex-col items-end justify-between gap-2" >
            <div className="flex flex-row gap-1 items-end">
              <small className="text-xs text-secondary/60">{project.id}</small>
            </div>
            <div className="flex flex-row gap-1 items-end text-primary/50">
              <small className="text-xs">View more</small>
              <ChevronRight className="h-4 w-4" />
            </div>
          </div>
        </Card>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader className="p-8">
          <SheetTitle className="text-2xl font-bold mb-2">
            {project.title}
            <div className="flex flex-row gap-1 items-end mt-1">
              <small className="text-xs text-primary/50">ID:</small>
              <small className="text-xs text-secondary/50">{project.id}</small>
            </div>
          </SheetTitle>
          {!isLoading && selectedDesigners.length > 0 && (
            <ProjectAsignees asignees={selectedDesigners}  />
          )}
          <SheetDescription className="mt-4">
            <span className="text-sm text-primary">
              {project.description}
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="px-8 flex flex-col gap-4">
          {
            files.length > 0 ? (
              <h3 className="text-lg mb-2 font-semibold">Files attached to this project</h3>
            ) : (
              <h3 className="text-lg mb-2 font-semibold">No files attached to this project</h3>
            )
          }
          <div className="flex flex-row gap-4">
            {files.map((file, index) => (
              <div key={index} >
                <div className="flex flex-col gap-2 items-start justify-start p-4 hover:bg-muted/70 cursor-pointer rounded-md" onClick={() => {
                  setSelectedFile(file)
                  setOpenDialog(true)
                }}>
                  <img src={file.url} alt={file.name} className= "w-24 h-24" />
                  <p>{file.name}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        {
          userProfile === 'manager' && (
            <div className="flex flex-row justify-end gap-4 px-8 mt-12">
              <Button onClick={() => setOpenAddDesignerDialog(true)}>
                <Plus className="h-4 w-4" />
                <p>Manage designers</p>
              </Button>
              <Button onClick={() => setOpenEditDialog(true)} color="secondary">
                <Pencil className="h-4 w-4" />
                Edit project
              </Button>
              <Button onClick={() => setOpenDeleteDialog(true)} color="destructive">
                <Trash className="h-4 w-4" />
                <p>Delete project</p>
              </Button>
            </div>
          )
        }
      </SheetContent>
      {selectedFile && (
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent className="py-8">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-center">Image preview</DialogTitle>
              <DialogDescription></DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-2 items-center justify-center">
              <img src={selectedFile.url} alt={selectedFile.name} className= "w-72 h-72" />
              <p>{selectedFile.name}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}
      <Dialog open={openAddDesignerDialog} onOpenChange={setOpenAddDesignerDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Select designers</DialogTitle>
            <DialogDescription className="text-sm text-primary/50">
              Select the designers you want to add to the project
            </DialogDescription>
          </DialogHeader>
          {isLoading ? (  
            <div className="flex flex-col gap-4">
              <div className="flex flex-row gap-2 items-center">
                <Loader2 className="w-4 h-4 animate-spin" />
                <p>Loading...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {designers?.map((designer) => (
              <div key={designer.id} className="flex flex-row gap-2 items-center">
                <Checkbox disabled={isLoading} checked={selectedDesigners.some((selectedDesigner) => selectedDesigner.id === designer.id)} onCheckedChange={() => handleSelectDesigner(designer.id)} />
                <p>{designer.email}</p>
                </div>
              ))}
            </div>
          )}
          <div>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openEditDialog} onOpenChange={setOpenEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              Edit project
            </DialogTitle>
            <DialogDescription>
              <span className="text-sm text-primary">
                Fill out the form below to edit the project.
              </span>
            </DialogDescription>
          </DialogHeader>
          <div>
            {stepEdit === 0 && (
              <EditProjectForm projectUpdated={({ projectId }: { projectId: string}) => {
                setUpdatedProjectId(projectId)
                setStepEdit(1)
              }} project={project} />
            )}
            {stepEdit === 1 && (
              <EditProjectFiles projectId={updatedProjectId || ''} filesUploaded={handleFilesUploaded} files={files} toggleRefresh={() => setToggleRefresh(!toggleRefresh)} />
            )}
          </div>
        </DialogContent>
      </Dialog>
      <Dialog open={openDeleteDialog} onOpenChange={setOpenDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
          </DialogHeader>
          <DialogDescription className="text-sm text-primary/60">
            Are you sure you want to delete this project? This action cannot be undone.
          </DialogDescription>
          <DialogFooter>
            <Button onClick={() => setOpenDeleteDialog(false)} color="secondary">Cancel</Button>
            <Button onClick={handleDeleteProject} color="destructive">Delete</Button>
          </DialogFooter>
          {error && <p className="text-red-500">{error}</p>}
          {success && <p className="text-green-500">{success}</p>}
        </DialogContent>
      </Dialog>
    </Sheet>
  )
}