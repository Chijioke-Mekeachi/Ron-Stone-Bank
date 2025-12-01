import { NavigationBar } from '@/components/NavigationBar';
import { HeroSection } from '@/components/landing/HeroSection';
import { WhyChooseSection } from '@/components/landing/WhyChooseSection';
import { ServicesSection } from '@/components/landing/ServicesSection';
import { StatsSection } from '@/components/landing/StatsSection';
import { FeaturesSection } from '@/components/landing/FeaturesSection';
import { ExchangeRateSection } from '@/components/landing/ExchangeRateSection';
import { TestimonialsSection } from '@/components/landing/TestimonialsSection';
import { Footer } from '@/components/landing/Footer';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <NavigationBar />
      <HeroSection />
      <WhyChooseSection />
      <ServicesSection />
      <ExchangeRateSection />
      <FeaturesSection />
      <StatsSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default Index;
