import { TrendingUp, Users, MapPin, Headphones } from 'lucide-react';
import { Counter } from '@/components/Counter';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';

export const StatsSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const stats = [
    {
      icon: TrendingUp,
      value: 10,
      suffix: '+',
      label: t('stats.years'),
      gradient: 'from-gold to-gold-light',
    },
    {
      icon: Users,
      value: 1.5,
      suffix: 'M+',
      label: t('stats.users'),
      gradient: 'from-primary to-primary-light',
    },
    {
      icon: MapPin,
      value: 120,
      suffix: '+',
      label: t('stats.countries'),
      gradient: 'from-gold to-gold-light',
    },
    {
      icon: Headphones,
      value: 24,
      suffix: '/7',
      label: t('stats.support'),
      gradient: 'from-primary to-primary-light',
    },
  ];

  return (
    <section className="py-24 bg-gradient-primary relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 right-0 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            Trusted by Millions Worldwide
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join the global community of satisfied customers who trust Ron Stone Bank for their financial needs.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="group bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/15 hover:border-gold/50 transition-all duration-300 hover:scale-105"
            >
              <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[var(--shadow-gold)]`}>
                <stat.icon className="w-8 h-8 text-primary" />
              </div>
              <div className="text-5xl font-bold text-white mb-2">
                <Counter end={stat.value} suffix={stat.suffix} />
              </div>
              <p className="text-white/70 text-lg">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
