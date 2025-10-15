"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useAuth } from "@clerk/nextjs"

export function useStoryActions() {
  const router = useRouter()
  const { getToken, userId } = useAuth()
  const [title, setTitle] = useState<string>("")
  const [genre, setGenre] = useState<string>("")
  const [wordCountGoal, setWordCountGoal] = useState<number>(0)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [wordCount, setWordCount] = useState<number>(0)
  const [storyContent, setStoryContent] = useState<string>("")
  const [storyId, setStoryId] = useState<string | null>(null)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState<boolean>(false)
  const [showAutosaveWarning, setShowAutosaveWarning] = useState<boolean>(false)
  const [hasShownAutosaveWarning, setHasShownAutosaveWarning] = useState<boolean>(false)

  const updateWordCount = useCallback((content: string) => {
    const words = content.split(/\s+/).filter(Boolean).length
    setWordCount(words)
  }, [])

  const generateSummary = useCallback(async (content: string) => {
    try {
      const token = await getToken()
      if (!token) throw new Error("User not authenticated")

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode: "summary",
          storyContent: content,
          genre: genre || "Unknown",
        }),
      })

      if (!response.ok) {
        const text = await response.text()
        console.error("Raw response:", text)
        const errorData = await response.json().catch(() => ({ error: text }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const text = await response.text()
      try {
        const data = JSON.parse(text)
        return data.content || "A brief tale unfolds."
      } catch {
        console.error("Invalid JSON response:", text)
        throw new Error("Invalid response format from server")
      }
    } catch (error: unknown) {
      console.error("Error generating summary:", error)
      const message = error instanceof Error ? error.message : "Failed to generate summary."
      toast.error("Error", {
        description: message,
      })
      return "A brief tale unfolds."
    }
  }, [getToken, genre])

  const saveStory = useCallback(
    async (isAutosave = false, userId: string, status: "Draft" | "Published" = "Draft") => {
      if (!storyContent.trim() || !title.trim() || !genre.trim()) {
        if (!isAutosave) {
          toast.error("Missing Info", {
            description: "Please provide a title, genre, and story content.",
          })
        }
        return null
      }

      const token = await getToken()
      if (!token) {
        toast.error("Authentication Error", {
          description: "Please sign in to save your story.",
        })
        return null
      }

      const description = await generateSummary(storyContent)
      const storyData = {
        userId,
        title,
        genre,
        content: storyContent,
        description,
        status,
        wordCount: storyContent.split(/\s+/).filter(Boolean).length,
        lastEdited: new Date().toISOString(),
      }

      try {
        const url = storyId ? `/api/stories/${storyId}` : "/api/stories"
        const method = storyId ? "PATCH" : "POST"

        const response = await fetch(url, {
          method,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(storyData),
        })

        if (!response.ok) {
          const text = await response.text()
          console.error("Raw response:", text)
          const errorData = await response.json().catch(() => ({ error: text }))
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
        }

        const savedStory = await response.json()
        if (!storyId) {
          setStoryId(savedStory._id)
        }
        return savedStory
      } catch (error: unknown) {
        console.error("Error saving story:", error)
        const message = error instanceof Error ? error.message : "Failed to save story."
        toast.error("Error", {
          description: message,
        })
        return null
      }
    },
    [storyContent, title, genre, storyId, getToken, generateSummary, setStoryId]
  )

  const handleSubmit = async () => {
    if (!userId) {
      toast.error("Authentication Error", {
        description: "User ID is required to save the story.",
      })
      return
    }
    setIsSaveDialogOpen(true)
  }

  const handleSaveChoice = async (status: "Draft" | "Published") => {
    setIsSubmitting(true)
    setIsSaveDialogOpen(false)

    if (!userId) {
      toast.error("Authentication Error", {
        description: "User ID is required to save the story.",
      })
      setIsSubmitting(false)
      return
    }

    const savedStory = await saveStory(false, userId, status)

    if (savedStory) {
      setTimeout(() => {
        setIsSubmitting(false)
        router.push("/dashboard")
        toast.success(`Story ${status === "Published" ? "Published" : "Saved"}`, {
          description: `Your story has been ${
            status === "Published" ? "published" : "saved as a draft"
          } with an AI-generated summary!`,
        })
      }, 1000)
    } else {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const autosave = setInterval(
      async () => {
        if (storyContent.trim() && title.trim() && genre.trim()) {
          const savedStory = await saveStory(true, userId || "", "Draft")
          if (savedStory) {
            toast.success("Draft autosaved", {
              description: "Your story and summary have been updated!",
            })
          }
        } else if (storyContent.trim() && !hasShownAutosaveWarning) {
          setShowAutosaveWarning(true)
          setHasShownAutosaveWarning(true)
        }
      },
      5 * 60 * 1000
    )
    return () => clearInterval(autosave)
  }, [storyContent, title, genre, storyId, userId, hasShownAutosaveWarning, saveStory])

  return {
    title,
    setTitle,
    genre,
    setGenre,
    wordCountGoal,
    setWordCountGoal,
    isSubmitting,
    setIsSubmitting,
    wordCount,
    setWordCount,
    storyContent,
    setStoryContent,
    storyId,
    setStoryId,
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    showAutosaveWarning,
    setShowAutosaveWarning,
    hasShownAutosaveWarning,
    setHasShownAutosaveWarning,
    updateWordCount,
    generateSummary,
    saveStory,
    handleSubmit,
    handleSaveChoice,
  }
}