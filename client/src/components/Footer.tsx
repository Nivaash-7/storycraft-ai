"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Github, Instagram, Twitter, Mail } from "lucide-react";

interface FooterProps {
  className?: string;
}

export function Footer({ className }: FooterProps) {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToSection = (sectionId: string) => {
    if (pathname !== "/") {
      router.push("/");
      setTimeout(() => {
        const section = document.getElementById(sectionId);
        if (section) {
          section.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } else {
      const section = document.getElementById(sectionId);
      if (section) {
        section.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    scrollToSection(sectionId);
  };

  return (
    <footer
      className={cn(
        "px-4 md:px-8 xl:px-20 py-12 text-muted-foreground border-t border-border",
        className
      )}
    >
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-3 relative inline-block">
              StoryCraft
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent" />
            </h3>
            <p className="text-sm text-muted-foreground">
              A platform to share and explore stories from around the world.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 relative inline-block">
              Quick Links
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent" />
            </h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" onClick={(e) => handleLinkClick(e, "hero")}>
                  <motion.span
                    className="text-sm text-muted-foreground hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Home
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/about" onClick={(e) => handleLinkClick(e, "features")}>
                  <motion.span
                    className="text-sm text-muted-foreground hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    About
                  </motion.span>
                </Link>
              </li>
              <li>
                <Link href="/stories" onClick={(e) => handleLinkClick(e, "community")}>
                  <motion.span
                    className="text-sm text-muted-foreground hover:text-primary"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    Stories
                  </motion.span>
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 relative inline-block">
              Follow Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent" />
            </h4>
            <div className="flex space-x-4">
              <Link href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" />
                </motion.div>
              </Link>
              <Link href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Instagram className="h-6 w-6 text-muted-foreground hover:text-primary" />
                </motion.div>
              </Link>
              <Link href="https://github.com" target="_blank" rel="noopener noreferrer">
                <motion.div whileHover={{ scale: 1.2 }} transition={{ type: "spring", stiffness: 300 }}>
                  <Github className="h-6 w-6 text-muted-foreground hover:text-primary" />
                </motion.div>
              </Link>
            </div>
          </div>

          <div>
            <h4 className="text-lg font-semibold text-foreground mb-3 relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-1/2 h-1 bg-gradient-to-r from-primary to-transparent" />
            </h4>
            <div className="flex items-center space-x-2">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <Link href="mailto:support@storycraft.com">
                <motion.span
                  className="text-sm text-muted-foreground hover:text-primary"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  support@storycraft.com
                </motion.span>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 StoryCraft. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}