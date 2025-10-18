import Link from "next/link";
import {
  Sparkles,
  MessageSquare,
  Lightbulb,
  Heart,
  MessageCircle,
  Share2,
  Lock,
  Edit3,
  ArrowRight,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2">
            <Zap className="h-4 w-4 text-primary" />
            <span className="text-sm text-muted-foreground">
              Powerful AI Writing Tools
            </span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-foreground">
            Write Better Stories with{" "}
            <span className="text-primary">AI Assistance</span>
          </h1>

          <p className="mb-8 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            StoryCraftAI combines powerful AI tools with community features to
            help you create, refine, and share your stories. From generation to
            feedback, we&apos;ve got everything you need.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/create-story">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base w-full sm:w-auto">
                Start Writing Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/community">
              <Button
                variant="outline"
                className="border-border text-foreground hover:bg-card px-8 py-6 text-base bg-transparent w-full sm:w-auto"
              >
                Explore Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* AI Writing Modes - Featured Section */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8 bg-card/30">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              AI Writing Modes
            </h2>
            <p className="text-muted-foreground">
              Choose the perfect tool for your creative process
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Generate */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
              <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-4">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">
                Generate
              </h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Describe a scene or character. AI generates content with an
                &quot;Edit &amp; Use&quot; button to customize before adding to
                your story.
              </p>
            </div>

            {/* Chat */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-secondary/50 hover:shadow-lg hover:shadow-secondary/10">
              <div className="mb-6 inline-flex rounded-lg bg-secondary/10 p-4">
                <MessageSquare className="h-6 w-6 text-secondary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">Chat</h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Discuss story ideas, ask questions, and chat about your creative
                process with TaleWeaver AI.
              </p>
            </div>

            {/* Feedback */}
            <div className="group relative overflow-hidden rounded-lg border border-border bg-background p-8 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10">
              <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-4">
                <Lightbulb className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mb-3 text-xl font-bold text-foreground">
                Feedback
              </h3>
              <p className="mb-6 text-muted-foreground leading-relaxed">
                Get specific feedback on pacing, characters, and dialogue. Write
                content first to unlock detailed insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Community Features */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Community & Engagement
            </h2>
            <p className="text-muted-foreground">
              Connect with writers and share your work
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Publish */}
            <div className="rounded-lg border border-border bg-background p-6 transition-all hover:border-primary/50">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Share2 className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mb-2 font-semibold text-foreground">
                Publish & Share
              </h4>
              <p className="text-sm text-muted-foreground">
                Share your stories with the community and get discovered
              </p>
            </div>

            {/* Draft */}
            <div className="rounded-lg border border-border bg-background p-6 transition-all hover:border-secondary/50">
              <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                <Lock className="h-5 w-5 text-secondary" />
              </div>
              <h4 className="mb-2 font-semibold text-foreground">
                Keep as Draft
              </h4>
              <p className="text-sm text-muted-foreground">
                Work privately and publish when you&apos;re ready
              </p>
            </div>

            {/* Like */}
            <div className="rounded-lg border border-border bg-background p-6 transition-all hover:border-primary/50">
              <div className="mb-4 inline-flex rounded-lg bg-primary/10 p-3">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <h4 className="mb-2 font-semibold text-foreground">
                Like Stories
              </h4>
              <p className="text-sm text-muted-foreground">
                Show appreciation for great work in the community
              </p>
            </div>

            {/* Comment */}
            <div className="rounded-lg border border-border bg-background p-6 transition-all hover:border-secondary/50">
              <div className="mb-4 inline-flex rounded-lg bg-secondary/10 p-3">
                <MessageCircle className="h-5 w-5 text-secondary" />
              </div>
              <h4 className="mb-2 font-semibold text-foreground">
                Comment & Discuss
              </h4>
              <p className="text-sm text-muted-foreground">
                Engage in meaningful discussions with other writers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story Management */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8 bg-card/30">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Full Story Control
            </h2>
            <p className="text-muted-foreground">
              Everything you need to manage your creative work
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Features List */}
            <div className="rounded-lg border border-border bg-background p-8">
              <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3">
                <Edit3 className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mb-6 text-xl font-bold text-foreground">
                Complete Flexibility
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Edit anytime, even after publishing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Auto-save as you write
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Preview before publishing
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Version history and recovery
                  </span>
                </li>
              </ul>
            </div>

            {/* Journey Steps */}
            <div className="rounded-lg border border-border bg-background p-8">
              <h3 className="mb-6 text-xl font-bold text-foreground">
                Your Creative Journey
              </h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Start Writing</p>
                    <p className="text-sm text-muted-foreground">
                      Begin your story with a blank canvas
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Use AI Tools</p>
                    <p className="text-sm text-muted-foreground">
                      Generate, chat, and get feedback
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-sm">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Refine & Edit</p>
                    <p className="text-sm text-muted-foreground">
                      Polish your work to perfection
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-secondary-foreground font-bold text-sm">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-foreground">
                      Publish or Keep Private
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Share with the world or keep it yours
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t border-border px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="mb-4 text-4xl font-bold text-foreground">
            Ready to Start Your Story?
          </h2>
          <p className="mb-8 text-lg text-muted-foreground leading-relaxed">
            Join thousands of writers using StoryCraftAI to bring their creative
            visions to life. Start writing today and discover what you can
            create.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Link href="/create-story">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-base w-full sm:w-auto">
                Create Your First Story
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
