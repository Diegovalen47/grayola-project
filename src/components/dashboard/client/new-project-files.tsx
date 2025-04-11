'use client'

import {
  Dropzone,
  DropzoneContent,
  DropzoneEmptyState,
} from '@/components/dashboard/dropzone'
import { Button } from '@/components/ui/button'
import { useSupabaseUpload } from '@/hooks/use-supabase-upload'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'

export function NewProjectFiles({ projectId, filesUploaded }: { projectId: string, filesUploaded: () => void }) {

  const [isLoading, setIsLoading] = useState(false)
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

  return (
    <div className="flex flex-col gap-4">
      <Dropzone {...dropzoneProps}>
        <DropzoneEmptyState />
        <DropzoneContent />
      </Dropzone>

      <div className="mt-6 flex flex-col items-end gap-4">
        <Button type="submit" color="primary" className="w-fit px-8" onClick={handleFilesUploaded} disabled={isLoading || dropzoneProps.files.length === 0}>
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Create"}
        </Button>
      </div>
    </div>
  )
}
