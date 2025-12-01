import { Smartphone, Wallet, Send, CreditCard } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { getTranslation } from '@/utils/translations';
import multiCurrencyImg from '@/assets/multi-currency-app.jpg';
import sendMoneyImg from '@/assets/send-money-app.jpg';
import transactionsImg from '@/assets/transactions-app.jpg';

export const ServicesSection = () => {
  const { language } = useLanguage();
  const t = (key: string) => getTranslation(key, language);

  const services = [
    {
      icon: Smartphone,
      title: t('services.banking.title'),
      description: t('services.banking.desc'),
      image: transactionsImg,
    },
    {
      icon: Wallet,
      title: t('services.wallet.title'),
      description: t('services.wallet.desc'),
      image: multiCurrencyImg,
    },
    {
      icon: Send,
      title: t('services.transfers.title'),
      description: t('services.transfers.desc'),
      image: sendMoneyImg,
    },
    {
      icon: CreditCard,
      title: t('services.cards.title'),
      description: t('services.cards.desc'),
      image: null,
    },
  ];

  return (
    <section id="services" className="py-24 bg-secondary relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            {t('services.title')}
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl overflow-hidden shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 hover:-translate-y-2"
            >
              {service.image && (
                <div className="h-48 overflow-hidden bg-primary">
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
              )}
              {!service.image && (
                <div className="h-48 bg-gradient-primary flex items-center justify-center">
                  <service.icon className="w-20 h-20 text-gold opacity-80" />
                </div>
              )}
              <div className="p-6">
                <div className="w-12 h-12 bg-gradient-gold rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{service.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{service.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
