'use client'

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useState } from "react"
import { Loader2 } from "lucide-react"

export default function LogOut() {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await supabase.auth.signOut()
    router.push('/login')
    setIsLoading(false)
  }

  return (
    <Button variant="link" onClick={handleLogout} disabled={isLoading} className="h-fit px-2">
      Logout
    </Button>
  )
}