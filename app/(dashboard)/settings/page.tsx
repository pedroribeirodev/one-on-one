import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { labels } from "@/lib/locales/pt-br"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{labels.settings.title}</h1>
        <p className="text-muted-foreground">
          {labels.settings.subtitle}
        </p>
      </div>
      
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>{labels.settings.profile}</CardTitle>
            <CardDescription>
              {labels.settings.profileDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {labels.settings.profileSettingsPlaceholder}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{labels.settings.notifications}</CardTitle>
            <CardDescription>
              {labels.settings.notificationsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {labels.settings.notificationSettingsPlaceholder}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{labels.settings.billing}</CardTitle>
            <CardDescription>
              {labels.settings.billingDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              {labels.settings.stripeComingSoon}
            </p>
            <Button variant="outline" disabled>
              {labels.settings.manageSubscription}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
