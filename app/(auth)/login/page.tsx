import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Welcome back</CardTitle>
        <CardDescription>
          Sign in to your Syncly account
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Login form will be implemented here */}
        <p className="text-sm text-muted-foreground">
          Login functionality coming soon...
        </p>
      </CardContent>
    </Card>
  )
}
