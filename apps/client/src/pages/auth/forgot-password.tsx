"use client"

import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { useAuth } from "../../hooks/useAuth"
import { Mail, Loader2, CheckCircle } from "lucide-react"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await resetPassword(email)
      setIsSubmitted(true)
    } catch (err) {
      setError("Failed to send password reset email. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">Reset Password</h1>
        <p className="text-muted-foreground mt-2">We'll send you a link to reset your password</p>
      </div>

      <Card className="p-6 shadow-md border-border/50">
        {isSubmitted ? (
          <div className="text-center py-6">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="text-primary" size={24} />
            </div>
            <h2 className="text-xl font-semibold mb-2">Check your email</h2>
            <p className="text-muted-foreground mb-6">
              We've sent a password reset link to <span className="font-medium">{email}</span>
            </p>
            <Link to="/auth/login" className="text-primary hover:underline font-medium">
              Back to login
            </Link>
          </div>
        ) : (
          <>
            {error && (
              <div
                className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md mb-6"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email" className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  "Send Reset Link"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link to="/auth/login" className="text-primary hover:underline font-medium">
                Back to login
              </Link>
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

