import Header from "@/components/Header";
import { Hero } from "@/components/Hero";
import Features from "@/components/Features";
import { CTABanner } from "@/components/CTABanner";
import { Footer } from "@/components/Footer";
import { Community } from "@/components/Community";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <div id="hero">
        <Hero />
      </div>
      <div id="features">
        <Features />
      </div>
      <div id="community">
        <Community />
      </div>
      <CTABanner />
      <Footer />
    </main>
  );
}
