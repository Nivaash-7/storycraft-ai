import { FeatureSteps } from "@/components/ui/feature-section";
import { cn } from "@/lib/utils";
import feature1img from "@/assets/feature1.webp";
import feature2img from "@/assets/feature2.webp";
import feature3img from "@/assets/feature3.webp";

const features = [
  {
    step: "Step 1",
    title: "Get Started",
    content: "Sign up and explore the platform with an interactive onboarding tutorial.",
    image: feature1img.src,
  },
  {
    step: "Step 2",
    title: "Create Your Story",
    content:
      "Start writing with AI-generated prompts in Quick Start or customize your story with themes, genres, and characters in Custom Mode.",
    image: feature2img.src,
  },
  {
    step: "Step 3",
    title: "Share & Connect",
    content:
      "Publish your story, get feedback from the community, and connect with other storytellers.",
    image: feature3img.src,
  },
];

interface FeaturesProps {
  className?: string;
}

export default function Features({ className }: FeaturesProps) {
  return (
    <section
      className={cn(
        "px-4 md:px-8 xl:px-20",
        className
      )}
    >
      <div className="max-w-7xl mx-auto w-full">
        <FeatureSteps
          features={features} 
          title="Your StoryWriting Journey Starts Here"
          autoPlayInterval={4000}
          imageHeight="h-[400px]"
          titleClassName="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground text-center mb-10 sm:mb-14 md:mb-20 lg:mb-24 xl:mb-28"
          stepClassName="text-sm text-muted-foreground"
          contentClassName="text-base text-muted-foreground"
        />
      </div>
    </section>
  );
}