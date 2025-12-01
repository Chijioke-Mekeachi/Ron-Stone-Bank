import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import mobileHeroImg from '@/assets/mobile-app-hero.jpg';

export const HeroSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <section className="relative min-h-screen flex items-center pt-20 bg-gradient-hero overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-48 w-96 h-96 bg-gold/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 -right-48 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-white space-y-8 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
              <CheckCircle className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium">Trusted by 1.5M+ Users Worldwide</span>
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
              {t('hero.title')}
            </h1>

            <p className="text-xl lg:text-2xl text-white/90 max-w-xl">
              {t('hero.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link
                to="/signup"
                className="group bg-gold hover:bg-gold-light text-primary font-bold px-8 py-4 rounded-lg transition-all duration-300 shadow-[var(--shadow-gold)] hover:shadow-lg hover:scale-105 flex items-center justify-center gap-2"
              >
                {t('hero.cta.primary')}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="border-2 border-white/30 hover:border-gold hover:bg-white/10 text-white font-bold px-8 py-4 rounded-lg transition-all duration-300 backdrop-blur-sm flex items-center justify-center"
              >
                {t('hero.cta.secondary')}
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-white/20">
              <div>
                <p className="text-3xl font-bold text-gold">120+</p>
                <p className="text-sm text-white/70">Countries</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold">$10B+</p>
                <p className="text-sm text-white/70">Transferred</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-gold">24/7</p>
                <p className="text-sm text-white/70">Support</p>
              </div>
            </div>
          </div>

          {/* Right Content - Mobile App Mockup */}
          <div className="relative animate-slide-in-right">
            <div className="relative z-10">
              <img
                src={mobileHeroImg}
                alt="Ron Stone Bank Mobile App"
                className="w-full max-w-2xl mx-auto drop-shadow-2xl animate-float"
              />
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-gold/20 to-transparent blur-3xl"></div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="w-full h-auto">
          <path
            fill="hsl(var(--background))"
            fillOpacity="1"
            d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,138.7C960,139,1056,117,1152,101.3C1248,85,1344,75,1392,69.3L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>
      </div>
    </section>
  );
};
