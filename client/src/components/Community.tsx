"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import story1img from "@/assets/story1.jpeg"
import story2img from "@/assets/story2.jpeg"
import story3img from "@/assets/story3.jpeg"

interface Story {
  title: string;
  author: string;
  excerpt: string;
  image: string;
  slug: string;
}

interface CommunityProps {
  className?: string;
}

const stories: Story[] = [
  {
    title: "The Whispering Woods",
    author: "Emily R.",
    excerpt: "A thrilling tale of mystery in an enchanted forest.",
    image: story1img.src,
    slug: "the-whispering-woods",
  },
  {
    title: "Echoes of Tomorrow",
    author: "James T.",
    excerpt: "A sci-fi adventure exploring the future of humanity.",
    image: story2img.src,
    slug: "echoes-of-tomorrow",
  },
  {
    title: "Moonlit Dreams",
    author: "Sarah L.",
    excerpt: "A poetic journey through love and loss.",
    image: story3img.src,
    slug: "moonlit-dreams",
  },
  {
    title: "The Forgotten Realm",
    author: "Alex M.",
    excerpt: "An epic fantasy of courage and destiny.",
    image: story3img.src,
    slug: "the-forgotten-realm",
  },
];

export function Community({ className }: CommunityProps) {
  return (
    <section
      className={cn(
        "px-4 md:px-8 xl:px-20 py-16",
        className
      )}
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center text-foreground">
          Explore Stories from Our Community
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {stories.map((story, index) => (
            <motion.div
              key={index}
              className="bg-background p-6 rounded-[var(--radius)] shadow-md border border-border flex flex-col"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="relative w-full h-48 mb-4">
                <Image
                  src={story.image}
                  alt={story.title}
                  fill
                  className="object-cover rounded-[var(--radius)]"
                />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">
                {story.title}
              </h3>
              <p className="text-sm text-muted-foreground mb-2">
                by {story.author}
              </p>
              <p className="text-base text-muted-foreground mb-4 flex-1">
                {story.excerpt}
              </p>
              <Link href={`/stories/${story.slug}`}>
                <Button
                  variant="outline"
                  className="w-full border-primary text-primary hover:bg-primary hover:text-primary-foreground cursor-pointer"
                >
                  Read Now
                </Button>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}