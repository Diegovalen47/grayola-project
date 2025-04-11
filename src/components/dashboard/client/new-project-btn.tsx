'use client'

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { LucideCheck, Plus } from "lucide-react";
import { NewProjectForm } from "./new-project-form";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { NewProjectFiles } from "./new-project-files";
export function NewProjectBtn({text}: {text: string}) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [createdProjectId, setCreatedProjectId] = useState<string>('')

  const router = useRouter()

  const handleFilesUploaded = () => {
    setOpen(false)
    toast.success("Project created successfully", {
      duration: 3000,
      position: "top-right",
      className: "bg-muted border-r-2 border-muted-foreground",
      icon: <LucideCheck className="bg-green-800 text-white rounded-full w-4 h-4" />,
    })
    setStep(0)
    router.refresh()
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button  onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          {text}
        </Button>
      </SheetTrigger>
      <SheetContent className="min-w-3xl">
        <SheetHeader className="p-8">
          <SheetTitle className="text-2xl font-bold">
            Create New Project
          </SheetTitle>
          <SheetDescription>
            <span className="text-sm text-primary">
              Fill out the form below to create a new project.
            </span>
          </SheetDescription>
        </SheetHeader>
        <div className="p-8">
          {step === 0 && (
            <NewProjectForm projectCreated={({ projectId }: { projectId: string}) => {
              setCreatedProjectId(projectId)
              setStep(1)
            }} />
          )}
          {step === 1 && (
            <NewProjectFiles projectId={createdProjectId} filesUploaded={handleFilesUploaded} />
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
