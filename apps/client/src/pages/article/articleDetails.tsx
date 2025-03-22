"use client"

import { useEffect, useState } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { Button } from "../../ui/button"
import { Card } from "../../ui/card"
import { LoadingSpinner } from "../../components/loading-spinner"
import { useNewsletter } from "../../hooks/useNewsletter"
import { useAuth } from "../../hooks/useAuth"
import { Calendar, User, ArrowLeft, Trash2, Share2, Loader2, Sparkles } from "lucide-react"

interface Article {
  id: string
  title: string
  content: string
  excerpt: string
  createdAt: string
  newsletterId: string
  newsletterTitle: string
  authorId: string
  authorName: string
}

export default function ArticleDetails() {
  const { articleId } = useParams<{ articleId: string }>()
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)
  const [error, setError] = useState("")
  const { getArticle, deleteArticle } = useNewsletter()
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchArticle = async () => {
      if (!articleId) return

      try {
        const data = await getArticle(articleId)
        setArticle(data)
      } catch (err) {
        setError("Failed to load article")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchArticle()
  }, [articleId, getArticle])

  const handleDelete = async () => {
    if (!articleId || !window.confirm("Are you sure you want to delete this article?")) return

    setDeleting(true)
    try {
      await deleteArticle(articleId)
      navigate(`/newsletter/${article?.newsletterId}`)
    } catch (err) {
      console.error("Failed to delete article:", err)
    } finally {
      setDeleting(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: article?.title,
          text: article?.excerpt,
          url: window.location.href,
        })
        .catch((err) => console.error("Error sharing:", err))
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((err) => console.error("Error copying link:", err))
    }
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error || !article) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-4">Error</h2>
        <p className="text-muted-foreground mb-6">{error || "Article not found"}</p>
        <Link to="/">
          <Button>Back to Home</Button>
        </Link>
      </div>
    )
  }

  const isAuthor = user && user.id === article.authorId

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link
            to={`/newsletter/${article.newsletterId}`}
            className="text-primary hover:text-primary/80 flex items-center group"
          >
            <ArrowLeft size={16} className="mr-1 group-hover:-translate-x-1 transition-transform" />
            {article.newsletterTitle}
          </Link>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={handleShare} className="flex items-center">
              <Share2 size={16} className="mr-1 text-primary" />
              Share
            </Button>

            {isAuthor && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                className="text-destructive hover:text-destructive/90 flex items-center"
                disabled={deleting}
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Trash2 size={16} className="mr-1" />
                    Delete
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold mb-4 relative">
          {article.title}
          <span className="absolute -top-2 -left-4 text-primary/20">
            <Sparkles size={20} />
          </span>
        </h1>

        <div className="flex items-center space-x-4 text-muted-foreground mb-8">
          <div className="flex items-center">
            <User className="w-4 h-4 mr-1 text-primary" />
            <span>{article.authorName}</span>
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-primary" />
            <span>{new Date(article.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <Card className="p-8 mb-8 shadow-md border-border/50 rounded-xl overflow-hidden relative">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-bl-full -z-10"></div>
        <div className="prose dark:prose-invert max-w-none">
          {article.content
            .split("\n")
            .map((paragraph, index) => (paragraph ? <p key={index}>{paragraph}</p> : <br key={index} />))}
        </div>
      </Card>

      <div className="flex justify-between items-center">
        <Link to={`/newsletter/${article.newsletterId}`}>
          <Button variant="outline" className="group border-primary/50 hover:border-primary">
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Newsletter
          </Button>
        </Link>
      </div>
    </div>
  )
}

