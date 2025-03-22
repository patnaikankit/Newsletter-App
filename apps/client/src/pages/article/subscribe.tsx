"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { useNewsletter } from "../../hooks/useNewsletter"
import { useAuth } from "../../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { Mail, CheckCircle, Loader2, User, Tag, Users, Sparkles } from "lucide-react"
import { LoadingSpinner } from "../../components/loading-spinner"

interface Newsletter {
  id: string
  title: string
  description: string
  authorName: string
  category?: string
  subscriberCount?: number
}

export default function Subscribe() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([])
  const [selectedNewsletters, setSelectedNewsletters] = useState<string[]>([])
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")
  const { getNewsletters, subscribeToNewsletters } = useNewsletter()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        const data = await getNewsletters()
        setNewsletters(data)

        if (user) {
          setEmail(user.email)
        }
      } catch (err) {
        console.error("Failed to fetch newsletters:", err)
        setError("Failed to load newsletters")
      } finally {
        setLoading(false)
      }
    }

    fetchNewsletters()
  }, [getNewsletters, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedNewsletters.length === 0) {
      setError("Please select at least one newsletter")
      return
    }

    setError("")
    setSubmitting(true)

    try {
      await subscribeToNewsletters(selectedNewsletters, email)
      setSuccess(true)

      if (user) {
        setTimeout(() => navigate("/"), 2000)
      }
    } catch (err) {
      console.error("Failed to subscribe:", err)
      setError("Failed to subscribe. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  const toggleNewsletter = (id: string) => {
    setSelectedNewsletters((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  const selectAll = () => {
    setSelectedNewsletters(
      selectedNewsletters.length === newsletters.length ? [] : newsletters.map((n) => n.id)
    )
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-secondary mb-4">
          <Sparkles className="text-white" size={24} />
        </div>
        <h1 className="text-3xl font-bold mb-2">Subscribe to Newsletters</h1>
        <p className="text-muted-foreground">Stay updated with the latest content from your favorite newsletters</p>
      </div>

      {success ? (
        <Card className="p-8 text-center shadow-md border-border/50 rounded-xl overflow-hidden relative">
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground mb-6">You have successfully subscribed to the selected newsletters.</p>
          <Link to="/">
            <Button className="gradient-bg border-0 hover:opacity-90">Back to Home</Button>
          </Link>
        </Card>
      ) : (
        <Card className="p-6 shadow-md border-border/50 rounded-xl overflow-hidden relative">
          {error && <div className="bg-destructive/10 border border-destructive/30 text-destructive px-4 py-3 rounded-md mb-6">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center">
                <Mail className="w-4 h-4 mr-2 text-primary" /> Email Address
              </Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="your@email.com" disabled={!!user} className="focus:border-primary" />
            </div>
            <div>
              <Label className="text-lg font-medium">Select Newsletters</Label>
              <Button type="button" variant="ghost" size="sm" onClick={selectAll} className="text-primary hover:text-primary/90">
                {selectedNewsletters.length === newsletters.length ? "Deselect All" : "Select All"}
              </Button>
              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {newsletters.length === 0 ? <p className="text-center py-8 text-muted-foreground">No newsletters available.</p> : newsletters.map((newsletter) => (
                  <div key={newsletter.id} className={`border rounded-lg p-4 transition-colors cursor-pointer ${selectedNewsletters.includes(newsletter.id) ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`} onClick={() => toggleNewsletter(newsletter.id)}>
                    <input type="checkbox" id={`newsletter-${newsletter.id}`} checked={selectedNewsletters.includes(newsletter.id)} onChange={() => toggleNewsletter(newsletter.id)} className="mt-1" />
                    <label htmlFor={`newsletter-${newsletter.id}`} className="font-medium text-lg cursor-pointer">{newsletter.title}</label>
                    <p className="text-muted-foreground mb-2">{newsletter.description}</p>
                  </div>
                ))}
              </div>
            </div>
            <Button type="submit" className="w-full gradient-bg border-0 hover:opacity-90" disabled={submitting || selectedNewsletters.length === 0}>
              {submitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subscribing...</> : "Subscribe"}
            </Button>
          </form>
        </Card>
      )}
    </div>
  )
}
