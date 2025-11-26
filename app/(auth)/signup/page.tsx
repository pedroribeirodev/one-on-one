import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function SignupPage() {
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
        <CardDescription>
          Get started with Syncly
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Signup form will be implemented here */}
        <p className="text-sm text-muted-foreground">
          Signup functionality coming soon...
        </p>
      </CardContent>
    </Card>
  )
}
