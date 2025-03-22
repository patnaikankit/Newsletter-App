"use client"

import { useCallback } from "react"
import { useAxios } from "./useAxios"

interface NewsletterData {
  title: string
  description: string
  frequency: string
  category: string
}

interface ArticleData {
  title: string
  content: string
  excerpt: string
  newsletterId: string
}

export const useNewsletter = () => {
  const { axiosInstance } = useAxios()

  const getNewsletters = useCallback(async () => {
    const response = await axiosInstance.get("/api/newsletters")
    return response.data.newsletters
  }, [axiosInstance])

  const getUserNewsletters = useCallback(async () => {
    const response = await axiosInstance.get("/api/newsletters/user")
    return response.data.newsletters
  }, [axiosInstance])

  const getNewsletter = useCallback(
    async (id: string) => {
      const response = await axiosInstance.get(`/api/newsletters/${id}`)
      return response.data.newsletter
    },
    [axiosInstance],
  )

  const createNewsletter = useCallback(
    async (data: NewsletterData) => {
      const response = await axiosInstance.post("/api/newsletters", data)
      return response.data.id
    },
    [axiosInstance],
  )

  const getNewsletterArticles = useCallback(
    async (newsletterId: string) => {
      const response = await axiosInstance.get(`/api/newsletters/${newsletterId}/articles`)
      return response.data.articles
    },
    [axiosInstance],
  )

  const getArticle = useCallback(
    async (id: string) => {
      const response = await axiosInstance.get(`/api/articles/${id}`)
      return response.data.article
    },
    [axiosInstance],
  )

  const createArticle = useCallback(
    async (data: ArticleData) => {
      const response = await axiosInstance.post("/api/articles", data)
      return response.data.id
    },
    [axiosInstance],
  )

  const deleteArticle = useCallback(
    async (id: string) => {
      await axiosInstance.delete(`/api/articles/${id}`)
    },
    [axiosInstance],
  )

  const subscribeToNewsletter = useCallback(
    async (newsletterId: string) => {
      await axiosInstance.post(`/api/newsletters/${newsletterId}/subscribe`)
    },
    [axiosInstance],
  )

  const unsubscribeFromNewsletter = useCallback(
    async (newsletterId: string) => {
      await axiosInstance.post(`/api/newsletters/${newsletterId}/unsubscribe`)
    },
    [axiosInstance],
  )

  const subscribeToNewsletters = useCallback(
    async (newsletterIds: string[], email: string) => {
      await axiosInstance.post("/api/newsletters/subscribe-multiple", {
        newsletterIds,
        email,
      })
    },
    [axiosInstance],
  )

  return {
    getNewsletters,
    getUserNewsletters,
    getNewsletter,
    createNewsletter,
    getNewsletterArticles,
    getArticle,
    createArticle,
    deleteArticle,
    subscribeToNewsletter,
    unsubscribeFromNewsletter,
    subscribeToNewsletters,
  }
}

