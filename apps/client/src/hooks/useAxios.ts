"use client"

import { useMemo } from "react"
import axios from "axios"

export const useAxios = () => {
  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000",
      headers: {
        "Content-Type": "application/json",
      },
    })

    // Add auth token to requests
    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("authToken")
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => Promise.reject(error),
    )

    // Handle token expiration
    instance.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("authToken")
          window.location.href = "/auth/login"
        }
        return Promise.reject(error)
      },
    )

    return instance
  }, [])

  return { axiosInstance }
}

