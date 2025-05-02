"use client";

import { useEffect, useState } from "react";
import { Tablet, Laptop, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

// Define useMobile locally to avoid import issues
function useMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return; // Avoid SSR errors
    const checkMobile = () => {
      const width = window.innerWidth;
      setIsMobile(width <= 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

export default function MobileDeviceCheck() {
  const isMobile = useMobile();
  const [showWarning, setShowWarning] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (isMobile) {
      const hasDismissed = localStorage.getItem("story-editor-mobile-dismissed");
      if (hasDismissed !== "true") {
        setShowWarning(true);
      }
    } else {
      setShowWarning(false);
    }
  }, [isMobile]);

  const handleDismiss = () => {
    localStorage.setItem("story-editor-mobile-dismissed", "true");
    setDismissed(true);
    setShowWarning(false);
    // Redirect to dashboard immediately
    window.location.href = "/dashboard";
  };

  if (!showWarning || dismissed) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="w-full max-w-md border-2 border-primary/20">
        <CardContent className="pt-6 pb-4 px-6">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Mobile Editor Notice</h2>
            <p className="text-muted-foreground">
              StoryCraft AI is not optimized for mobile devices yet. For the best experience, please use a tablet or computer. We are working on launching a mobile application soon!
            </p>
            <div className="flex items-center justify-center gap-4 pt-2">
              <div className="flex flex-col items-center">
                <Tablet className="w-8 h-8 text-primary" />
                <span className="text-sm mt-1">Tablet</span>
              </div>
              <div className="flex flex-col items-center">
                <Laptop className="w-8 h-8 text-primary" />
                <span className="text-sm mt-1">Computer</span>
              </div>
            </div>
            <div className="pt-2 w-full">
              <Button
                className="w-full"
                onClick={handleDismiss}
              >
                Go to Dashboard
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}