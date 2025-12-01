import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';

export const Footer = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  return (
    <footer id="contact" className="bg-primary text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-gradient-gold rounded-lg flex items-center justify-center shadow-[var(--shadow-gold)]">
                <span className="text-primary font-bold text-2xl">RS</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Ron Stone Bank</h3>
                <p className="text-xs text-white/70">Digital Banking Excellence</p>
              </div>
            </div>
            <p className="text-white/70 leading-relaxed mb-6">
              Your trusted partner in digital banking. Fast, secure, and borderless financial services for the modern world.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 bg-white/10 hover:bg-gold rounded-lg flex items-center justify-center transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.about')}</h4>
            <ul className="space-y-3">
              <li><a href="#features" className="text-white/70 hover:text-gold transition-colors">Features</a></li>
              <li><a href="#services" className="text-white/70 hover:text-gold transition-colors">Services</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors">About Us</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors">Careers</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.support')}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors">Help Center</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors">FAQs</a></li>
              <li><a href="#" className="text-white/70 hover:text-gold transition-colors">Security</a></li>
              <li><Link to="/login" className="text-white/70 hover:text-gold transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">{t('footer.contact')}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span className="text-white/70">support@ronstonebank.com</span>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span className="text-white/70">+1 (800) 123-4567</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold flex-shrink-0 mt-1" />
                <span className="text-white/70">123 Financial District, New York, NY 10005</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/20 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/70 text-sm">
              © 2024 Ron Stone Bank. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-white/70 hover:text-gold transition-colors">Privacy Policy</a>
              <a href="#" className="text-white/70 hover:text-gold transition-colors">Terms of Service</a>
              <a href="#" className="text-white/70 hover:text-gold transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
