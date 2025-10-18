"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { LogIn, Home, Group, LayoutDashboard } from "lucide-react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { useEffect, useState } from "react";

// NavLink and DockItem interfaces
interface NavLink {
  name: string;
  href: string;
  icon: React.ReactNode;
  requiresAuth?: boolean;
}

type DockItem = {
  title: string;
  icon: React.ReactNode;
  href: string;
  requiresAuth?: boolean;
};

// Type guard to check if an item is DockItem
function isDockItem(item: unknown): item is DockItem {
  return typeof item === "object" && item !== null && "title" in item;
}

const pcNavLinks: NavLink[] = [
  {
    name: "Home",
    href: "/",
    icon: <Home className="h-6 w-6 stroke-white" />,
  },
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="h-6 w-6 stroke-white" />,
    requiresAuth: true,
  },
  {
    name: "Community",
    href: "/community",
    icon: <Group className="h-6 w-6 stroke-white" />,
    requiresAuth: true,
  },
];

const mobileNavLinks: NavLink[] = [...pcNavLinks];

const MOBILE_BREAKPOINT = 768;

const Header = () => {
  const router = useRouter();
  const { isSignedIn } = useAuth();
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    setMounted(true);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <>
      {/* Desktop header with site title and user button */}
      <header className="relative flex items-center justify-between px-4 py-3 bg-background sm:px-6 sm:py-4 lg:px-6 lg:py-4">
        <div className="hidden lg:block text-3xl font-bold text-primary tracking-tight sm:text-3xl lg:text-4xl">
          <Link href="/" aria-label="StoryCraft Home">
            StoryCraft
          </Link>
        </div>

        <div className="lg:hidden" />

        <nav className="hidden lg:flex lg:space-x-8">
          {pcNavLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => router.push(link.href)}
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
                  userButtonTrigger:
                    "focus:outline-none focus:ring-2 focus:ring-ring",
                },
              }}
            />
          ) : (
            <button
              onClick={() => router.push("/sign-up")}
              className="px-4 py-2 bg-primary text-primary-foreground text-base font-bold rounded-[var(--radius)] hover:bg-primary/90 transition-all duration-300 cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Render MobileDock only on mobile devices after mount */}
      {mounted && isMobile && <MobileDock />}
    </>
  );
};

const MobileDock = () => {
  const { isSignedIn } = useAuth();
  const router = useRouter();

  const dockItems: (
    | DockItem
    | { isUserButton?: true; isSignInButton?: true }
  )[] = [
    ...mobileNavLinks.map(({ name, href, icon, requiresAuth }) => ({
      title: name,
      href,
      icon,
      requiresAuth,
    })),
  ];

  // Add user button or sign-in button at the end based on sign-in status
  if (isSignedIn) {
    dockItems.push({ isUserButton: true });
  } else {
    dockItems.push({ isSignInButton: true });
  }

  const handleTap = (title: string, href: string) => {
    router.push(href);
  };

  return (
    <>
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-background border-t border-border z-50">
        <div className="flex items-center justify-around h-16">
          {dockItems.map((item) => {
            if ("isUserButton" in item && item.isUserButton) {
              // Render Clerk UserButton (no label)
              return (
                <div
                  key="user-button"
                  className="flex flex-col items-center justify-center"
                >
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonAvatarBox: "w-10 h-10",
                        userButtonTrigger:
                          "focus:outline-none focus:ring-2 focus:ring-ring rounded-full",
                      },
                    }}
                  />
                </div>
              );
            } else if ("isSignInButton" in item && item.isSignInButton) {
              // Render sign-in button icon with label
              return (
                <div
                  key="sign-in-button"
                  className="relative flex flex-col items-center"
                >
                  <button
                    onClick={() => router.push("/sign-in")}
                    className="p-2 px-4 rounded-full text-white hover:text-primary hover:bg-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Sign In"
                  >
                    <LogIn className="h-6 w-6 stroke-white" />
                  </button>
                  <span className="text-xs mt-0.5 text-white select-none">
                    Sign In
                  </span>
                </div>
              );
            } else if (isDockItem(item)) {
              // Safe to access DockItem properties
              return (
                <div
                  key={item.title}
                  className="relative flex flex-col items-center"
                >
                  <button
                    onClick={() => handleTap(item.title, item.href)}
                    className="p-2 px-4 rounded-full text-white hover:text-primary hover:bg-primary/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label={item.title}
                  >
                    {item.icon}
                  </button>
                  <span className="text-xs mt-0.5 text-white select-none">
                    {item.title}
                  </span>
                </div>
              );
            }
            return null;
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
