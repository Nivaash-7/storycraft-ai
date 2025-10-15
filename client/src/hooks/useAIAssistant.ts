import { useState, useEffect, useRef, useCallback } from "react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";
import { Dispatch, SetStateAction } from "react";

export type MessageTab = "chat" | "generate" | "feedback";

export interface AIMessage {
  id: number;
  role: "user" | "assistant";
  content: string;
  isStoryContent?: boolean;
  isInsertable?: boolean;
  isClarification?: boolean;
  clarificationData?: {
    userInput: string;
    contentToRewrite: string;
  };
}

export interface AIAssistantProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  storyContent: string;
  setStoryContent: Dispatch<SetStateAction<string>>;
  title?: string | null;
  genre?: string | null;
  className?: string;
  initialTab?: string;
}

export const useAIAssistant = ({
  storyContent,
  setStoryContent,
  title,
  genre,
  initialTab,
}: AIAssistantProps) => {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<{
    chat: AIMessage[];
    generate: AIMessage[];
    feedback: AIMessage[];
  }>({
    chat: [
      {
        id: 1,
        role: "assistant",
        content: `Hi there! I'm TaleWeaver, your creative writing assistant. Let's chat about your story ideas, writing techniques, or anything else on your mind! How can I help you today?`,
        isStoryContent: false,
      },
    ],
    generate: [
      {
        id: 2,
        role: "assistant",
        content: `Hey! TaleWeaver here. I'd love to help you generate some story content. Just describe what you're looking for - a character, scene, plot twist - and I'll craft something you can add to your story!`,
        isStoryContent: false,
      },
    ],
    feedback: [
      {
        id: 3,
        role: "assistant",
        content: `Hi! This is TaleWeaver, your writing buddy. I'd be happy to give you some feedback on your story. What specific aspects would you like me to focus on?`,
        isStoryContent: false,
      },
    ],
  });
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<"feedback" | "suggestion">("suggestion");
  const [editedSuggestion, setEditedSuggestion] = useState<string>("");
  const [originalSuggestion, setOriginalSuggestion] = useState<string>("");
  const [feedback] = useState<string>("");
  const [activeTab, setActiveTab] = useState<MessageTab>(initialTab as MessageTab);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const idCounterRef = useRef<number>(4);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_HISTORY_LENGTH = 10;

  const tabInstructions = {
    chat: "Discuss story ideas, ask questions about your story, or just chat about your creative process.",
    generate: "Describe a scene, character, or plot you'd like to add to your story. AI will generate the content.",
    feedback: "Ask for specific feedback on your story's pacing, characters, dialogue.",
  };

  const generateMessageId = useCallback(() => {
    const newId = idCounterRef.current;
    idCounterRef.current += 1;
    return newId;
  }, []);

  const trimHistory = (history: AIMessage[]) => {
    const welcomeMessage = history.find((msg) => msg.id <= 3);
    const otherMessages = history.filter((msg) => msg.id > 3);
    const trimmedMessages = otherMessages.slice(-MAX_HISTORY_LENGTH + 1);
    return welcomeMessage ? [welcomeMessage, ...trimmedMessages] : trimmedMessages;
  };

  const scrollToBottom = useCallback(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, []);

  const validateInput = useCallback((value: string) => {
    if (!value.trim()) return "Hey, let's chat! Type something cool.";
    if (value.length > 500) return "Whoa, that's a bit long! Keep it under 500 chars.";
    const emojiCount = (value.match(/[\p{Emoji}]/gu) || []).length;
    if (emojiCount > 5) return "Too many emojis! Let's keep it to 5 or fewer.";
    const textOnly = value.replace(/[\p{Emoji}\s.,!?]/gu, "");
    if (!textOnly) return "Please include some letters or numbers!";
    return "";
  }, []);

  const getConversationHistory = useCallback(
    (tab: MessageTab) => {
      const recentMessages = messages[tab]
        .filter((msg) => !msg.isClarification)
        .map((msg) => `${msg.role}: ${msg.content}`)
        .join("\n");
      return recentMessages ? `Previous Chat:\n${recentMessages}\n` : "";
    },
    [messages]
  );

  const extractTitleAndGenre = useCallback((input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes("title") || lowerInput.includes("call it")) {
      const titleMatch =
        input.match(/title(?: is)?\s+(.+?)(?:\s|$|\.)/i) ||
        input.match(/call it\s+(.+?)(?:\s|$|\.)/i);
      if (titleMatch) console.log("Suggested title:", titleMatch[1].trim());
    }
    if (lowerInput.includes("genre") || lowerInput.includes("style of")) {
      const genreMatch =
        input.match(/genre(?: is)?\s+(.+?)(?:\s|$|\.)/i) ||
        input.match(/style of\s+(.+?)(?:\s|$|\.)/i);
      if (genreMatch) console.log("Suggested genre:", genreMatch[1].trim());
    }
  }, []);

  const callAIApi = useCallback(
    async (mode: "chat" | "generate" | "feedback", userInput: string) => {
      const token = await getToken();
      if (!token) throw new Error("User not authenticated");

      const history = getConversationHistory(activeTab);
      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mode,
          input: userInput,
          storyContent,
          title: title || "",
          genre: genre || "",
          history,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("Raw response:", text);
        const errorData = await response.json().catch(() => ({ error: text }));
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const text = await response.text();
      try {
        const data = JSON.parse(text);
        return data.content;
      } catch {
        console.error("Invalid JSON response:", text);
        throw new Error("Invalid response format from server");
      }
    },
    [storyContent, title, genre, getConversationHistory, activeTab, getToken]
  );

  const handleNormalChat = useCallback(
    async (userInput: string) => {
      if (isLoading) {
        toast.error("Hang on!", { description: "I'm still catching up!" });
        return;
      }
      setIsLoading(true);
      try {
        extractTitleAndGenre(userInput);
        const aiResponse = await callAIApi("chat", userInput);
        const newMessage: AIMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: aiResponse,
          isStoryContent: false,
        };
        setMessages((prev) => ({
          ...prev,
          chat: trimHistory([...prev.chat, newMessage]),
        }));
      } catch (error: unknown) {
        toast.error("Oops!", {
          description: (error as Error).message || "Something slipped up.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, extractTitleAndGenre, callAIApi, generateMessageId]
  );

  const handleClarificationResponse = useCallback(
    async (messageId: number, confirmed: boolean) => {
      const message = messages.generate.find((msg) => msg.id === messageId);
      if (!message || !message.isClarification || !message.clarificationData) {
        toast.error("Error", {
          description: "Clarification message not found.",
        });
        return;
      }

      const { userInput } = message.clarificationData;

      setMessages((prev) => ({
        ...prev,
        generate: prev.generate.filter((msg) => msg.id !== messageId),
      }));

      if (confirmed) {
        if (isLoading) {
          toast.error("Please wait!", { description: "I'm still processing." });
          return;
        }
        setIsLoading(true);
        try {
          const aiResponse = await callAIApi("generate", userInput);
          const newMessage: AIMessage = {
            id: generateMessageId(),
            role: "assistant",
            content: aiResponse,
            isStoryContent: true,
            isInsertable: true,
          };
          setMessages((prev) => ({
            ...prev,
            generate: trimHistory([...prev.generate, newMessage]),
          }));
          toast.success("Content Ready!", {
            action: {
              label: "Edit & Use",
              onClick: () => {
                setEditedSuggestion(aiResponse);
                setOriginalSuggestion(aiResponse);
                setModalContent("suggestion");
                setIsModalOpen(true);
              },
            },
          });
        } catch (error: unknown) {
          toast.error("Oops!", {
            description: (error as Error).message || "That didn't work.",
          });
        } finally {
          setIsLoading(false);
        }
      } else {
        const cancelMessage: AIMessage = {
          id: generateMessageId(),
          role: "assistant",
          content:
            "Okay, I won't rewrite that content. What would you like to do next?",
          isStoryContent: false,
        };
        setMessages((prev) => ({
          ...prev,
          generate: trimHistory([...prev.generate, cancelMessage]),
        }));
      }
    },
    [callAIApi, messages.generate, isLoading, generateMessageId]
  );

  const generateStoryContent = useCallback(
    async (userInput: string) => {
      if (isLoading) {
        toast.error("Hang on!", {
          description: "I'm still crafting your last idea!",
        });
        return;
      }
      setIsLoading(true);
      try {
        const lastGeneratedMessage = messages.generate
          .slice()
          .reverse()
          .find((msg) => msg.role === "assistant" && msg.isStoryContent);
        if (
          userInput.toLowerCase().includes("rewrite") &&
          lastGeneratedMessage &&
          !lastGeneratedMessage.content.includes("(Inserted)") &&
          !storyContent.includes(lastGeneratedMessage.content)
        ) {
          const clarificationMessage: AIMessage = {
            id: generateMessageId(),
            role: "assistant",
            content: `Just to confirm, are you asking to rewrite this content?\n\n"${lastGeneratedMessage.content}"`,
            isClarification: true,
            clarificationData: {
              userInput,
              contentToRewrite: lastGeneratedMessage.content,
            },
          };
          setMessages((prev) => ({
            ...prev,
            generate: trimHistory([...prev.generate, clarificationMessage]),
          }));
        } else {
          const aiResponse = await callAIApi("generate", userInput);
          const newMessage: AIMessage = {
            id: generateMessageId(),
            role: "assistant",
            content: aiResponse,
            isStoryContent: true,
            isInsertable: true,
          };
          setMessages((prev) => ({
            ...prev,
            generate: trimHistory([...prev.generate, newMessage]),
          }));
          toast.success("Content Ready!", {
            action: {
              label: "Edit & Use",
              onClick: () => {
                setEditedSuggestion(aiResponse);
                setOriginalSuggestion(aiResponse);
                setModalContent("suggestion");
                setIsModalOpen(true);
              },
            },
          });
        }
      } catch (error: unknown) {
        toast.error("Oops!", {
          description: (error as Error).message || "That didn't work.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, callAIApi, messages.generate, storyContent, generateMessageId]
  );

  const getStoryFeedback = useCallback(
    async (userInput: string) => {
      if (isLoading) {
        toast.error("Hang on!", {
          description: "I'm still looking at your last draft!",
        });
        return;
      }
      setIsLoading(true);
      if (!storyContent.trim()) {
        toast.error("No Story Yet!", { description: "Write something first!" });
        setIsLoading(false);
        return;
      }
      try {
        const feedbackText = await callAIApi("feedback", userInput);
        const newMessage: AIMessage = {
          id: generateMessageId(),
          role: "assistant",
          content: feedbackText,
          isStoryContent: false,
        };
        setMessages((prev) => ({
          ...prev,
          feedback: trimHistory([...prev.feedback, newMessage]),
        }));
        toast.success("Feedback ready!");
      } catch (error: unknown) {
        toast.error("Oops!", {
          description: (error as Error).message || "Couldn't review that.",
        });
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, storyContent, callAIApi, generateMessageId]
  );

  const handleChatSubmit = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      const errorMessage = validateInput(input);
      if (errorMessage) {
        toast.error("Invalid Input", { description: errorMessage });
        return;
      }

      const userMessage: AIMessage = {
        id: generateMessageId(),
        role: "user",
        content: input,
      };
      setMessages((prev) => ({
        ...prev,
        [activeTab]: trimHistory([...prev[activeTab], userMessage]),
      }));
      setInput("");

      try {
        switch (activeTab) {
          case "chat":
            await handleNormalChat(input);
            break;
          case "generate":
            await generateStoryContent(input);
            break;
          case "feedback":
            await getStoryFeedback(input);
            break;
        }
      } catch (error: unknown) {
        toast.error("Error", {
          description: (error as Error).message || "Something slipped up.",
        });
      }
    },
    [
      input,
      activeTab,
      handleNormalChat,
      generateStoryContent,
      getStoryFeedback,
      validateInput,
      generateMessageId,
    ]
  );

  const insertSuggestion = useCallback(
    (text: string) => {
      setStoryContent((prev) => (prev ? prev + "\n\n" + text : text));
      setIsModalOpen(false);
      toast.success("Added to your story!");
      setMessages((prev) => ({
        ...prev,
        generate: prev.generate.map((msg) =>
          msg.content === originalSuggestion
            ? {
                ...msg,
                isInsertable: false,
                content: `${msg.content} (Inserted)`,
              }
            : msg
        ),
      }));
    },
    [setStoryContent, originalSuggestion]
  );

  const clearGenerateHistory = useCallback(() => {
    setMessages((prev) => ({
      ...prev,
      generate: [
        {
          id: 2,
          role: "assistant",
          content: `Hey! TaleWeaver here. I'd love to help you generate some story content.`,
          isStoryContent: false,
        },
      ],
    }));
    toast.success("Generate history cleared!");
  }, []);

  const handleModalClose = useCallback(() => {
    if (
      modalContent === "suggestion" &&
      editedSuggestion !== originalSuggestion
    ) {
      setIsConfirmDialogOpen(true);
    } else {
      setIsModalOpen(false);
    }
  }, [modalContent, editedSuggestion, originalSuggestion]);

  const handleKeyDown = (_e: React.KeyboardEvent) => {
    if (_e.key === "Enter" && !_e.shiftKey) {
      _e.preventDefault();
      handleChatSubmit();
    }
  };

  useEffect(() => {
    if (initialTab) setActiveTab(initialTab as MessageTab);
  }, [initialTab]);

  useEffect(() => {
    if (inputRef.current && !isLoading) inputRef.current.focus();
  }, [isLoading, activeTab]);

  const currentMessages = messages[activeTab];
  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, scrollToBottom]);

  return {
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
    originalSuggestion,
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
  };
};
