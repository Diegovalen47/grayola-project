'use client'

import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"
import { useEffect, useState } from "react"

export function ManageDesignersDialog({ open, setOpen, projectId, designers }: { open: boolean, setOpen: (open: boolean) => void, projectId: string, designers: { id: string, role: string, email: string }[] | null }) {

  const [selectedDesigners, setSelectedDesigners] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [toggleRefresh, setToggleRefresh] = useState(false)
  const supabase = createClient()

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
        .eq("id", projectId)
        .single()

      if (error) {
        console.error("Error fetching designers", error)
      }

      if (dataDesigners) {
        console.log("Mapped designers", projectId, dataDesigners)
      }

      if (dataDesigners?.asignation) {
        setSelectedDesigners(dataDesigners.asignation.map((asignation) => asignation.designer_id))
      }
      setIsLoading(false)
    }

    fetchAsignedDesigners()
  }, [supabase, projectId, toggleRefresh])

  const handleSelectDesigner = async (designerId: string) => {
    setIsLoading(true)
    if (selectedDesigners.includes(designerId)) {
      setSelectedDesigners(selectedDesigners.filter((id) => id !== designerId))
      const { error: errorDelete } = await supabase.from("asignation").delete().eq("project_id", projectId).eq("designer_id", designerId)
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

    setSelectedDesigners([...selectedDesigners, designerId])
    const { error: errorInsert } = await supabase.from("asignation").insert({
      project_id: projectId,
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              <Checkbox disabled={isLoading} checked={selectedDesigners.includes(designer.id)} onCheckedChange={() => handleSelectDesigner(designer.id)} />
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
  )
}