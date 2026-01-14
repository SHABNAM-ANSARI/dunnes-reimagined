import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { AboutSection } from "@/components/AboutSection";
import { ActivitiesSection } from "@/components/ActivitiesSection";
import { AnnouncementBanner } from "@/components/AnnouncementBanner";
import { ContactSection } from "@/components/ContactSection";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutSection />
        <AnnouncementBanner />
        <ActivitiesSection />
        <ContactSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
