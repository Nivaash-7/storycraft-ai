"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image, { type StaticImageData } from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import type { Story } from "@/lib/models"

import fantasyImg from "@/assets/fantasy.jpg"
import horrorImg from "@/assets/horror.jpg"
import scifiImg from "@/assets/scifi.jpg"
import mysteryImg from "@/assets/mystery.jpg"
import romanceImg from "@/assets/romance.jpg"
import adventureImg from "@/assets/adventure.jpg"
import thrillerImg from "@/assets/thriller.jpg"
import otherImg from "@/assets/other.jpg"

interface CommunityProps {
  className?: string
}

const genreImages: Record<string, StaticImageData> = {
  Fantasy: fantasyImg,
  Horror: horrorImg,
  "Science Fiction": scifiImg,
  Mystery: mysteryImg,
  Romance: romanceImg,
  Adventure: adventureImg,
  Thriller: thrillerImg,
  Other: otherImg,
}

export function Community({ className }: CommunityProps) {
  const [stories, setStories] = useState<Story[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStories() {
      try {
        const response = await fetch("/api/stories/published")
        const data = await response.json()

        const latestFour = data.slice(0, 4)
        setStories(latestFour)
      } catch (error) {
        console.error("Failed to fetch stories:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchStories()
  }, [])

  function getImageByGenre(genre: string) {
    return genreImages[genre] || otherImg
  }

  if (loading) {
    return (
      <section className={cn("px-4 md:px-8 xl:px-20 py-16", className)}>
        <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-[450px] rounded-[var(--radius)]" />
          ))}
        </div>
      </section>
    )
  }

  return (
    <section className={cn("px-4 md:px-8 xl:px-20 py-16", className)}>
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center text-foreground">
          Explore Stories from Our Community
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={story._id.toString()}
              className="bg-background p-6 rounded-[var(--radius)] shadow-md border border-border flex flex-col"
              style={{ height: 450 }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={getImageByGenre(story.genre) || "/placeholder.svg"}
                  alt={story.title}
                  fill
                  className="object-cover rounded-[var(--radius)]"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">{story.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">by {story.author?.username || "Unknown"}</p>
              <p
                className="text-base text-muted-foreground mb-4 flex-1 overflow-hidden"
                style={{
                  display: "-webkit-box",
                  WebkitLineClamp: 8,
                  WebkitBoxOrient: "vertical",
                  textOverflow: "ellipsis",
                }}
              >
                {story.description}
              </p>
              <Link href={`/Story/${story._id.toString()}`}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer bg-transparent"
                >
                  Read Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
