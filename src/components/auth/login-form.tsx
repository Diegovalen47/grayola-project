"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { EyeIcon, EyeOffIcon, KeyIcon, Loader2, MailIcon } from "lucide-react"
import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { login } from "./actions"

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
})

export function LoginForm() {
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true)
    const result = await login(values)
    if (result.error) {
      form.setError("password", {
        message: result.error,
      })
    }
    setIsLoading(false)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col">
        <h2 className="text-2xl font-bold">Access your account</h2>
        <div className="space-y-3 min-w-[300px] md:min-w-[400px] mt-12">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Enter your email" type="email"  {...field}
                    startIcon={MailIcon}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                {/* <FormLabel>Password</FormLabel> */}
                <FormControl>
                  <Input placeholder="Enter your password" type={showPassword ? "text" : "password"} {...field}
                    startIcon={KeyIcon}
                    endIcon={showPassword ? EyeIcon : EyeOffIcon}
                    onClickEndButton={() => setShowPassword(!showPassword)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Link href="/reset-password" className="font-bold text-sm text-secondary hover:underline transition-all duration-300 hover:text-primary">Forgot your password?</Link>
          </div>
        </div>
        <div className="mt-6 flex flex-col gap-4">
          <Button type="submit" className="w-full" color="secondary">
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Access"}
          </Button>
        </div>
        <div className="mb-6 mt-8 flex gap-4 items-center">
          <div className="flex-1">
            <Separator orientation="horizontal" className="bg-muted-foreground" />
          </div>
          <span className="text-sm text-muted-foreground">Or</span>
          <div className="flex-1">
            <Separator orientation="horizontal" className="bg-muted-foreground" />
          </div>
        </div>
        <span className="text-sm flex items-center justify-center gap-1">
          Don&apos;t have an account? 
          <Link href="/register" className="font-bold text-sm text-secondary hover:underline transition-all duration-300 hover:text-primary">Sign up</Link>
        </span>
      </form>
    </Form>
  )
}
