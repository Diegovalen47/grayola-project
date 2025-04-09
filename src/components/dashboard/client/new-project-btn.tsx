'use client'

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function NewProjectBtn({text}: {text: string}) {
  return (
    <Button variant="outline">
      <Plus className="w-4 h-4" />
      {text}
    </Button>
  )
}
