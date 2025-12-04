import { Eye, EyeOff, Copy, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export const AccountOverview = () => {
  const { user } = useAuth();
  const [showBalance, setShowBalance] = useState(true);

  const copyAccountNumber = () => {
    if (user?.accountNumber) {
      navigator.clipboard.writeText(user.accountNumber);
      toast.success('Account number copied!');
    }
  };

  return (
    <div className="bg-gradient-primary rounded-2xl p-8 text-white shadow-[var(--shadow-lg)] relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-gold/5 rounded-full blur-3xl"></div>

      <div className="relative z-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-white/70 text-sm mb-1">Total Balance</p>
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold">
                {showBalance ? `$${user?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '••••••'}
              </h2>
              <button
                onClick={() => setShowBalance(!showBalance)}
                className="text-white/70 hover:text-white transition-colors"
              >
                {showBalance ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
              </button>
            </div>
          </div>

          <div className="text-right">
            <p className="text-white/70 text-sm mb-1">Currency</p>
            <p className="text-2xl font-bold">{user?.currency}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <p className="text-white/70 text-sm mb-1">Account Holder</p>
            <p className="text-lg font-semibold">{user?.name}</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/70 text-sm mb-1">Account Number</p>
                <p className="text-lg font-semibold font-mono">{user?.accountNumber}</p>
              </div>
              <Button
                onClick={copyAccountNumber}
                variant="ghost"
                size="sm"
                className="text-white hover:text-gold hover:bg-white/10"
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-2 text-sm text-white/80">
          <CheckCircle className="w-4 h-4 text-gold" />
          <span>Account verified and secured</span>
        </div>
      </div>
    </div>
  );
};
