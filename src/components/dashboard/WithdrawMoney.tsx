import { useState } from 'react';
import { X, Download, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

interface WithdrawMoneyProps {
  onClose: () => void;
}

export const WithdrawMoney: React.FC<WithdrawMoneyProps> = ({ onClose }) => {
  const { user, updateBalance } = useAuth();
  const [amount, setAmount] = useState('');
  const [destination, setDestination] = useState('bank');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if account is active
    if (!user?.is_active) {
      toast.error('Account not active', {
        description: 'Please wait for account activation to perform transactions'
      });
      return;
    }

    const withdrawAmount = parseFloat(amount);
    if (!withdrawAmount || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!user) return;

    if (withdrawAmount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://renostarbank.onrender.com/api/transactions/withdraw`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: withdrawAmount,
    description: `Withdrawal to ${destination}`,
  }),
});

      if (response.ok) {
        const data = await response.json();
        
        // Update local balance
        updateBalance(data.transaction.new_balance);
        
        toast.success(`Successfully withdrew $${withdrawAmount.toFixed(2)}`);
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Withdrawal failed');
      }
    } catch (error) {
      console.error('Withdrawal error:', error);
      toast.error('Withdrawal failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user?.is_active) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-[var(--shadow-lg)] border border-border animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Withdraw Money</h3>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>
          
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-yellow-600" />
            </div>
            <h4 className="text-lg font-semibold text-foreground mb-2">Account Not Active</h4>
            <p className="text-muted-foreground mb-4">
              Your account is pending activation. You cannot perform withdrawals until your account is activated.
            </p>
            <Button onClick={onClose} className="btn-gold">
              Close
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-[var(--shadow-lg)] border border-border animate-scale-in">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">Withdraw Money</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Withdrawal Amount (USD)</Label>
            <Input
              type="number"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
            />
          </div>

          <div>
            <Label>Destination</Label>
            <Select value={destination} onValueChange={setDestination}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bank">Bank Account</SelectItem>
                <SelectItem value="wallet">Digital Wallet</SelectItem>
                <SelectItem value="card">Debit Card</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-semibold text-foreground">
                ${user?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Processing Fee</span>
              <span className="font-semibold text-success">$0.00</span>
            </div>
          </div>

          <div className="bg-gold/10 rounded-lg p-4 border border-gold/30">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> Withdrawals are typically processed within 1-3 business days.
            </p>
          </div>

          <Button type="submit" className="btn-gold w-full" disabled={isProcessing}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                Processing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Withdraw Now
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};