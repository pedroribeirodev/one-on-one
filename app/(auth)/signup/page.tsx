'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2 } from 'lucide-react'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { signup, loginWithGoogle } from '@/lib/auth/actions'
import { labels } from '@/lib/locales/pt-br'

const signupSchema = z.object({
  email: z.string().email(labels.forms.pleaseEnterValidEmail),
  password: z
    .string()
    .min(6, labels.forms.passwordMinLength)
    .max(72, labels.forms.passwordMaxLength),
  fullName: z
    .string()
    .min(2, labels.forms.nameMinLength)
    .max(100, labels.forms.nameMaxLength),
  companyName: z
    .string()
    .min(2, labels.forms.companyNameMinLength)
    .max(100, labels.forms.companyNameMaxLength),
})

type SignupFormValues = z.infer<typeof signupSchema>

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: '',
      password: '',
      fullName: '',
      companyName: '',
    },
  })

  async function onSubmit(values: SignupFormValues) {
    setIsLoading(true)
    setError(null)

    try {
      const result = await signup(values)
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError(labels.messages.error.unexpectedError)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGoogleSignup() {
    setIsGoogleLoading(true)
    setError(null)

    try {
      const result = await loginWithGoogle()
      if (result?.error) {
        setError(result.error)
      }
    } catch {
      setError(labels.messages.error.googleSignUpFailed)
    } finally {
      setIsGoogleLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{labels.auth.createAccount}</CardTitle>
        <CardDescription>{labels.auth.getStartedWithSyncly}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignup}
          disabled={isLoading || isGoogleLoading}
        >
          {isGoogleLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          {labels.auth.continueWithGoogle}
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              {labels.auth.orContinueWithEmail}
            </span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.fullName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="João Silva"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.companyName}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Empresa Ltda"
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{labels.auth.email}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="joao@exemplo.com"
                      disabled={isLoading}
                      {...field}
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
                  <FormLabel>{labels.auth.password}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder={labels.auth.createAPassword}
                      disabled={isLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {labels.auth.createAccount}
            </Button>
          </form>
        </Form>

        <p className="text-center text-sm text-muted-foreground">
          {labels.auth.alreadyHaveAccount}{' '}
          <Link href="/login" className="text-primary hover:underline">
            {labels.auth.signIn}
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
