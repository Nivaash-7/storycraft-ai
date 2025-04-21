"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Wand, FileText } from 'lucide-react';
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useIsMobile } from "@/hooks/use-mobile";

interface StoryEditorProps {
  storyContent: string;
  setStoryContent: (content: string) => void;
  updateWordCount: (content: string) => void;
  openAIAssistant: (tab?: string) => void;
}

export default function StoryEditor({
  storyContent,
  setStoryContent,
  updateWordCount,
  openAIAssistant,
}: StoryEditorProps) {
  const isMobile = useIsMobile();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMicClick = () => {
    toast.info("Feature coming soon", {
      description:
        "Voice input functionality will be available in a future update!",
    });
  };

  const handleTextareaClick = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    textarea.classList.add("pulse-animation");
    setTimeout(() => textarea.classList.remove("pulse-animation"), 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      className="h-full w-full"
    >
      <Card className="story-card w-full">
        <CardHeader className="story-card-header">
          <div className="flex justify-between items-center w-full px-4">
            <CardTitle className="text-lg font-medium text-foreground">
              Story Content
            </CardTitle>
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleMicClick}
                      className="h-8 w-8 cursor-pointer"
                    >
                      <Mic className="w-4 h-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Voice input</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              {!isMobile && (
                <div className="flex items-center gap-1">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openAIAssistant("generate")}
                          className="h-8 px-2 text-xs cursor-pointer"
                        >
                          <Wand className="w-3 h-3 mr-1" />
                          Generate
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Generate story content</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => openAIAssistant("feedback")}
                          className="h-8 px-2 text-xs cursor-pointer"
                        >
                          <FileText className="w-3 h-3 mr-1" />
                          Feedback
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Get feedback on your story</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="story-card-content">
          <div className="flex flex-col h-full relative w-full">
            <Textarea
              ref={textareaRef}
              value={storyContent}
              onChange={(e) => {
                setStoryContent(e.target.value);
                updateWordCount(e.target.value);
              }}
              onClick={handleTextareaClick}
              placeholder="Write your story here..."
              className="story-textarea w-full"
            />
            {storyContent.length === 0 && (
              <div className="hint-text">
                Click the textarea above to start writing your story!
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
