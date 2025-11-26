import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

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
        <h1 className="text-3xl font-bold tracking-tight">Developer Profile</h1>
        <p className="text-muted-foreground">
          View and manage 1:1 meetings for this developer
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Developer ID: {id}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Developer profile will be displayed here.
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Meeting History</CardTitle>
            <CardDescription>Past 1:1 meetings</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              No meetings recorded yet.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
