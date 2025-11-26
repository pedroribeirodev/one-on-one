import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { labels } from "@/lib/locales/pt-br"

interface DeveloperPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { id } = await params
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{labels.developerProfile.title}</h1>
        <p className="text-muted-foreground">
          {labels.developerProfile.subtitle}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{labels.developerProfile.profile}</CardTitle>
            <CardDescription>{labels.developerProfile.developerId}: {id}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {labels.developerProfile.profileWillBeDisplayed}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{labels.developerProfile.meetingHistory}</CardTitle>
            <CardDescription>{labels.developerProfile.pastMeetings}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {labels.developerProfile.noMeetingsYet}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
