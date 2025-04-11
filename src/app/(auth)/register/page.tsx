import { RegisterForm } from "@/components/auth/register-form";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function Register() {

  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { data, error } = await supabase.auth.getUser()

  if (data?.user) {
    redirect('/home')
  }

  return (
    <RegisterForm />
  )
}