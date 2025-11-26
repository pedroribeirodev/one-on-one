import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { labels } from "@/lib/locales/pt-br"

export default function DevelopersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{labels.developers.title}</h1>
          <p className="text-muted-foreground">
            {labels.developers.subtitle}
          </p>
        </div>
        <Button>{labels.developers.addDeveloper}</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{labels.developers.teamMembers}</CardTitle>
          <CardDescription>
            {labels.developers.teamMembersDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            {labels.developers.noDevsYet}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
