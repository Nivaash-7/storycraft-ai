"use client"
import { useState, useEffect } from "react"
import { toast, Toaster } from "sonner"
import Community from "./components/Community"
import { Story } from "@/lib/models"

export default function CommunityPage() {
  const [stories, setStories] = useState<Story[]>([])
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/stories/published")
        if (!response.ok) {
          throw new Error(`Failed to fetch stories: ${response.status}`)
        }
        const data = await response.json()
        setStories(data)
      } catch (err) {
        console.error("Error fetching stories:", err)
        setError("Failed to load stories. Please try again.")
        toast.error("Failed to load stories. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  return (
    <div className="min-h-screen bg-background mx-auto max-w-8xl">
      <Toaster
        richColors
        position="top-right"
        toastOptions={{
          style: {
            background: "hsl(var(--card))",
            color: "hsl(var(--foreground))",
            border: "1px solid hsl(var(--border))",
          },
        }}
      />
      <Community
        stories={stories}
        loading={loading}
        error={error}
        setStories={setStories}
      />
    </div>
  )
}