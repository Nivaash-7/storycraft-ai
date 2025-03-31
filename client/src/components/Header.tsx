"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, LogIn, Home, Users, LayoutDashboard } from "lucide-react";
import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";

interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

interface NavDockItem {
  title: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth?: boolean;
}

interface ActionDockItem {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

type DockItem = NavDockItem | ActionDockItem;

const navLinks: NavLink[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="h-6 w-6 text-muted-foreground" />,
  },
  {
    name: "Community",
    href: "/community",
    icon: <Users className="h-6 w-6 text-muted-foreground" />,
    requiresAuth: true,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-6 w-6 text-muted-foreground" />,
    requiresAuth: true,
  },
];

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const signInButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDarkMode(true);
    }
  };

  const handleProtectedNavigation = (href: string) => {
    if (isSignedIn) {
      router.push(href);
    } else {
      if (signInButtonRef.current) {
        signInButtonRef.current.click();
      }
    }
  };

  return (
    <>
      <div className="hidden">
        <SignInButton mode="modal">
          <button
            ref={signInButtonRef}
            className="p-4 text-muted-foreground hover:text-primary transition-colors duration-300 sign-in-button cursor-pointer"
            onTouchStart={(e) => e.currentTarget.click()}
            aria-label="Sign in"
          >
            <LogIn className="w-8 h-8 cursor-pointer" />
          </button>
        </SignInButton>
      </div>

      <header className="relative flex items-center justify-between px-4 py-3 bg-background sm:px-6 sm:py-4 lg:px-6 lg:py-4">
        <div className="text-3xl font-bold text-primary tracking-tight sm:text-3xl lg:text-4xl">
          <Link href="/" aria-label="StoryCraft Home">
            StoryCraft
          </Link>
        </div>

        <div className="lg:hidden flex items-center">
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-ring",
                },
              }}
            />
          ) : (
            <button
              onClick={() => handleProtectedNavigation(pathname)}
              className="p-4 text-muted-foreground hover:text-primary transition-colors duration-300 sign-in-button cursor-pointer"
              onTouchStart={(e) => e.currentTarget.click()}
              aria-label="Sign in"
            >
              <LogIn className="w-8 h-8" />
            </button>
          )}
        </div>

        <nav className="hidden lg:flex lg:space-x-8">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => {
                if (link.requiresAuth) {
                  handleProtectedNavigation(link.href);
                } else {
                  router.push(link.href);
                }
              }}
              className="relative text-foreground text-lg font-medium transition-colors duration-300 lg:text-xl after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:h-[2px] after:bg-primary after:w-0 after:transition-all after:duration-300 hover:after:w-full cursor-pointer"
            >
              {link.name}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex lg:space-x-4 lg:items-center">
          {isSignedIn ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-10 h-10",
                  userButtonTrigger: "focus:outline-none focus:ring-2 focus:ring-ring",
                },
              }}
            />
          ) : (
            <button
              onClick={() => handleProtectedNavigation(pathname)}
              className="px-4 py-2 bg-primary text-primary-foreground text-base font-bold rounded-[var(--radius)] hover:bg-primary/90 transition-all duration-300 sign-in-button cursor-pointer"
            >
              Sign In
            </button>
          )}
          <button
            onClick={toggleDarkMode}
            className="p-2 text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              <Sun className="w-6 h-6" />
            ) : (
              <Moon className="w-6 h-6" />
            )}
          </button>
        </div>
      </header>

      <MobileDock isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
    </>
  );
};

const MobileDock: React.FC<{ isDarkMode: boolean; toggleDarkMode: () => void }> = ({
  isDarkMode,
  toggleDarkMode,
}) => {
  const [activeTooltip, setActiveTooltip] = useState<string | null>(null);
  const { isSignedIn } = useAuth();
  const router = useRouter();
  const signInButtonRef = useRef<HTMLButtonElement>(null);

  const dockItems: DockItem[] = [
    ...navLinks.map((link) => ({
      title: link.name,
      icon: link.icon,
      href: link.href,
      requiresAuth: link.requiresAuth,
    })),
    {
      title: isDarkMode ? "Light Mode" : "Dark Mode",
      icon: isDarkMode ? (
        <Sun className="h-8 w-8 text-muted-foreground" />
      ) : (
        <Moon className="h-8 w-8 text-muted-foreground" />
      ),
      onClick: toggleDarkMode,
    },
  ];

  const handleTap = (title: string, href?: string, onClick?: () => void, requiresAuth?: boolean) => {
    setActiveTooltip(title);
    setTimeout(() => setActiveTooltip(null), 2000);

    if (onClick) {
      onClick();
    } else if (href) {
      if (requiresAuth && !isSignedIn) {
        if (signInButtonRef.current) {
          signInButtonRef.current.click();
        }
      } else {
        router.push(href);
      }
    }
  };

  const isNavDockItem = (item: DockItem): item is NavDockItem => {
    return (item as NavDockItem).href !== undefined;
  };

  return (
    <>
      <div className="hidden">
        <SignInButton mode="modal">
          <button
            ref={signInButtonRef}
            className="p-4 text-muted-foreground hover:text-primary transition-colors duration-300 sign-in-button"
            onTouchStart={(e) => e.currentTarget.click()}
            aria-label="Sign in"
          >
            <LogIn className="w-8 h-8" />
          </button>
        </SignInButton>
      </div>

      <div className="lg:hidden fixed bottom-4 left-0 right-0 flex justify-center z-50">
        <div className={`flex items-center h-16 px-6 gap-6 rounded-2xl shadow-lg ${isDarkMode ? 'bg-gray-800/90' : 'bg-gray-200/90'} backdrop-blur-md`}>
          {dockItems.map((item) => (
            <div key={item.title} className="relative">
              <button
                onClick={() =>
                  handleTap(
                    item.title,
                    isNavDockItem(item) ? item.href : undefined,
                    'onClick' in item ? item.onClick : undefined,
                    isNavDockItem(item) ? item.requiresAuth : undefined
                  )
                }
                className="p-3 rounded-full text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={item.title}
              >
                {isNavDockItem(item) ? (
                  <div className="flex items-center">{item.icon}</div>
                ) : (
                  item.icon
                )}
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
    </>
  );
};

export default Header;