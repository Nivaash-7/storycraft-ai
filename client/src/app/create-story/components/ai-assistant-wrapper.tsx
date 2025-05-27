"use client"

import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import AIAssistant from "@/components/ai-assistant"
import ai_image from "@/assets/ai.png"
import { useIsMobile } from "@/hooks/use-mobile"

interface AIAssistantWrapperProps {
  isAIChatOpen: boolean
  setIsAIChatOpen: (isOpen: boolean) => void
  showTaleWeaverIntro: boolean
  dismissTaleWeaverIntro: () => void
  taleWeaverMessage: string
  isClicked: boolean
  setIsClicked: (isClicked: boolean) => void
  showAIFeatureHighlight: boolean
  openAIAssistant: (tab?: string) => void
  title: string
  genre: string
  storyContent: string
  setStoryContent: React.Dispatch<React.SetStateAction<string>>
  activeAITab: string
}

export default function AIAssistantWrapper({
  isAIChatOpen,
  setIsAIChatOpen,
  showTaleWeaverIntro,
  dismissTaleWeaverIntro,
  taleWeaverMessage,
  isClicked,
  showAIFeatureHighlight,
  openAIAssistant,
  title,
  genre,
  storyContent,
  setStoryContent,
  activeAITab,
}: AIAssistantWrapperProps) {
  const isMobile = useIsMobile()

  if (isMobile) {
    return (
      <AIAssistant
        isOpen={isAIChatOpen}
        setIsOpen={setIsAIChatOpen}
        title={title}
        genre={genre}
        storyContent={storyContent}
        setStoryContent={setStoryContent}
        initialTab={activeAITab}
      />
    )
  }

  return (
    <>
      <AnimatePresence>
        {showTaleWeaverIntro && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{
              duration: 0.3,
              type: "spring",
              stiffness: 500,
              damping: 30,
            }}
            className="fixed bottom-24 right-6 z-50 flex flex-col items-end"
          >
            <div className="TaleWeaver-bubble bg-background border border-border rounded-2xl p-4 shadow-lg max-w-[240px] mb-3">
              <div className="text-center">
                <p className="text-base font-medium mb-1">Hey</p>
                <p className="text-lg font-bold text-primary">I am TaleWeaver</p>
                <p className="text-sm text-muted-foreground mt-1">Your AI writing assistant</p>
              </div>
              <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r border-b border-border transform rotate-45"></div>
            </div>
            <div className="flex justify-end">
              <button
                onClick={() => openAIAssistant()}
                className="relative group cursor-pointer"
                aria-label="Open AI Assistant"
              >
                <div className="absolute inset-0 rounded-full bg-primary/20 group-hover:bg-primary/30 animate-ping-slow opacity-75"></div>
                <div className="relative">
                  <Image
                    src={ai_image || "/placeholder.svg"}
                    alt="TaleWeaver AI Assistant"
                    width={70}
                    height={70}
                    className="rounded-full border-2 border-primary shadow-lg transition-transform group-hover:scale-105 animate-breathing"
                  />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isAIChatOpen && !showTaleWeaverIntro && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col items-end"
          >
            <AnimatePresence>
              {taleWeaverMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.9 }}
                  transition={{
                    duration: 0.3,
                    type: "spring",
                    stiffness: 500,
                    damping: 30,
                  }}
                  className="TaleWeaver-message-bubble bg-background border border-border rounded-2xl p-3 shadow-lg max-w-[200px] mb-3 cursor-pointer"
                  onClick={() => openAIAssistant()}
                >
                  <p className="text-sm text-foreground">{taleWeaverMessage}</p>
                  <div className="absolute -bottom-2 right-6 w-4 h-4 bg-background border-r border-b border-border transform rotate-45"></div>
                </motion.div>
              )}
            </AnimatePresence>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <motion.div
                    className="relative"
                    whileHover={{ rotateY: 360 }}
                    transition={{ duration: 1, ease: "easeInOut" }}
                    onClick={() => openAIAssistant()}
                  >
                    <motion.div
                      className="absolute inset-0 rounded-full bg-neon-glow animate-pulse-neon"
                      style={{ zIndex: -1 }}
                    />
                    <Button
                      className="p-0 rounded-full h-16 w-16 bg-transparent shadow-2xl flex items-center justify-center overflow-hidden border-4 border-transparent cursor-pointer"
                      style={{
                        background: "linear-gradient(45deg, #ff6347, #ff4500, #ff6347)",
                        backgroundSize: "200% 200%",
                        animation: "gradientShift 5s ease infinite",
                      }}
                    >
                      <motion.div
                        className="relative"
                        animate={
                          isClicked
                            ? {
                                scale: [1, 1.2, 1],
                                rotate: [0, 360, 0],
                              }
                            : {}
                        }
                        transition={{ duration: 0.5 }}
                      >
                        <Image
                          src={ai_image}
                          alt="TaleWeaver AI Assistant"
                          width={60}
                          height={60}
                          className="rounded-full transition-all duration-300 hover:brightness-110 animate-breathing"
                        />
                        {showAIFeatureHighlight && (
                          <motion.span
                            className="absolute -top-3 -right-3 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center"
                            animate={{
                              scale: [1, 1.5, 1],
                              opacity: [1, 0.5, 1],
                            }}
                            transition={{
                              duration: 1.5,
                              repeat: Number.POSITIVE_INFINITY,
                            }}
                          >
                            !
                          </motion.span>
                        )}
                      </motion.div>
                    </Button>
                  </motion.div>
                </TooltipTrigger>
                <TooltipContent
                  side="left"
                  className="bg-primary/80 text-white p-2 rounded-md shadow-lg transform transition-all duration-300"
                  style={{ transformOrigin: "right" }}
                >
                  <motion.div
                    initial={{ x: 20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                  >
                    Chat with TaleWeaver, your AI Assistant
                  </motion.div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </motion.div>
        )}
      </AnimatePresence>

      <AIAssistant
        isOpen={isAIChatOpen}
        setIsOpen={setIsAIChatOpen}
        title={title}
        genre={genre}
        storyContent={storyContent}
        setStoryContent={setStoryContent}
        initialTab={activeAITab}
      />
    </>
  )
}
