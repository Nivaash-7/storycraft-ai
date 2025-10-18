"use client";
import * as React from "react";
import {
  Book,
  Home,
  LayoutDashboard,
  PlusCircle,
  LogOut,
  Group,
  ChevronsUpDownIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton, UserButton, useUser } from "@clerk/nextjs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface AppSidebarProps {
  className?: string;
}

function AppSidebar({ className }: AppSidebarProps) {
  const router = useRouter();
  const { user } = useUser();
  const { setOpen, open, isMobile } = useSidebar();

  const handleMouseEnter = () => {
    if (!isMobile) {
      setOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile) {
      setOpen(false);
    }
  };

  const homeItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
      onClick: () => router.push("/"),
    },
  ];

  const analyticsItems = [
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      onClick: () => router.push("/dashboard"),
    },
    {
      title: "My Stories",
      icon: Book,
      url: "/my-stories",
      onClick: () => router.push("/my-stories"),
    },
  ];

  const createItems = [
    {
      title: "New Story",
      icon: PlusCircle,
      url: "/create-story",
      onClick: () => router.push("/create-story"),
    },
    {
      title: "Community",
      icon: Group,
      url: "/community",
      onClick: () => router.push("/community"),
    },
  ];

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="h-full"
    >
      <Sidebar
        collapsible="icon"
        className={cn("bg-sidebar text-sidebar-foreground border-sidebar-border", className)}
        style={{ minWidth: !open ? "70px" : "240px" }}
      >
        <SidebarHeader className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg">
                <div
                  className={cn(
                    "flex aspect-square items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground",
                    !open ? "size-8" : "size-10"
                  )}
                >
                  <Book className={cn("size-5", !open && "size-5")} />
                </div>
                {open && (
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">StoryCraft AI</span>
                    <span className="text-xs text-sidebar-accent-foreground">
                      Storyteller
                    </span>
                  </div>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="mt-10 py-1">
          <SidebarGroup>
            <SidebarGroupLabel className="py-1 text-xs text-sidebar-accent-foreground">
              Home
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {homeItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault();
                          item.onClick();
                        }}
                      >
                        <item.icon
                          className={cn("size-5 mr-2", !open && "size-5")}
                        />
                        {open && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-1">
            <SidebarGroupLabel className="py-1 text-xs text-sidebar-accent-foreground">
              Analytics
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {analyticsItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault();
                          item.onClick();
                        }}
                      >
                        <item.icon
                          className={cn("size-5 mr-2", !open && "size-5")}
                        />
                        {open && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-1">
            <SidebarGroupLabel className="py-1 text-xs text-sidebar-accent-foreground">
              Create
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-0.5">
                {createItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a
                        href={item.url}
                        onClick={(e) => {
                          e.preventDefault();
                          item.onClick();
                        }}
                      >
                        <item.icon
                          className={cn("size-5 mr-2", !open && "size-5")}
                        />
                        {open && <span>{item.title}</span>}
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="cursor-pointer w-full h-full">
                    <div
                      className={cn(
                        "flex items-center gap-2 w-full h-full",
                        !open && "justify-center"
                      )}
                    >
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            userButtonAvatarBox: cn(
                              "rounded-full",
                              !open ? "h-8 w-8" : "h-10 w-10"
                            ),
                          },
                        }}
                      />
                      {open && (
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">
                            {user?.fullName || "Storyteller"}
                          </span>
                          <span className="text-xs text-sidebar-accent-foreground truncate max-w-[120px]">
                            {user?.emailAddresses[0]?.emailAddress ||
                              "user@example.com"}
                          </span>
                        </div>
                      )}
                      {open && <ChevronsUpDownIcon className="ml-auto size-5" />}
                    </div>
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="end"
                  className="w-56 bg-sidebar text-sidebar-foreground border-sidebar-border"
                >
                  <DropdownMenuItem
                    className="hover:bg-sidebar-accent focus:bg-sidebar-accent cursor-pointer"
                  >
                    <SignOutButton redirectUrl="/">
                      <button className="flex w-full items-center">
                        <LogOut className="mr-2 size-5" />
                        <span>Log out</span>
                      </button>
                    </SignOutButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
    </div>
  );
}

interface ModernSidebarProps {
  children: React.ReactNode;
}

export function ModernSidebar({ children }: ModernSidebarProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <SidebarInset>
        <main 
          className="flex-1 overflow-auto bg-background text-foreground relative pb-0" 
        >
          {children}
          <MobileNavbar />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

function MobileNavbar() {
  const { isMobile } = useSidebar();
  const router = useRouter();

  const mobileNavItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
      onClick: () => router.push("/"),
    },
    {
      title: "MyStories",
      icon: Book,
      url: "/my-stories",
      onClick: () => router.push("/my-stories"),
    },
    {
      title: "Community",
      icon: Group,
      url: "/community",
      onClick: () => router.push("/community"),
    },
    {
      title: "Profile",
      icon: UserButton,
    },
  ];

  if (!isMobile) return null;

  return (
    <nav 
      className="fixed bottom-0 left-0 right-0 bg-background text-sidebar-foreground border-t border-sidebar-border flex justify-around items-center h-16 md:hidden z-10 p-0 m-0" 
    >
      {mobileNavItems.map((item, index) => (
        <button
          key={index}
          onClick={item.onClick}
          className="flex flex-col items-center justify-center flex-1 h-full hover:bg-sidebar-accent p-0 m-0" 
          aria-label={item.title}
        >
          {item.icon === UserButton ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  userButtonAvatarBox: "h-6 w-6",
                },
              }}
            />
          ) : (
            <item.icon className="h-6 w-6" />
          )}
          <span className="text-xs mt-1 p-0 m-0">{item.title}</span>
        </button>
      ))}
    </nav>
  );
}