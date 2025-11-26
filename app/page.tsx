import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6" />
            <span className="font-semibold text-lg">Syncly</span>
          </div>
          <nav className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign in</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            1:1 Meeting Management
            <br />
            <span className="text-muted-foreground">for Tech Leads</span>
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            Syncly helps you run effective 1:1 meetings with your team. 
            Track action items, generate AI-powered summaries, and build 
            stronger relationships with your developers.
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button size="lg">Start Free Trial</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Sign In</Button>
            </Link>
          </div>
        </section>
        
        <section className="border-t bg-muted/50 py-16">
          <div className="container px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">
              Everything you need for effective 1:1s
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">Developer Profiles</h3>
                <p className="text-sm text-muted-foreground">
                  Keep track of each team member&apos;s goals, progress, and career aspirations.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">AI-Powered Summaries</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically generate meeting summaries and action items with AI.
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">Action Item Tracking</h3>
                <p className="text-sm text-muted-foreground">
                  Never lose track of follow-ups with built-in action item management.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Syncly. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}
