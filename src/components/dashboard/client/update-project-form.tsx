'use client'

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Loader2, TextIcon } from "lucide-react"
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
})
export function EditProjectForm({ projectUpdated, project }: { projectUpdated: ({ projectId }: { projectId: string }) => void, project: { id: string, title: string, description: string } | null }) {
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: project?.title || "",
      description: project?.description || "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    const { data, error } = await supabase.from("project").update({
      title: values.title,
      description: values.description,
    }).eq("id", project?.id)

    if (error) {
      console.log("Error updating project", error)
      form.setError("description", { message: "Error updating project, check the form and try again" })
      setIsLoading(false)
      return
    }

    const { data: projectData, error: projectError } = await supabase.from("project").select("*").eq("id", project?.id).single()

    if (projectError) {
      console.log("Error getting project", projectError)
      form.setError("description", { message: "Error getting project, check the form and try again" })
      setIsLoading(false)
      return
    }

    console.log("Project updated", projectData)
    form.reset()
    setIsLoading(false)
    projectUpdated({ projectId: projectData.id })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your project tile</FormLabel>
              <FormControl>
                <Input placeholder="Example: Design System Apple" {...field}
                  startIcon={TextIcon}
                />
              </FormControl>
              <FormMessage />
            </FormItem> 
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter your project description</FormLabel>
              <FormControl>
                <Textarea placeholder="Example: Design System for a new product..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="mt-6 flex flex-col items-end gap-4">
          <Button type="submit" color="primary" className="w-fit px-8">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Continue"}
          </Button>
        </div>
      </form>
    </Form>
  )
}