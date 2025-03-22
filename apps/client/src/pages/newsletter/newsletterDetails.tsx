"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { LoadingSpinner } from "../../components/loading-spinner"
import { useNewsletter } from "../../hooks/useNewsletter"
import { useAuth } from "../../hooks/useAuth"
import { Calendar, User, Users, Clock, Tag, ArrowRight, Loader2, FileText, Sparkles } from "lucide-react"

interface Newsletter {
  id: string
  title: string
  description: string
  frequency: string
  category: string
  authorId: string
  authorName: string
  subscriberCount: number
  createdAt: string
  tags?: string[]
}

interface Article {
  id: string
  title: string
  excerpt: string
  createdAt: string
}

export default function NewsletterDetails() {
  const { newsletterId } = useParams<{ newsletterId: string }>()
  const [newsletter, setNewsletter] = useState<Newsletter | null>(null)
  const [articles, setArticles] = useState<Article[]>([])
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [loading, setLoading] = useState(true)
  const [subscribing, setSubscribing] = useState(false)
  const [error, setError] = useState("")
  const { getNewsletter, getNewsletterArticles, subscribeToNewsletter, unsubscribeFromNewsletter } = useNewsletter()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      if (!newsletterId) return

      try {
        const newsletterData = await getNewsletter(newsletterId)
        setNewsletter(newsletterData)

        const articlesData = await getNewsletterArticles(newsletterId)
        setArticles(articlesData)

        // Check if user is subscribed
        if (user) {
          setIsSubscribed(newsletterData.isUserSubscribed || false)
        }
      } catch (err) {
        setError("Failed to load newsletter details")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [newsletterId, getNewsletter, getNewsletterArticles, user])

  const handleSubscribe = async () => {
    if (!user) {
      navigate("/auth/login")
      return
    }

    if (!newsletterId) return

    setSubscribing(true)
    try {
      await subscribeToNewsletter(newsletterId)
      setIsSubscribed(true)
    } catch (err) {
      console.error("Failed to subscribe:", err)
    } finally {
      setSubscribing(false)
    }
  }

  const handleUnsubscribe = async () => {
    if (!newsletterId) return

    setSubscribing(true)
    try {
      await unsubscribeFromNewsletter(newsletterId)
      setIsSubscribed(false)
    } catch (err) {
      console.error("Failed to unsubscribe:", err)
    } finally {
      setSubscribing(false)
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !newsletter) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || "Newsletter not found"}</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  const isAuthor = user && user.id === newsletter.authorId

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="mb-12 relative">
        <div className="absolute -top-6 -right-6 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-full blur-xl -z-10"></div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 relative">
          {newsletter.title}
          <span className="absolute -top-2 -left-4 text-primary/20">
            <Sparkles size={20} />
          </span>
        </h1>
        <p className="text-xl text-muted-foreground mb-6">{newsletter.description}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center text-muted-foreground">
              <User className="w-4 h-4 mr-2 text-primary" />
              <span>By {newsletter.authorName}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Calendar className="w-4 h-4 mr-2 text-primary" />
              <span>Created on {new Date(newsletter.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Clock className="w-4 h-4 mr-2 text-primary" />
              <span>{newsletter.frequency.charAt(0).toUpperCase() + newsletter.frequency.slice(1)} newsletter</span>
            </div>

            <div className="flex items-center text-muted-foreground">
              <Users className="w-4 h-4 mr-2 text-primary" />
              <span>{newsletter.subscriberCount} subscribers</span>
            </div>
          </div>

          <div className="flex flex-col space-y-4">
            {newsletter.category && (
              <div className="flex items-center text-muted-foreground">
                <Tag className="w-4 h-4 mr-2 text-secondary" />
                <span>Category: {newsletter.category}</span>
              </div>
            )}

            {newsletter.tags && newsletter.tags.length > 0 && (
              <div>
                <div className="text-muted-foreground mb-2 flex items-center">
                  <Tag className="w-4 h-4 mr-2 text-secondary" />
                  <span>Tags:</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newsletter.tags.map((tag, index) => (
                    <span key={index} className="bg-secondary/10 text-secondary px-3 py-1 rounded-full text-sm">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end">
          {isAuthor ? (
            <Link to={`/article/create?newsletterId=${newsletterId}`}>
              <Button className="group gradient-bg border-0 hover:opacity-90">
                Create Article <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          ) : (
            <>
              {isSubscribed ? (
                <Button
                  variant="outline"
                  onClick={handleUnsubscribe}
                  disabled={subscribing}
                  className="border-primary/50 hover:border-primary"
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Unsubscribing...
                    </>
                  ) : (
                    "Unsubscribe"
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleSubscribe}
                  disabled={subscribing}
                  className="gradient-bg border-0 hover:opacity-90"
                >
                  {subscribing ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Subscribing...
                    </>
                  ) : (
                    "Subscribe"
                  )}
                </Button>
              )}
            </>
          )}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <FileText className="mr-2 text-primary" size={24} />
          Articles
        </h2>

        {articles.length === 0 ? (
          <Card className="p-8 text-center border-dashed border-2 rounded-xl">
            <div className="mb-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                <FileText className="text-primary" size={28} />
              </div>
            </div>
            <h3 className="text-xl font-semibold mb-2">No articles published yet</h3>
            <p className="text-muted-foreground mb-6">Be the first to know when new content is published.</p>
            {isAuthor && (
              <Link to={`/article/create?newsletterId=${newsletterId}`}>
                <Button className="gradient-bg border-0 hover:opacity-90">Create Your First Article</Button>
              </Link>
            )}
          </Card>
        ) : (
          <div className="space-y-6">
            {articles.map((article) => (
              <Card
                key={article.id}
                className="p-6 card-hover border border-border/50 rounded-xl overflow-hidden relative"
              >
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-3xl -z-10"></div>
                <h3 className="text-xl font-semibold mb-2">{article.title}</h3>
                <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center">
                    <Calendar className="w-4 h-4 mr-1 text-primary" />
                    {new Date(article.createdAt).toLocaleDateString()}
                  </span>
                  <Link to={`/article/${article.id}`}>
                    <Button variant="outline" size="sm" className="group border-primary/50 hover:border-primary">
                      Read Article{" "}
                      <ArrowRight size={14} className="ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

