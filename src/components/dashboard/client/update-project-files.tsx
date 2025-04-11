'use client'

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dashboard/dropzone'
import { Button } from '@/components/ui/button'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Trash2 } from 'lucide-react'
import { useState } from 'react'

export function EditProjectFiles({ projectId, filesUploaded, files, toggleRefresh }: { projectId: string, filesUploaded: () => void, files: { name: string, url: string }[], toggleRefresh: () => void }) {

  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const dropzoneProps = useSupabaseUpload({
    bucketName: 'files',
    path: `projects/${projectId}`,
    allowedMimeTypes: ['image/*'],
    maxFiles: 3,
    maxFileSize: 1000 * 1000 * 10, // 10MB,
  })

  const handleFilesUploaded = async () => {
    if (dropzoneProps.files.length === 0) {
      console.log("No files to upload")
      setIsLoading(false)
      return
    }

    console.log("Uploading files")
    setIsLoading(true)
    await dropzoneProps.onUpload()
    if (dropzoneProps.errors.length > 0) {
      console.log("Error uploading files", dropzoneProps.errors)
      setIsLoading(false)
      return
    }
    setIsLoading(false)
    filesUploaded()
  }

  const handleDeleteFile = async (fileName: string) => {
    setIsDeleting(true)
    const { data, error } = await supabase.storage.from('files').remove([`projects/${projectId}/${fileName}`])
    if (error) {
      console.log("Error deleting file", error)
      setError(error.message)
      setIsDeleting(false)
      return
    }
    setIsDeleting(false)
    setSuccess("File deleted successfully")
    toggleRefresh()
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        {files.map((file) => (
          <div key={file.name} className="flex flex-row items-center gap-2">
            <img src={file.url} alt={file.name} className="w-10 h-10 rounded-md" />
            <p>{file.name}</p>
            <Button variant="outline" color="destructive" className="w-fit px-8 bg-transparent text-destructive border-none shadow-none hover:bg-destructive/10 hover:traslate-y-0" onClick={() => {
              setIsLoading(false)
              handleDeleteFile(file.name)
            }}>
              {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </Button>
          </div>
        ))}
      </div>
      <Dropzone {...dropzoneProps}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">{success}</p>}

      <div className="mt-6 flex flex-row items-end justify-end gap-4">
        <Button type="submit" color="primary" className="w-fit px-8" onClick={handleFilesUploaded} disabled={isLoading || dropzoneProps.files.length === 0}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
        </Button>
        <Button variant="outline" color="destructive" className="w-fit px-8" onClick={() => {
          setIsLoading(false)
          filesUploaded()
        }}>
          Done
        </Button>
      </div>
    </div>
  )
}
