"use client";

import React from "react";
import { SignUp, UserButton, useUser, useClerk, useAuth } from "@clerk/nextjs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Sparkles, ShieldCheck } from "lucide-react";

export default function SignUpPage() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { isLoaded } = useAuth();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <Card className="w-full border-0 shadow-md">
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold">Welcome Back!</h2>
              <p className="text-muted-foreground mt-2">
                You&apos;re already signed in as{" "}
                {user.firstName || user.username}.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
                <UserButton afterSignOutUrl="/" />
                <Button
                  onClick={() =>
                    signOut(() => {
                      window.location.href = "/";
                    })
                  }
                  variant="outline"
                  className="h-10"
                >
                  Sign Out
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-screen w-full items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        <Card className="bg-background py-0 overflow-hidden rounded-[20px] md:rounded-[30px] shadow-md border border-border/50 h-full">
          <div className="grid min-h-[500px] md:min-h-[600px] lg:min-h-[700px] lg:grid-cols-2">
            <div className="brand-side relative m-0 rounded-none bg-black/10 text-white border-r border-gray-700 h-full hidden lg:block">
              <div className="p-4 sm:p-6 md:p-12 flex flex-col h-full">
                <div>
                  <h1 className="mb-3 md:mb-4 text-3xl sm:text-4xl md:text-6xl font-medium text-white">
                    Welcome to the Story Craft AI
                  </h1>
                  <p className="mb-6 sm:mb-8 md:mb-12 text-base sm:text-lg md:text-xl text-muted-foreground/70">
                    Create an account to start crafting and publishing
                    AI-assisted stories
                  </p>

                  <div className="space-y-4 sm:space-y-6">
                    {[
                      {
                        icon: <BookOpen size={16} />,
                        title: "AI Writing Tools",
                        desc: "Develop stories with cutting-edge AI support",
                      },
                      {
                        icon: <Users size={16} />,
                        title: "Global Writers’ Network",
                        desc: "Join a community of storytellers",
                      },
                      {
                        icon: <Sparkles size={16} />,
                        title: "Inspiration Hub",
                        desc: "Access AI-generated story ideas",
                      },
                      {
                        icon: <ShieldCheck size={16} />,
                        title: "Protected Works",
                        desc: "Safeguard your stories securely",
                      },
                    ].map(({ icon, title, desc }, i) => (
                      <div key={i} className="feature-item flex items-center">
                        <div className="mr-3 sm:mr-4 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg bg-muted">
                          {icon}
                        </div>
                        <div>
                          <div className="font-semibold text-white">
                            {title}
                          </div>
                          <div className="text-xs sm:text-sm text-muted-foreground/70">
                            {desc}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex flex-col justify-center p-6 md:p-12 lg:p-10 h-full bg-white w-full">
              <div className="mx-auto w-full max-w-md">
                <SignUp
                  redirectUrl="/"
                  afterSignUpUrl="/dashboard"
                  signInFallbackRedirectUrl="/sign-in"
                  appearance={{
                    elements: {
                      card: "bg-transparent shadow-none border-none",
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
