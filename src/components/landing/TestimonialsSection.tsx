import { Star } from 'lucide-react';

export const TestimonialsSection = () => {
  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Entrepreneur',
      image: '/user001.png',
      rating: 5,
      text: 'Ron Stone Bank has transformed how I manage my international business payments. Fast, secure, and incredibly user-friendly.',
    },
    {
      name: 'Michael Chen',
      role: 'Software Developer',
      image: '/user002.png', // FIXED
      rating: 5,
      text: 'The multi-currency accounts are a game-changer. I can receive payments from clients worldwide without worrying about exchange rates.',
    },
    {
      name: 'Emma Williams',
      role: 'Frequent Traveler',
      image: '/user004.jpeg', // FIXED
      rating: 5,
      text: 'Banking made simple! The mobile app is fantastic, and customer support is always there when I need them.',
    },
    {
      name: 'David Martinez',
      role: 'Small Business Owner',
      image: '/user003.jpeg',
      rating: 5,
      text: 'Zero hidden fees and transparent pricing. Finally, a bank that respects its customers and their hard-earned money.',
    },
  ];

  const Avatar = ({ src, name }: { src: string; name: string }) => {
    const isEmoji = !src.startsWith('/');
    return (
      <div className="w-14 h-14 rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl shrink-0 border border-border">
        {isEmoji ? (
          <span>{src}</span>
        ) : (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover"
          />
        )}
      </div>
    );
  };

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <div className="w-24 h-1 bg-gradient-gold mx-auto rounded-full"></div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl p-6 shadow-[var(--shadow-md)] hover:shadow-[var(--shadow-lg)] transition-all duration-300 border border-border hover:border-gold group"
            >
              <div className="flex items-center gap-4 mb-4">
                <Avatar src={t.image} name={t.name} />

                <div>
                  <h4 className="font-bold text-foreground">{t.name}</h4>
                  <p className="text-sm text-muted-foreground">{t.role}</p>
                </div>
              </div>

              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-gold text-gold" />
                ))}
              </div>

              <p className="text-muted-foreground leading-relaxed">{t.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
