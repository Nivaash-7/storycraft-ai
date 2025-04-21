"use client"

import { motion } from "framer-motion"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface StoryMetadataFormProps {
  title: string
  setTitle: (title: string) => void
  genre: string
  setGenre: (genre: string) => void
  wordCountGoal: number
  setWordCountGoal: (count: number) => void
  wordCount: number
}

export default function StoryMetadataForm({
  title,
  setTitle,
  genre,
  setGenre,
  wordCountGoal,
  setWordCountGoal,
  wordCount,
}: StoryMetadataFormProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.1, duration: 0.4 }}
      className="form-container w-full"
    >
      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <div className="w-full sm:w-1/3">
          <Label htmlFor="title" className="text-sm font-medium mb-1.5 block text-foreground">
            Story Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your story title"
            required
            className="bg-card border-border text-foreground"
          />
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="genre" className="text-sm font-medium mb-1.5 block text-foreground">
            Genre
          </Label>
          <Select onValueChange={setGenre} required>
            <SelectTrigger id="genre" className="bg-card border-border text-foreground hover:bg-white cursor-pointer">
              <SelectValue placeholder="Select a genre" />
            </SelectTrigger>
            <SelectContent className="bg-card text-foreground border-border">
              <SelectItem className="cursor-pointer" value="Fantasy">
                Fantasy
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Science Fiction">
                Science Fiction
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Romance">
                Romance
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Horror">
                Horror
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Adventure">
                Adventure
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Mystery">
                Mystery
              </SelectItem>
              <SelectItem className="cursor-pointer" value="Other">
                Other
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-full sm:w-1/3">
          <Label htmlFor="wordCountGoal" className="text-sm font-medium mb-1.5 block text-foreground">
            Word Count Goal
          </Label>
          <Input
            id="wordCountGoal"
            type="number"
            value={wordCountGoal || ""}
            onChange={(e) => {
              const value = Math.max(0, Number(e.target.value))
              setWordCountGoal(value)
            }}
            placeholder="e.g: 1000"
            className="bg-card border-border text-foreground no-spinner"
          />
        </div>
      </div>
      {wordCountGoal > 0 && (
        <div className="w-full bg-muted rounded-full h-2 mt-2">
          <div
            className="bg-primary h-2 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min((wordCount / wordCountGoal) * 100, 100)}%`,
            }}
          ></div>
        </div>
      )}
    </motion.div>
  )
}
