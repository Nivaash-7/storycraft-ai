"use client"

import { useState, useEffect } from "react"

export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState<boolean>(true)
  const [showAITour, setShowAITour] = useState<boolean>(false)

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding")
    if (hasSeenOnboarding) {
      setShowOnboarding(false)
    }
  }, [])

  return {
    showOnboarding,
    setShowOnboarding,
    showAITour,
    setShowAITour,
  }
}
