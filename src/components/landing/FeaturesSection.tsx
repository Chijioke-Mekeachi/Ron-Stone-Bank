import { Rocket, Shield, Globe2, Bell } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';

export const FeaturesSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const features = [
    {
      icon: Rocket,
      title: t('features.onboarding'),
      description: 'Open your account in minutes with our streamlined digital onboarding process.',
    },
    {
      icon: Shield,
      title: t('features.security'),
      description: 'Bank-grade encryption and multi-factor authentication protect your money 24/7.',
    },
    {
      icon: Globe2,
      title: t('features.international'),
      description: 'Get your own international account number for seamless global transactions.',
    },
    {
      icon: Bell,
      title: 'Real-Time Notifications',
      description: 'Stay informed with instant alerts for every transaction and account activity.',
    },
  ];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('features.title')}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need for modern, secure, and efficient digital banking.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex gap-6 p-8 bg-card rounded-2xl border border-border hover:border-gold transition-all duration-300 hover:shadow-[var(--shadow-lg)]"
            >
              <div className="flex-shrink-0">
                <div className="w-14 h-14 bg-gradient-gold rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-[var(--shadow-gold)]">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
