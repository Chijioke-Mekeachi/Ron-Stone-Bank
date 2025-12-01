import { useState } from 'react';
import { X, Send, Loader2, CheckCircle, Lock } from 'lucide-react';
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

interface USBankTransferProps {
  onClose: () => void;
}

// Sample U.S. bank routing numbers database
const US_BANKS: Record<string, string> = {
  '021000021': 'JPMorgan Chase Bank',
  '026009593': 'Bank of America',
  '121000248': 'Wells Fargo Bank',
  '111000025': 'Bank of New York Mellon',
  '121000358': 'US Bank',
  '031101279': 'The Bancorp Bank',
  '053101561': 'FirstBank',
  '041215663': 'Sutton Bank',
  '122105278': 'Wells Fargo Bank South Dakota',
  '124303120': 'Navy Federal Credit Union',
};

export const USBankTransfer: React.FC<USBankTransferProps> = ({ onClose }) => {
  const { user, updateBalance } = useAuth();
  const [fullName, setFullName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [detectedBank, setDetectedBank] = useState<string | null>(null);
  const [isCheckingBank, setIsCheckingBank] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRoutingNumberChange = (value: string) => {
    setRoutingNumber(value);
    setDetectedBank(null);

    if (value.length === 9) {
      setIsCheckingBank(true);
      setTimeout(() => {
        const bankName = US_BANKS[value];
        setDetectedBank(bankName || 'Unknown Bank');
        setIsCheckingBank(false);
      }, 800);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Check if account is active
    if (!user?.is_active) {
      toast.error('Account not active', {
        description: 'Please wait for account activation to perform transactions'
      });
      return;
    }

    if (routingNumber.length !== 9) {
      toast.error('Routing number must be 9 digits');
      return;
    }

    if (!detectedBank || detectedBank === 'Unknown Bank') {
      toast.error('Invalid routing number');
      return;
    }

    const transferAmount = parseFloat(amount);
    if (!transferAmount || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (!user) return;

    if (transferAmount > user.balance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);

    try {
      const token = localStorage.getItem('access_token');
      const response = await fetch(`https://renostarbank.onrender.com/transactions/transfer`, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    amount: transferAmount,
    description: note || `US Bank Transfer to ${detectedBank}`,
    to_account_number: `${detectedBank} - ${accountNumber.slice(-4)}`,
  }),
});

      if (response.ok) {
        const data = await response.json();
        updateBalance(data.transaction.new_balance);

        toast.success(
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-success" />
            <div>
              <p className="font-semibold">Transfer Successful!</p>
              <p className="text-sm">${transferAmount.toFixed(2)} sent to {fullName}</p>
            </div>
          </div>
        );
        onClose();
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Transfer failed');
      }
    } catch (error) {
      console.error('Transfer error:', error);
      toast.error('Transfer failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!user?.is_active) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-[var(--shadow-lg)] border border-border animate-scale-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">US Bank Transfer</h3>
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
              Your account is pending activation. You cannot perform US bank transfers until your account is activated.
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
      <div className="bg-card rounded-2xl p-6 max-w-md w-full shadow-[var(--shadow-lg)] border border-border animate-scale-in max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-foreground">US Bank Transfer</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Full Name</Label>
            <Input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              required
            />
          </div>

          <div>
            <Label>Bank Routing Number (9 digits)</Label>
            <Input
              value={routingNumber}
              onChange={(e) => handleRoutingNumberChange(e.target.value.replace(/\D/g, '').slice(0, 9))}
              placeholder="021000021"
              maxLength={9}
              required
            />
            {isCheckingBank && (
              <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Detecting bank...</span>
              </div>
            )}
            {detectedBank && !isCheckingBank && (
              <div className={`flex items-center gap-2 mt-2 text-sm ${detectedBank === 'Unknown Bank' ? 'text-destructive' : 'text-success'}`}>
                <CheckCircle className="w-4 h-4" />
                <span className="font-semibold">{detectedBank}</span>
              </div>
            )}
          </div>

          <div>
            <Label>Bank Account Number</Label>
            <Input
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value.replace(/\D/g, ''))}
              placeholder="1234567890"
              required
            />
          </div>

          <div>
            <Label>Account Type</Label>
            <Select value={accountType} onValueChange={setAccountType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="checking">Checking</SelectItem>
                <SelectItem value="savings">Savings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Amount in USD</Label>
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
            <Label>Optional Note</Label>
            <Input
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Payment description..."
            />
          </div>

          <div className="bg-secondary rounded-lg p-4 border border-border">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Available Balance</span>
              <span className="font-semibold text-foreground">
                ${user?.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Transfer Fee</span>
              <span className="font-semibold text-success">$0.00</span>
            </div>
          </div>

          <div className="bg-gold/10 rounded-lg p-4 border border-gold/30">
            <p className="text-sm text-foreground">
              <strong>Note:</strong> This is a demo interface. No real transactions will be processed.
            </p>
          </div>

          <Button type="submit" className="btn-gold w-full" disabled={isProcessing || !detectedBank || detectedBank === 'Unknown Bank'}>
            {isProcessing ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing Transfer...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                Send Money
              </span>
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};