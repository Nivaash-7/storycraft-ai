"use client"

import { useState, useEffect } from "react"
import { toast } from "sonner"
import { useIsMobile } from "@/hooks/use-mobile"

export function useAIAssistant(storyContent: string, setStoryContent: (content: string) => void) {
  const isMobile = useIsMobile()
  const [isAIChatOpen, setIsAIChatOpen] = useState<boolean>(false)
  const [showAIFeatureHighlight, setShowAIFeatureHighlight] = useState<boolean>(true)
  const [hasInteractedWithAI, setHasInteractedWithAI] = useState<boolean>(false)
  const [activeAITab, setActiveAITab] = useState<string>("chat")
  const [showTaleWeaverIntro, setShowTaleWeaverIntro] = useState<boolean>(true)
  const [taleWeaverMessage, setTaleWeaverMessage] = useState<string>("")
  const [isClicked, setIsClicked] = useState<boolean>(false)

  const taleWeaverMessages = [
    "Need a plot twist? I can help spark some ideas!",
    "Stuck on a scene? Let's brainstorm together!",
    "Want feedback on your story? I'm here for you!",
    "Let's create a new character for your adventure!",
    "Feeling inspired? I can generate a scene to keep you going!",
  ]

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")

    const hasUsedAI = localStorage.getItem("hasUsedAI")
    if (hasUsedAI) {
      setShowAIFeatureHighlight(false)
      setHasInteractedWithAI(true)
    }

    const hasSeenTaleWeaverIntro = localStorage.getItem("hasSeenTaleWeaverIntro")
    if (hasSeenTaleWeaverIntro) {
      setShowTaleWeaverIntro(false)
    } else if (!isMobile) {
      const timer = setTimeout(() => {
        setShowTaleWeaverIntro(true)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isMobile])

  useEffect(() => {
    if (!isMobile && !isAIChatOpen && !showTaleWeaverIntro) {
      const messageInterval = setInterval(() => {
        const randomIndex = Math.floor(Math.random() * taleWeaverMessages.length)
        const newMessage = taleWeaverMessages[randomIndex]
        setTaleWeaverMessage(newMessage)
        setTimeout(() => {
          setTaleWeaverMessage("")
        }, 4500)
      }, 5000)
      return () => clearInterval(messageInterval)
    }
  }, [isMobile, isAIChatOpen, showTaleWeaverIntro])

  const dismissTaleWeaverIntro = () => {
    setShowTaleWeaverIntro(false)
    localStorage.setItem("hasSeenTaleWeaverIntro", "true")
  }

  const openAIAssistant = (tab = "chat") => {
    if (isMobile) return
    setIsClicked(true)
    setTimeout(() => setIsClicked(false), 1000)
    setActiveAITab(tab)
    setIsAIChatOpen(true)
    setShowAIFeatureHighlight(false)
    setHasInteractedWithAI(true)
    localStorage.setItem("hasUsedAI", "true")
    dismissTaleWeaverIntro()
    setTaleWeaverMessage("")
  }

  useEffect(() => {
    if (!isMobile && !hasInteractedWithAI && storyContent.length > 0) {
      let typingTimer: NodeJS.Timeout
      const resetTimer = () => {
        clearTimeout(typingTimer)
        typingTimer = setTimeout(() => {
          setShowAIFeatureHighlight(true)
          toast.info("Need help?", {
            description: "Try our AI assistant for ideas or feedback!",
            action: {
              label: "Open Assistant",
              onClick: () => openAIAssistant(),
            },
          })
        }, 30000)
      }
      resetTimer()
      const handleUserActivity = () => resetTimer()
      window.addEventListener("keydown", handleUserActivity)
      window.addEventListener("mousemove", handleUserActivity)
      return () => {
        clearTimeout(typingTimer)
        window.removeEventListener("keydown", handleUserActivity)
        window.removeEventListener("mousemove", handleUserActivity)
      }
    }
  }, [isMobile, storyContent, hasInteractedWithAI])

  return {
    isAIChatOpen,
    setIsAIChatOpen,
    showAIFeatureHighlight,
    setShowAIFeatureHighlight,
    hasInteractedWithAI,
    setHasInteractedWithAI,
    activeAITab,
    setActiveAITab,
    showTaleWeaverIntro,
    setShowTaleWeaverIntro,
    taleWeaverMessage,
    setTaleWeaverMessage,
    isClicked,
    setIsClicked,
    openAIAssistant,
    dismissTaleWeaverIntro,
  }
}
