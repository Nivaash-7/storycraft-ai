"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MessageSquare, Wand, FileText, Sparkles, Save } from "lucide-react"
import ai_image from "@/assets/ai.png"

interface AITourDialogProps {
  showAITour: boolean
  setShowAITour: (show: boolean) => void
  openAIAssistant: (tab?: string) => void
}

export function AITourDialog({ showAITour, setShowAITour, openAIAssistant }: AITourDialogProps) {
  return (
    <Dialog open={showAITour} onOpenChange={setShowAITour}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Image
              src={ai_image || "/placeholder.svg"}
              alt="TaleWeaver AI Assistant"
              width={24}
              height={24}
              className="rounded-full"
            />
            TaleWeaver AI Features Guide
          </DialogTitle>
          <DialogDescription>Learn how to use AI to enhance your writing experience</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">
                1
              </span>
              Access AI Features
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                Click on TaleWeaver&apos;s avatar in the bottom right corner to open the AI assistant.
              </p>
              <p className="text-sm text-muted-foreground">
                You can also use the quick action buttons in the story editor toolbar.
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">
                2
              </span>
              Choose Your AI Mode
            </h3>
            <div className="ml-8 grid grid-cols-1 gap-3">
              <div className="flex items-start gap-2">
                <MessageSquare className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Chat Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Discuss story ideas, ask questions about writing techniques, or just chat about your creative process.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Wand className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Generate Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Describe a scene, character, or plot you&apos;d like to add to your story. AI will generate content you
                    can insert.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <FileText className="w-4 h-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Feedback Mode</p>
                  <p className="text-xs text-muted-foreground">
                    Ask for specific feedback on your story&apos;s pacing, characters, dialogue, or overall structure.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium flex items-center gap-2">
              <span className="bg-primary/10 text-primary w-6 h-6 rounded-full flex items-center justify-center text-sm">
                3
              </span>
              Using Generated Content
            </h3>
            <div className="ml-8 space-y-2">
              <p className="text-sm text-muted-foreground">
                When the AI generates story content, click the &quot;Edit &amp; Use&quot; button to customize it before adding to your
                story.
              </p>
              <p className="text-sm text-muted-foreground">
                You can edit the generated text in the popup dialog and then insert it into your story.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAITour(false)} className="cursor-pointer">
            Close
          </Button>
          <Button
            onClick={() => {
              setShowAITour(false)
              openAIAssistant()
            }}
            className="bg-primary hover:bg-primary/90 cursor-pointer"
          >
            Try AI Assistant Now
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface AutosaveWarningDialogProps {
  showAutosaveWarning: boolean
  setShowAutosaveWarning: (show: boolean) => void
}

export function AutosaveWarningDialog({ showAutosaveWarning, setShowAutosaveWarning }: AutosaveWarningDialogProps) {
  return (
    <Dialog open={showAutosaveWarning} onOpenChange={setShowAutosaveWarning}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="w-5 h-5 text-primary" />
            Enable Autosave
          </DialogTitle>
          <DialogDescription>Autosave requires a title and genre.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            To use the autosave feature, please provide a story title and select a genre. Autosave will automatically
            save your draft every 5 minutes.
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => setShowAutosaveWarning(false)}
              className="bg-primary hover:bg-primary/90 cursor-pointer"
            >
              Got It
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

interface OnboardingDialogProps {
  showOnboarding: boolean
  setShowOnboarding: (show: boolean) => void
}

export function OnboardingDialog({ showOnboarding, setShowOnboarding }: OnboardingDialogProps) {
  const dismissOnboarding = () => {
    setShowOnboarding(false)
    localStorage.setItem("hasSeenOnboarding", "true")
  }

  return (
    <Dialog open={showOnboarding} onOpenChange={setShowOnboarding}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Sparkles className="w-5 h-5 text-primary" />
            Welcome to StoryCraft AI!
          </DialogTitle>
          <DialogDescription>Let&apos;s get you started with creating amazing stories using AI</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex items-start gap-4 p-4 rounded-lg border border-border">
            <div className="flex-shrink-0">
              <Image
                src={ai_image || "/placeholder.svg"}
                alt="TaleWeaver AI Assistant"
                width={50}
                height={50}
                className="rounded-full border border-primary/20"
              />
            </div>
            <div>
              <h3 className="font-medium mb-1">Meet TaleWeaver, Your AI Writing Assistant</h3>
              <p className="text-sm text-muted-foreground">
                TaleWeaver is here to help you create amazing stories. Click on the avatar in the bottom right corner
                anytime you need assistance.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Chat</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Discuss ideas and get writing advice from your AI assistant
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <Wand className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Generate</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Create story snippets, characters, or scenes to add to your story
              </p>
            </div>
            <div className="p-4 rounded-lg border border-border">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-primary" />
                <h4 className="font-medium">Feedback</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Get constructive feedback on your writing to improve your story
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={dismissOnboarding} className="bg-primary hover:bg-primary/90 cursor-pointer">
            Get Started
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

interface SaveDialogProps {
  isSaveDialogOpen: boolean
  setIsSaveDialogOpen: (isOpen: boolean) => void
  handleSaveChoice: (status: "Draft" | "Published") => void
  isSubmitting: boolean
}

export function SaveDialog({
  isSaveDialogOpen,
  setIsSaveDialogOpen,
  handleSaveChoice,
  isSubmitting,
}: SaveDialogProps) {
  return (
    <Dialog open={isSaveDialogOpen} onOpenChange={setIsSaveDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Save className="w-5 h-5 text-primary" />
            Save Your Story
          </DialogTitle>
          <DialogDescription>Choose how you&apos;d like to save your story.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground mb-4">
            Would you like to publish your story to share it with others, or save it as a draft to continue working on
            it later?
          </p>
          <div className="flex flex-col gap-2">
            <Button
              onClick={() => handleSaveChoice("Published")}
              className="bg-primary hover:bg-primary/90 cursor-pointer"
              disabled={isSubmitting}
            >
              <span className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                Publish
              </span>
            </Button>
            <Button
              onClick={() => handleSaveChoice("Draft")}
              variant="outline"
              className="border-border hover:bg-muted cursor-pointer"
              disabled={isSubmitting}
            >
              <span className="flex items-center gap-1">
                <Save className="w-4 h-4" />
                Save as Draft
              </span>
            </Button>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => setIsSaveDialogOpen(false)}
            disabled={isSubmitting}
            className="cursor-pointer"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}