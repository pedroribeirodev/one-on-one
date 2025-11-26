import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"
import { labels } from "@/lib/locales/pt-br"

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
              <Button variant="ghost">{labels.auth.signIn}</Button>
            </Link>
            <Link href="/signup">
              <Button>{labels.auth.getStarted}</Button>
            </Link>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        <section className="container flex flex-col items-center justify-center gap-6 py-24 text-center md:py-32">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            {labels.landing.heroTitle}
            <br />
            <span className="text-muted-foreground">{labels.landing.heroSubtitle}</span>
          </h1>
          <p className="max-w-[600px] text-lg text-muted-foreground">
            {labels.landing.heroDescription}
          </p>
          <div className="flex gap-4">
            <Link href="/signup">
              <Button size="lg">{labels.landing.startFreeTrial}</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">{labels.auth.signIn}</Button>
            </Link>
          </div>
        </section>
        
        <section className="border-t bg-muted/50 py-16">
          <div className="container px-4">
            <h2 className="mb-8 text-center text-2xl font-bold">
              {labels.landing.featuresTitle}
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">{labels.landing.developerProfiles}</h3>
                <p className="text-sm text-muted-foreground">
                  {labels.landing.developerProfilesDescription}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">{labels.landing.aiPoweredSummaries}</h3>
                <p className="text-sm text-muted-foreground">
                  {labels.landing.aiPoweredSummariesDescription}
                </p>
              </div>
              <div className="rounded-lg border bg-background p-6">
                <h3 className="mb-2 font-semibold">{labels.landing.actionItemTracking}</h3>
                <p className="text-sm text-muted-foreground">
                  {labels.landing.actionItemTrackingDescription}
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="border-t py-6">
        <div className="container flex items-center justify-center px-4">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Syncly. {labels.landing.allRightsReserved}
          </p>
        </div>
      </footer>
    </div>
  )
}
