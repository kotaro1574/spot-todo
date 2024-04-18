import { cookies } from "next/headers"
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs"

import { Database } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

import AccountForm from "./account-form"

export default async function AccountPage() {
  const cookieStore = cookies()
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const user = session.user

  const { data, error, status } = await supabase
    .from("profiles")
    .select("username, avatar_url, id, lat, lng")
    .eq("id", user.id)
    .single()

  if (!data) return null

  if (error && status !== 406) {
    throw error
  }

  return (
    <section className="grid gap-6">
      <h1 className="text-3xl font-extrabold leading-tight tracking-tighter md:text-4xl">
        Account
      </h1>
      <AccountForm profile={data} />

      <Separator className="" />

      <form action="/api/auth/signout" method="post">
        <Button variant={"destructive"} className="block w-full" type="submit">
          Logout
        </Button>
      </form>
    </section>
  )
}
