"use client";

import React from "react";
import {
  AIAssistantProps,
  AIMessage,
  MessageTab,
} from "@/hooks/useAIAssistant"; // Updated import
import { useAIAssistant } from "@/hooks/useAIAssistant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Send,
  Sparkles,
  X,
  MessageSquare,
  Wand,
  FileText,
  HelpCircle,
  Trash2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import ai_image from "@/assets/ai.png";

export default function AIAssistant({
  isOpen,
  setIsOpen,
  storyContent,
  setStoryContent,
  title,
  genre,
  className,
  initialTab = "chat",
}: AIAssistantProps) {
  const {
    messages,
    input,
    setInput,
    activeTab,
    setActiveTab,
    isLoading,
    isModalOpen,
    setIsModalOpen,
    modalContent,
    setModalContent,
    editedSuggestion,
    setEditedSuggestion,
    setOriginalSuggestion,
    feedback,
    isConfirmDialogOpen,
    setIsConfirmDialogOpen,
    showTutorial,
    setShowTutorial,
    scrollAreaRef,
    inputRef,
    tabInstructions,
    handleChatSubmit,
    handleModalClose,
    insertSuggestion,
    clearGenerateHistory,
    handleClarificationResponse,
    handleKeyDown,
  } = useAIAssistant({
    isOpen,
    setIsOpen,
    storyContent,
    setStoryContent,
    title,
    genre,
    initialTab,
  });

  if (!isOpen) return null;

  const tabIcons = {
    chat: <MessageSquare className="h-4 w-4" />,
    generate: <Wand className="h-4 w-4" />,
    feedback: <FileText className="h-4 w-4" />,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <Card
        className={cn(
          "w-full max-w-3xl h-[80vh] flex flex-col shadow-xl",
          className
        )}
      >
        {/* Card Header */}
        <CardHeader className="flex flex-row items-center p-4 space-y-0 border-b">
          <div className="flex items-center gap-2">
            <Image
              src={ai_image}
              alt="TaleWeaver AI Assistant"
              width={28}
              height={28}
              className="rounded-full"
            />
            <h2 className="text-lg font-semibold">
              TaleWeaver AI Writing Assistant
            </h2>
          </div>
          <div className="ml-auto flex items-center gap-2">
            {activeTab === "generate" && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full w-8 h-8 cursor-pointer"
                      onClick={clearGenerateHistory}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Clear Generate History</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 cursor-pointer"
                    onClick={() => setShowTutorial(true)}
                  >
                    <HelpCircle className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>How to use</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full w-8 h-8 cursor-pointer"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Close</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        {/* Tabs */}
        <div className="border-b">
          <div className="flex">
            {(["chat", "generate", "feedback"] as MessageTab[]).map((tab) => (
              <button
                key={tab}
                className={cn(
                  "flex items-center justify-center gap-2 py-3 px-6 text-sm font-medium flex-1 transition-colors cursor-pointer",
                  activeTab === tab
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                )}
                onClick={() => setActiveTab(tab)}
                disabled={isLoading}
              >
                {tabIcons[tab]} {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Messages */}
        <CardContent className="flex-1 p-0 overflow-hidden">
          <div
            ref={scrollAreaRef}
            role="log"
            aria-live="polite"
            aria-label="Chat conversation"
            className="h-full overflow-y-auto p-0 touch-auto scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#FF634780 #2D2D2D80",
            }}
          >
            <div className="px-4 py-4 flex flex-col gap-4">
              <div className="flex justify-center">
                <div className="px-4 py-3 border border-primary/20 bg-primary/5 rounded-lg flex items-start gap-3 max-w-[90%]">
                  {activeTab === "chat" && (
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                  )}
                  {activeTab === "generate" && (
                    <Wand className="h-5 w-5 text-primary mt-0.5" />
                  )}
                  {activeTab === "feedback" && (
                    <FileText className="h-5 w-5 text-primary mt-0.5" />
                  )}
                  <div>
                    <h3 className="font-medium text-sm text-foreground mb-1">
                      {activeTab === "chat" && "Chat Mode"}
                      {activeTab === "generate" && "Generate Mode"}
                      {activeTab === "feedback" && "Feedback Mode"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {tabInstructions[activeTab]}
                    </p>
                    {activeTab === "generate" && (
                      <p className="text-xs text-primary/80 mt-1">
                        Tip: Generated content will have an &quot;Edit &amp;
                        Use&quot; button to customize before adding to your
                        story.
                      </p>
                    )}
                    {activeTab === "feedback" && storyContent.length === 0 && (
                      <p className="text-xs text-amber-500 mt-1">
                        Note: You need to write some content in your story first
                        to get feedback.
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {messages[activeTab].map((message: AIMessage, index: number) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex flex-col gap-2 rounded-lg px-4 py-3 break-words",
                    message.role === "user"
                      ? "ml-auto bg-primary text-primary-foreground self-end max-w-[80%]"
                      : "self-start max-w-[80%] bg-muted",
                    message.isInsertable === false ? "opacity-70" : "",
                    message.isClarification
                      ? "bg-yellow-100 border border-yellow-300 shadow-sm"
                      : ""
                  )}
                >
                  {message.role === "assistant" && index > 0 && (
                    <div className="flex items-center gap-2 mb-1">
                      <Image
                        src={ai_image}
                        alt="TaleWeaver"
                        width={20}
                        height={20}
                        className="rounded-full"
                      />
                      <span className="text-xs font-medium text-primary">
                        TaleWeaver
                      </span>
                    </div>
                  )}
                  <p
                    className={cn(
                      "text-sm whitespace-pre-line break-words",
                      message.isClarification ? "font-medium text-gray-800" : ""
                    )}
                  >
                    {message.content}
                  </p>
                  {message.isInsertable && (
                    <Button
                      onClick={() => {
                        setEditedSuggestion(message.content);
                        setOriginalSuggestion(message.content);
                        setModalContent("suggestion");
                        setIsModalOpen(true);
                      }}
                      variant="link"
                      size="sm"
                      className="mt-1 h-auto p-0 text-xs self-start cursor-pointer"
                    >
                      Edit &amp; Use
                    </Button>
                  )}
                  {message.isClarification && (
                    <div className="flex gap-2 mt-2">
                      <Button
                        onClick={() =>
                          handleClarificationResponse(message.id, true)
                        }
                        variant="default"
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white cursor-pointer"
                        disabled={isLoading}
                      >
                        Yes
                      </Button>
                      <Button
                        onClick={() =>
                          handleClarificationResponse(message.id, false)
                        }
                        variant="default"
                        size="sm"
                        className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        disabled={isLoading}
                      >
                        No
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex flex-col gap-2 rounded-lg bg-muted px-4 py-3 self-start max-w-[80%]">
                  <div className="flex items-center gap-2 mb-1">
                    <Image
                      src={ai_image}
                      alt="TaleWeaver"
                      width={20}
                      height={20}
                      className="rounded-full"
                    />
                    <span className="text-xs font-medium text-primary">
                      TaleWeaver is typing...
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.2s]"></div>
                    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/50 [animation-delay:0.4s]"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        {/* Input */}
        <CardFooter className="border-t p-4">
          <form
            onSubmit={handleChatSubmit}
            className="flex w-full items-center gap-2"
          >
            <Input
              ref={inputRef}
              placeholder={
                activeTab === "chat"
                  ? "Ask TaleWeaver anything..."
                  : activeTab === "generate"
                  ? "Describe what to generate..."
                  : "Ask for feedback..."
              }
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Type your message"
              className="flex-1 bg-background/30 border-primary/30 focus:border-primary rounded-md"
              disabled={isLoading}
            />
            <Button
              type="submit"
              size="icon"
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
              className="bg-primary hover:bg-primary/90 flex-shrink-0 w-10 h-10 rounded-md cursor-pointer"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        </CardFooter>
      </Card>

      {/* Edit Modal */}
      {isModalOpen && (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Image
                  src={ai_image}
                  alt="TaleWeaver"
                  width={24}
                  height={24}
                  className="rounded-full"
                />
                {modalContent === "feedback"
                  ? "Story Feedback"
                  : "Edit Story Idea"}
              </DialogTitle>
              {modalContent === "suggestion" && (
                <DialogDescription>
                  Edit your story snippet before adding it to your draft
                </DialogDescription>
              )}
            </DialogHeader>
            <div
              className="flex-1 overflow-y-auto my-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "#FF634780 #2D2D2D80",
              }}
            >
              {modalContent === "feedback" ? (
                <div className="space-y-4">
                  <p className="text-sm leading-relaxed whitespace-pre-line">
                    {feedback}
                  </p>
                </div>
              ) : (
                <Textarea
                  value={editedSuggestion}
                  onChange={(e) => setEditedSuggestion(e.target.value)}
                  className="min-h-[200px] text-base leading-relaxed p-4 border-border focus:ring-2 focus:ring-primary/50"
                  placeholder="Edit your story snippet here..."
                />
              )}
            </div>
            <DialogFooter className="flex justify-between sm:justify-between">
              <Button
                className="cursor-pointer"
                variant="outline"
                onClick={handleModalClose}
              >
                Cancel
              </Button>
              <Button
                onClick={() =>
                  insertSuggestion(
                    modalContent === "suggestion" ? editedSuggestion : feedback
                  )
                }
                className="bg-primary hover:bg-primary/90 cursor-pointer"
              >
                Insert into Story
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Confirm Modal */}
      <Dialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
            <DialogDescription>
              You have unsaved changes in your story suggestion. Do you want to
              discard them?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsConfirmDialogOpen(false)}
              className="cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setIsConfirmDialogOpen(false);
                setIsModalOpen(false);
              }}
              className="cursor-pointer"
            >
              Discard
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Tutorial Modal */}
      <Dialog open={showTutorial} onOpenChange={setShowTutorial}>
        <DialogContent
          className={cn(
            "w-[95vw] max-w-[600px] max-h-[80vh] flex flex-col",
            "sm:p-6 p-4"
          )}
        >
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Image
                src={ai_image}
                alt="TaleWeaver"
                width={24}
                height={24}
                className="rounded-full"
              />
              How to Use TaleWeaver
            </DialogTitle>
            <DialogDescription>
              Get the most out of your AI writing companion
            </DialogDescription>
          </DialogHeader>
          <div
            className="flex-1 overflow-y-auto py-4 space-y-6 mr-4 scrollbar-thin scrollbar-thumb-rounded-full scrollbar-track-rounded-full"
            style={{
              scrollbarWidth: "thin",
              scrollbarColor: "#FF634780 #2D2D2D80",
            }}
          >
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <MessageSquare className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Chat Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Discuss story ideas, ask questions about writing techniques,
                    or just chat about your creative process.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Try asking:</span> &quot;Can
                    you help me develop a character for my story?&quot; or
                    &quot;What are some good plot twists for a mystery?&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <Wand className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Generate Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Create story snippets, characters, or scenes to add to your
                    story.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Try asking:</span> &quot;Write
                    a scene where my protagonist discovers a hidden door&quot;
                    or &quot;Generate a description of a futuristic city&quot;
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border border-border">
                <FileText className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Feedback Mode</h3>
                  <p className="text-sm text-muted-foreground">
                    Get constructive feedback on your writing to improve your
                    story.
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    <span className="font-medium">Try asking:</span> &quot;How
                    can I improve the pacing?&quot; or &quot;Is my dialogue
                    realistic?&quot;
                  </p>
                </div>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-primary/20 bg-primary/5">
              <h3 className="font-medium mb-1 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                Pro Tips
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2 ml-6 list-disc">
                <li>Be specific in your requests to get better results</li>
                <li>
                  You can edit generated content before adding it to your story
                </li>
                <li>Switch between modes anytime using the tabs at the top</li>
                <li>
                  TaleWeaver learns from your interactions, so your experience
                  will improve over time
                </li>
              </ul>
            </div>
          </div>
          <DialogFooter>
            <Button
              onClick={() => setShowTutorial(false)}
              className="bg-primary hover:bg-primary/90 cursor-pointer"
            >
              Got it!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
