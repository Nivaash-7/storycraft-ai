"use client"

import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/nextjs"
import { Toaster } from "sonner"
import { ModernSidebar } from "@/components/ModernSidebar"
import StoryEditor from "./components/StoryEditor"
import StoryHeader from "./components/StoryHeader"
import StoryMetadataForm from "./components/StoryForm"
import AIAssistantWrapper from "./components/ai-assistant-wrapper"
import { useStoryActions } from "./hooks/use-story-action"
import { useAIAssistant } from "./hooks/use-ai-assistant"
import { useOnboarding } from "./hooks/use-onboarding"
import MobileDeviceCheck from "@/hooks/mobile-device-check"
import { OnboardingDialog, AITourDialog, SaveDialog, AutosaveWarningDialog } from "./components/Dialogs"
import './create-story.css'

export default function CreateStory() {
  const {
    title,
    setTitle,
    genre,
    setGenre,
    wordCountGoal,
    setWordCountGoal,
    storyContent,
    setStoryContent,
    wordCount,
    isSubmitting,
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    showAutosaveWarning,
    setShowAutosaveWarning,
    handleSubmit,
    handleSaveChoice,
    updateWordCount,
  } = useStoryActions()

  const {
    isAIChatOpen,
    setIsAIChatOpen,
    activeAITab,
    showAIFeatureHighlight,
    taleWeaverMessage,
    isClicked,
    setIsClicked,
    showTaleWeaverIntro,
    openAIAssistant,
    dismissTaleWeaverIntro,
  } = useAIAssistant(storyContent)

  const { showOnboarding, setShowOnboarding, showAITour, setShowAITour } = useOnboarding()

  return (
    <>
      <Toaster position="top-center" richColors />
      <ModernSidebar>
        <SignedIn>
          <div
            className="main-container h-screen flex items-center justify-center mx-auto max-w-4xl"
          >
            <MobileDeviceCheck />

            <StoryHeader
              wordCount={wordCount}
              isSubmitting={isSubmitting}
              title={title}
              genre={genre}
              handleSubmit={handleSubmit}
              setShowAITour={setShowAITour}
            />

            <div className="content-container w-full">
              <StoryMetadataForm
                title={title}
                setTitle={setTitle}
                genre={genre}
                setGenre={setGenre}
                wordCountGoal={wordCountGoal}
                setWordCountGoal={setWordCountGoal}
                wordCount={wordCount}
              />

              <StoryEditor
                storyContent={storyContent}
                setStoryContent={setStoryContent}
                updateWordCount={updateWordCount}
                openAIAssistant={openAIAssistant}
              />
            </div>

            <AIAssistantWrapper
              isAIChatOpen={isAIChatOpen}
              setIsAIChatOpen={setIsAIChatOpen}
              showTaleWeaverIntro={showTaleWeaverIntro}
              dismissTaleWeaverIntro={dismissTaleWeaverIntro}
              taleWeaverMessage={taleWeaverMessage}
              isClicked={isClicked}
              setIsClicked={setIsClicked}
              showAIFeatureHighlight={showAIFeatureHighlight}
              openAIAssistant={openAIAssistant}
              title={title}
              genre={genre}
              storyContent={storyContent}
              setStoryContent={setStoryContent}
              activeAITab={activeAITab}
            />

            <OnboardingDialog showOnboarding={showOnboarding} setShowOnboarding={setShowOnboarding} />

            <AITourDialog showAITour={showAITour} setShowAITour={setShowAITour} openAIAssistant={openAIAssistant} />

            <SaveDialog
              isSaveDialogOpen={isSaveDialogOpen}
              setIsSaveDialogOpen={setIsSaveDialogOpen}
              handleSaveChoice={handleSaveChoice}
              isSubmitting={isSubmitting}
            />

            <AutosaveWarningDialog
              showAutosaveWarning={showAutosaveWarning}
              setShowAutosaveWarning={setShowAutosaveWarning}
            />
          </div>
        </SignedIn>
        <SignedOut>
          <RedirectToSignIn />
        </SignedOut>
      </ModernSidebar>
    </>
  )
}