"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { CheckCircle } from "lucide-react";

interface Feature {
  step: string;
  title?: string;
  content: string;
  image: string;
}

interface FeatureStepsProps {
  features: Feature[];
  className?: string;
  title?: string;
  autoPlayInterval?: number;
  imageHeight?: string;
  titleClassName?: string;    
  stepClassName?: string;    
  contentClassName?: string;  
}

export function FeatureSteps({
  features,
  className,
  title = "How to Get Started",
  autoPlayInterval = 3000,
  imageHeight = "h-[400px]",
  titleClassName,
  stepClassName,
  contentClassName,
}: FeatureStepsProps) {
  const [currentFeature, setCurrentFeature] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (progress < 100) {
        setProgress((prev) => prev + 100 / (autoPlayInterval / 100));
      } else {
        setCurrentFeature((prev) => (prev + 1) % features.length);
        setProgress(0);
      }
    }, 100);

    return () => clearInterval(timer);
  }, [progress, features.length, autoPlayInterval]);

  return (
    <div
      className={cn(
        "px-4 md:px-8 xl:px-20 pb-16 bg-background font-[var(--font-sans)]",
        className
      )}
    >
      <div className="max-w-7xl mx-auto w-full">
        <h2
          className={cn(
            "text-3xl md:text-4xl lg:text-5xl font-bold mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28 text-center text-foreground",
            titleClassName // Apply titleClassName here
          )}
        >
          {title}
        </h2>

        <div className="flex flex-col lg:flex-row gap-6 md:gap-12">
          <div className="order-2 lg:order-1 flex-1 space-y-12">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-start gap-6 md:gap-8 cursor-pointer"
                initial={{ opacity: 0.3 }}
                animate={{ opacity: index === currentFeature ? 1 : 0.3 }}
                transition={{ duration: 0.5 }}
                onClick={() => {
                  setCurrentFeature(index);
                  setProgress(0);
                }}
              >
                <motion.div
                  className={cn(
                    "w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2",
                    index === currentFeature
                      ? "bg-primary border-primary text-primary-foreground scale-110"
                      : "bg-muted border-muted-foreground"
                  )}
                >
                  {index === currentFeature ? (
                    <CheckCircle className="w-6 h-6" strokeWidth={2.5} />
                  ) : (
                    <span className="text-lg font-semibold">{index + 1}</span>
                  )}
                </motion.div>

                <div className="flex-1">
                  <h3
                    className={cn(
                      "text-xl md:text-2xl font-semibold text-foreground",
                      stepClassName
                    )}
                  >
                    {feature.title || feature.step}
                  </h3>
                  <p
                    className={cn(
                      "mt-4 text-sm md:text-lg text-muted-foreground",
                      contentClassName 
                    )}
                  >
                    {feature.content}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          <div
            className={cn(
              "order-1 lg:order-2 flex-1 relative",
              imageHeight,
              "overflow-hidden rounded-[var(--radius)] shadow-md"
            )}
          >
            <AnimatePresence mode="wait">
              {features.map(
                (feature, index) =>
                  index === currentFeature && (
                    <motion.div
                      key={index}
                      className="absolute inset-0 rounded-[var(--radius)] overflow-hidden"
                      initial={{ scale: 1.1, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.1, opacity: 0 }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                    >
                      <Image
                        src={feature.image}
                        alt={feature.step}
                        fill
                        className="object-cover transition-transform transform"
                        priority={index === 0}
                      />
                    </motion.div>
                  )
              )}
            </AnimatePresence>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
              {features.map((_, index) => (
                <button
                  key={index}
                  className={cn(
                    "w-3 h-3 rounded-full transition-all duration-300",
                    index === currentFeature
                      ? "bg-primary scale-125"
                      : "bg-muted"
                  )}
                  onClick={() => {
                    setCurrentFeature(index);
                    setProgress(0);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}