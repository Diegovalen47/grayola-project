import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import LogOut from "@/components/log-out";


export const metadata: Metadata = {
  title: "Dashboard",
  description: "Dashboard Layout",
}

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    redirect('/login')
  }

  const { data: userProfile, error: profileError } = await supabase
    .from('profile')
    .select('*')
    .single()

  if (profileError) {
    redirect('/error')
  }

  return (
    <main className="flex items-center h-screen w-screen">
      <div className="flex flex-col justify-between md:w-2/12 h-full pt-8 px-4 pb-4 border-r-2 border-muted-foreground bg-muted">
        <div className="flex flex-col items-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h3 className="text-primary font-bold mt-4">
            {data.user.email}
          </h3>
          <p className="text-xs text-muted-foreground">
            {userProfile.role.charAt(0).toUpperCase() + userProfile.role.slice(1)}
          </p>
        </div>
        <div className="flex flex-col items-start">
          <LogOut />
        </div>
      </div>
      <div className="w-full xl:w-10/12 h-full flex flex-col items-center justify-between">
        <div className="w-full flex justify-end items-center p-4">
        </div>
        <div className="w-full flex justify-center items-center">
          {children}
        </div>
        <div className="w-full p-4">
          <p className="text-sm text-muted-foreground">
          </p>
        </div>
      </div>
    </main>
  )
}