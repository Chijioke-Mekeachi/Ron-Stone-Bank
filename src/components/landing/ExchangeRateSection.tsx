import { useState, useEffect } from 'react';
import { TrendingUp, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const ExchangeRateSection = () => {
  const [rates, setRates] = useState([
    { from: 'USD', to: 'EUR', rate: 0.92, change: 0.5 },
    { from: 'USD', to: 'GBP', rate: 0.79, change: -0.3 },
    { from: 'USD', to: 'JPY', rate: 149.82, change: 1.2 },
    { from: 'EUR', to: 'GBP', rate: 0.86, change: 0.2 },
  ]);

  // Simulate live rate updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRates(prevRates =>
        prevRates.map(rate => ({
          ...rate,
          rate: rate.rate + (Math.random() - 0.5) * 0.01,
          change: (Math.random() - 0.5) * 2,
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleSetAlert = () => {
    toast.success('Rate alert set! We\'ll notify you when rates change.');
  };

  return (
    <section className="py-24 bg-secondary">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Live Exchange Rates
            </h2>
            <p className="text-xl text-muted-foreground">
              Real-time currency exchange rates updated every second
            </p>
          </div>

          <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-lg)] border border-border">
            {/* Chart Placeholder */}
            <div className="bg-gradient-to-br from-primary/5 to-gold/5 rounded-xl p-8 mb-8 min-h-[200px] flex items-center justify-center border border-border">
              <div className="text-center">
                <TrendingUp className="w-16 h-16 text-gold mx-auto mb-4" />
                <p className="text-muted-foreground">Interactive exchange rate chart</p>
              </div>
            </div>

            {/* Live Rates */}
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {rates.map((rate, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-secondary rounded-xl border border-border hover:border-gold transition-colors"
                >
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {rate.from} / {rate.to}
                    </p>
                    <p className="text-2xl font-bold text-foreground">{rate.rate.toFixed(4)}</p>
                  </div>
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded-full ${
                      rate.change >= 0 ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
                    }`}
                  >
                    <TrendingUp
                      className={`w-4 h-4 ${rate.change < 0 ? 'rotate-180' : ''}`}
                    />
                    <span className="text-sm font-medium">{Math.abs(rate.change).toFixed(2)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <Button onClick={handleSetAlert} className="btn-gold w-full sm:w-auto">
              <Bell className="w-4 h-4 mr-2" />
              Set Rate Alert
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
