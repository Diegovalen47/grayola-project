import { Metadata } from "next";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import LogOut from "@/components/dashboard/log-out";


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
    .eq('id', data.user.id)

  if (profileError) {
    redirect('/error')
  }

  const Role = userProfile![0].role.charAt(0).toUpperCase() + userProfile![0].role.slice(1)

  return (
    <main className="flex items-center h-screen w-screen">
      <div className="flex flex-col justify-between w-2/12 h-full pt-8 px-4 pb-4 border-r-2 border-muted-foreground bg-muted">
        <div className="flex flex-col items-center">
          <Avatar className="w-36 h-36">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <p className="text-xs text-primary/50 mt-4">
            {Role}
          </p>
          <h3 className="text-primary font-bold mt-1">
            {data.user.email}
          </h3>
        </div>
        <div className="flex flex-col items-start">
          <LogOut />
        </div>
      </div>
      <div className="w-10/12 h-screen flex flex-col max-h-screen overflow-hidden py-8 px-16">
        <h1 className="text-4xl font-bold">
          Hi, {Role}
        </h1>
        <span className="text-sm text-primary/50">{data.user.email}</span>
        {children}
      </div>
    </main>
  )
}