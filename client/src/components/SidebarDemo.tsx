"use client";

import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink, useSidebar } from "@/components/ui/sidebar";
import {
  IconBook,
  IconEdit,
  IconHome,
  IconLayoutDashboardFilled,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface SidebarDemoProps {
  dashboardContent: React.ReactNode;
}

interface SidebarLinkItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  onClick: () => void;
}

interface DockItem {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  requiresAuth?: boolean;
}

export function SidebarDemo({ dashboardContent }: SidebarDemoProps) {
  
  const [open, setOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const theme = storedTheme || (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, []);

  const links: SidebarLinkItem[] = [
    {
      label: "Home",
      href: "/",
      icon: <IconHome className="h-6 w-6 shrink-0 text-foreground md:h-7 md:w-7" />,
      onClick: () => router.push("/"),
    },
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <IconLayoutDashboardFilled className="h-6 w-6 shrink-0 text-foreground md:h-7 md:w-7" />,
      onClick: () => router.push("/dashboard"),
    },
    {
      label: "Create Story",
      href: "/create-story",
      icon: <IconEdit className="h-6 w-6 shrink-0 text-foreground md:h-7 md:w-7" />,
      onClick: () => router.push("/create-story"),
    },
    {
      label: "My Stories",
      href: "/my-stories",
      icon: <IconBook className="h-6 w-6 shrink-0 text-foreground md:h-7 md:w-7" />,
      onClick: () => router.push("/my-stories"),
    }
  ];

  return (
    <div
      className={cn(
        "flex w-full flex-1 flex-col overflow-hidden bg-background md:flex-row",
        "h-screen"
      )}
    >
      {isLargeScreen && (
        <Sidebar open={open} setOpen={setOpen}>
          <SidebarBody className="justify-between gap-10">
            <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
              {open ? <Logo /> : <LogoIcon />}
              <div className="mt-8 flex flex-col gap-3">
                {links.map((link, idx) =>
                  link.label === "Logout" ? (
                    <SignOutButton key={idx} redirectUrl="/">
                      <SidebarLink link={link} />
                    </SignOutButton>
                  ) : (
                    <SidebarLink key={idx} link={link} />
                  )
                )}
              </div>
            </div>
            <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    userButtonAvatarBox: "h-8 w-8 md:h-10 md:w-10",
                  },
                }}
              />
          </SidebarBody>
        </Sidebar>
      )}
      <div
        className={cn(
          "flex-1 overflow-auto border border-border bg-background p-4 md:p-10",
          isLargeScreen ? "rounded-tl-2xl" : "rounded-none"
        )}
      >
        {dashboardContent}
      </div>
      <MobileSidebarDock links={links} />
    </div>
  );
}

export const Logo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-3 py-2 text-black">
      <IconBook className="h-8 w-8 text-foreground md:h-10 md:w-10" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center space-x-1 font-semibold text-foreground text-lg md:text-xl"
      >
        <span>StoryCraft AI</span>
      </motion.span>
    </div>
  );
};

export const LogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-3 py-2 text-black">
      <IconBook className="h-8 w-8 text-foreground md:h-10 md:w-10" />
    </div>
  );
};

export const DesktopSidebar = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof motion.div>) => {
  const { open, setOpen, animate } = useSidebar();
  return (
    <motion.div
      className={cn(
        "h-full px-4 py-4 hidden lg:flex lg:flex-col bg-card w-[300px] shrink-0 rounded-tr-2xl border-r border-border",
        className
      )}
      animate={{
        width: animate ? (open ? "300px" : "60px") : "300px",
      }}
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      {...props}
    >
      {children}
    </motion.div>
  );
};

const MobileSidebarDock: React.FC<{
  links: SidebarLinkItem[];
}> = ({ links }) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const router = useRouter();
  const { user } = useUser();

  const dockItems: DockItem[] = links
    .filter((link) => link.label !== "Logout")
    .map((link) => ({
      title: link.label,
      icon: link.icon,
      href: link.href,
      onClick: link.onClick,
      requiresAuth: link.label !== "Home",
    }));

  const handleTap = (
    title: string,
    href?: string,
    onClick?: () => void,
    requiresAuth?: boolean
  ) => {
    setActiveTooltip(title);
    setTimeout(() => setActiveTooltip(null), 2000);

    if (onClick) {
      onClick();
    } else if (href) {
      if (requiresAuth && !user) {
        router.push("/sign-in");
      } else {
        router.push(href);
      }
    }
  };

  const isNavDockItem = (item: DockItem): item is DockItem => {
    return item.href !== undefined;
  };

  return (
    <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-50">
      <div
        className={cn(
          "flex items-center h-16 px-6 gap-6 rounded-2xl shadow-lg backdrop-blur-md bg-background/90 border border-border"
        )}
      >
        {dockItems.map((item) => (
          <div key={item.title} className="relative">
            <button
              onClick={() =>
                handleTap(
                  item.title,
                  isNavDockItem(item) ? item.href : undefined,
                  item.onClick,
                  isNavDockItem(item) ? item.requiresAuth : undefined
                )
              }
              className="p-3 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label={item.title}
            >
              <div className="flex items-center">{item.icon}</div>
            </button>
            <AnimatePresence>
              {activeTooltip === item.title && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="absolute left-1/2 -translate-x-1/2 -top-12 px-2 py-1 rounded-md bg-background/90 border border-border text-foreground text-sm whitespace-nowrap"
                >
                  {item.title}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};