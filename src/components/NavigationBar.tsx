import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Moon, Sun } from 'lucide-react';
import { LanguageSelector } from './LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from '@/contexts/ThemeContext';

export const NavigationBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language } = useLanguage();
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const t = (key: string) => getTranslation(key, language);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-background/95 backdrop-blur-md shadow-[var(--shadow-md)]'
          : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center shadow-[var(--shadow-gold)] group-hover:scale-110 transition-transform duration-300">
              <span className="text-primary font-bold text-2xl">RS</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold text-foreground">Ron Stone Bank</h1>
              <p className="text-xs text-muted-foreground">Digital Banking Excellence</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a href="#features" className="text-foreground hover:text-gold transition-colors duration-300 font-medium">
              {t('nav.features')}
            </a>
            <a href="#services" className="text-foreground hover:text-gold transition-colors duration-300 font-medium">
              {t('nav.services')}
            </a>
            <a href="#about" className="text-foreground hover:text-gold transition-colors duration-300 font-medium">
              {t('nav.about')}
            </a>
            <a href="#contact" className="text-foreground hover:text-gold transition-colors duration-300 font-medium">
              {t('nav.contact')}
            </a>
          </div>

          {/* Right Section */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-accent transition-colors"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-foreground" /> : <Moon className="w-5 h-5 text-foreground" />}
            </button>
            <LanguageSelector />
            {user ? (
              <Link to="/dashboard" className="btn-gold">
                Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="btn-outline">
                  {t('nav.login')}
                </Link>
                <Link to="/signup" className="btn-gold">
                  {t('nav.signup')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:text-gold transition-colors"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-card border-t border-border py-4 animate-fade-in">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-foreground hover:text-gold transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.features')}
              </a>
              <a
                href="#services"
                className="text-foreground hover:text-gold transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.services')}
              </a>
              <a
                href="#about"
                className="text-foreground hover:text-gold transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.about')}
              </a>
              <a
                href="#contact"
                className="text-foreground hover:text-gold transition-colors duration-300 font-medium px-4 py-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t('nav.contact')}
              </a>
              <div className="px-4 py-2">
                <LanguageSelector />
              </div>
              {user ? (
                <Link to="/dashboard" className="btn-gold mx-4" onClick={() => setIsMobileMenuOpen(false)}>
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link to="/login" className="btn-outline mx-4" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.login')}
                  </Link>
                  <Link to="/signup" className="btn-gold mx-4" onClick={() => setIsMobileMenuOpen(false)}>
                    {t('nav.signup')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
