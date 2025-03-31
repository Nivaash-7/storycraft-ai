"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const Hero: React.FC = () => {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(() => ["Creative", "Immersive", "Interactive", "Personalized", "Innovative"], []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTitleNumber((prev) => (prev + 1) % titles.length);
    }, 3000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="w-full px-4 md:px-8 xl:px-20 lg:pt-1 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="min-h-[calc(100vh-4rem-4rem)] lg:min-h-[calc(100vh-5rem)] flex flex-col items-center justify-center text-center gap-6 pt-4 pb-16 sm:pt-6 sm:pb-16 md:pt-6 md:pb-16 lg:pt-8 lg:pb-8">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight max-w-4xl text-foreground">
            Explore Your StoryWriting Potential
            <span className="relative flex justify-center items-center text-primary h-[2.5rem] sm:h-[3rem] md:h-[3.5rem] lg:h-[4rem] overflow-hidden mt-2">
              {titles.map((title, index) => (
                <motion.span
                  key={index}
                  className="absolute font-bold"
                  initial={{ opacity: 0, y: "100%" }}
                  transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  animate={
                    titleNumber === index
                      ? { y: 0, opacity: 1 }
                      : { y: titleNumber > index ? 150 : -150, opacity: 0 }
                  }
                >
                  {title}
                </motion.span>
              ))}
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed">
            Unleash creativity with our AI-driven tools designed to enhance your narrative skills, from drafting ideas to crafting full stories.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6 sm:mt-8">
            <Button
              variant="outline"
              className="px-6 py-3 text-foreground border-border hover:bg-accent cursor-pointer"
            >
              Discover More
            </Button>
            <Button className="px-6 py-3 bg-primary text-primary-foreground hover:bg-primary/90 cursor-pointer">
              Start Writing
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { Hero };