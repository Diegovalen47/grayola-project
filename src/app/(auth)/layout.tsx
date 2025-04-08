import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Auth",
  description: "Auth Layout",
}

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <main className="flex items-center h-screen w-screen">
      <div className="hidden xl:block md:w-1/3 bg-primary h-full"></div>
      <div className="w-full xl:w-2/3 h-full flex flex-col items-center justify-between">
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