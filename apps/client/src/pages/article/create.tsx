"use client"

import { useState, type FormEvent, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { Card } from "../../ui/card"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Button } from "../../ui/button"
import { Label } from "../../ui/label"
import { useNewsletter } from "../../hooks/useNewsletter"

export default function CreateArticle() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [newsletterId, setNewsletterId] = useState("")
  const [newsletters, setNewsletters] = useState<{ id: string; title: string }[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { createArticle, getUserNewsletters } = useNewsletter()
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    // Get newsletterId from query params if available
    const params = new URLSearchParams(location.search)
    const nlId = params.get("newsletterId")
    if (nlId) {
      setNewsletterId(nlId)
    }

    // Fetch user's newsletters
    const fetchNewsletters = async () => {
      try {
        const data = await getUserNewsletters()
        setNewsletters(data)

        // If no newsletterId in query params but user has newsletters, select the first one
        if (!nlId && data.length > 0) {
          setNewsletterId(data[0].id)
        }
      } catch (err) {
        console.error("Failed to fetch newsletters:", err)
      }
    }

    fetchNewsletters()
  }, [location.search, getUserNewsletters])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      const articleId = await createArticle({
        title,
        content,
        excerpt,
        newsletterId,
      })
      navigate(`/article/${articleId}`)
    } catch (err) {
      setError("Failed to create article. Please try again.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create an Article</h1>

      <Card className="p-6">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {newsletters.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You need to create a newsletter before you can publish articles.
            </p>
            <Button onClick={() => navigate("/newsletter/create")}>Create a Newsletter</Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="newsletter">Newsletter</Label>
              <select
                id="newsletter"
                value={newsletterId}
                onChange={(e) => setNewsletterId(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-md"
                required
              >
                <option value="" disabled>
                  Select a newsletter
                </option>
                {newsletters.map((newsletter) => (
                  <option key={newsletter.id} value={newsletter.id}>
                    {newsletter.title}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="title">Article Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="How to Build a Newsletter Platform"
              />
            </div>

            <div>
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea
                id="excerpt"
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                required
                placeholder="A brief summary of your article (will be displayed in newsletter previews)"
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="content">Content</Label>
              <Textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                placeholder="Write your article content here..."
                rows={12}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Publishing..." : "Publish Article"}
              </Button>
            </div>
          </form>
        )}
      </Card>
    </div>
  )
}

