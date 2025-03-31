"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CTABannerProps {
  className?: string;
}

export function CTABanner({ className }: CTABannerProps) {
  return (
    <section
      className={cn(
        "px-4 md:px-8 xl:px-20 py-16 border-b border-border",
        className
      )}
    >
      <div className="max-w-7xl mx-auto w-full text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-foreground">
            Join Our StoryWriting Community
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Share your stories, connect with others, and inspire the world.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button
                size="lg"
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-6 cursor-pointer"
              >
                Join Now
              </Button>
            </Link>
            <Link href="/stories">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground rounded-full px-6 cursor-pointer"
              >
                Explore More Stories
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}