
"use client";
import * as React from "react";
import {
  Book,
  Home,
  LayoutDashboard,
  BookOpen,
  Edit,
  PlusCircle,
  LogOut,
  ChevronRight,
  Group,
  ChevronsUpDownIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { SignOutButton, UserButton, useUser, useClerk } from "@clerk/nextjs";
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

export function AppSidebar({ className }: AppSidebarProps) {
  const router = useRouter();
  const { user } = useUser();
  const { redirectToUserProfile } = useClerk();
  const { setOpen, open } = useSidebar();
  const [openMenus, setOpenMenus] = React.useState<Record<string, boolean>>({
    story: false,
  });

  // Close all dropdowns when the sidebar collapses
  React.useEffect(() => {
    if (!open) {
      setOpenMenus({ story: false });
    }
  }, [open]);

  const toggleMenu = (menu: string) => {
    setOpenMenus((prev) => ({
      ...prev,
      [menu]: !prev[menu],
    }));
  };

  const homeItems = [
    {
      title: "Home",
      icon: Home,
      url: "/",
      onClick: () => router.push("/"),
    },
    {
      title: "Dashboard",
      icon: LayoutDashboard,
      url: "/dashboard",
      onClick: () => router.push("/dashboard"),
    },
    {
      title: "Story",
      icon: BookOpen,
      onClick: () => toggleMenu("story"),
      hasSubMenu: true,
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
    {
      title: "Drafts",
      icon: BookOpen,
      url: "/drafts",
      onClick: () => router.push("/drafts"),
    },
  ];

  const handleMouseEnter = () => {
    setOpen(true);
  };

  const handleMouseLeave = () => {
    setOpen(false);
  };

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

        <SidebarContent className="py-2">
          <SidebarGroup>
            <SidebarGroupLabel className="py-2 text-xs text-sidebar-accent-foreground">
              Home
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
                {homeItems.map((item) =>
                  item.hasSubMenu ? (
                    <React.Fragment key={item.title}>
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          tooltip={item.title}
                          onClick={item.onClick}
                          className="flex w-full cursor-pointer items-center justify-between"
                        >
                          <div className="flex items-center">
                            <item.icon
                              className={cn("size-5 mr-2", !open && "size-5")}
                            />
                            {open && <span>{item.title}</span>}
                          </div>
                          {open && (
                            <ChevronRight
                              className={cn(
                                "size-5 transition-transform duration-200",
                                openMenus.story && "rotate-90"
                              )}
                            />
                          )}
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      <SidebarGroupContent
                        className={cn(
                          "grid transition-all duration-200 ease-in-out pl-4",
                          openMenus.story && open
                            ? "grid-rows-[1fr] opacity-100"
                            : "grid-rows-[0fr] opacity-0"
                        )}
                      >
                        <div className="overflow-hidden">
                          <SidebarMenu className="gap-1">
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild tooltip="My Stories">
                                <a
                                  href="/my-stories"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/my-stories");
                                  }}
                                >
                                  <BookOpen
                                    className={cn(
                                      "size-5 mr-2",
                                      !open && "size-4"
                                    )}
                                  />
                                  {open && <span>My Stories</span>}
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                            <SidebarMenuItem>
                              <SidebarMenuButton asChild tooltip="Edit Story">
                                <a
                                  href="/edit-story"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    router.push("/edit-story");
                                  }}
                                >
                                  <Edit
                                    className={cn(
                                      "size-5 mr-2",
                                      !open && "size-4"
                                    )}
                                  />
                                  {open && <span>Edit Story</span>}
                                </a>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          </SidebarMenu>
                        </div>
                      </SidebarGroupContent>
                    </React.Fragment>
                  ) : (
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
                  )
                )}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup className="mt-4">
            <SidebarGroupLabel className="py-2 text-xs text-sidebar-accent-foreground">
              Create
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="gap-1">
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
        <main className="flex-1 overflow-auto bg-background text-foreground">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}