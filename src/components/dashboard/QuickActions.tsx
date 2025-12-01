import { useState } from 'react';
import { Send, Download, CreditCard, PiggyBank, Settings, Lock } from 'lucide-react';
import { TransferMoney } from './TransferMoney';
import { WithdrawMoney } from './WithdrawMoney';
import { USBankTransfer } from './USBankTransfer';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const QuickActions = () => {
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const { user } = useAuth();

  const handleActionClick = (actionId: string) => {
    if (!user?.is_active) {
      toast.error('Account not active', {
        description: 'Please wait for account activation to perform transactions'
      });
      return;
    }
    setActiveAction(actionId);
  };

  const actions = [
    {
      id: 'send',
      icon: user?.is_active ? Send : Lock,
      label: 'Send Money',
      color: user?.is_active ? 'from-gold to-gold-light' : 'from-gray-400 to-gray-500',
      disabled: !user?.is_active,
    },
    {
      id: 'withdraw',
      icon: user?.is_active ? Download : Lock,
      label: 'Withdraw',
      color: user?.is_active ? 'from-primary to-primary-light' : 'from-gray-400 to-gray-500',
      disabled: !user?.is_active,
    },
    {
      id: 'us-transfer',
      icon: user?.is_active ? CreditCard : Lock,
      label: 'US Bank Transfer',
      color: user?.is_active ? 'from-gold to-gold-dark' : 'from-gray-400 to-gray-500',
      disabled: !user?.is_active,
    },
    {
      id: 'savings',
      icon: PiggyBank,
      label: 'Savings',
      color: 'from-primary to-primary-light',
      disabled: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-md)] border border-border">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-foreground">Quick Actions</h3>
          {!user?.is_active && (
            <div className="flex items-center gap-2 px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 rounded-full">
              <Lock className="w-3 h-3 text-yellow-600" />
              <span className="text-xs font-medium text-yellow-700">Account Pending</span>
            </div>
          )}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleActionClick(action.id)}
              disabled={action.disabled}
              className={`group flex flex-col items-center gap-3 p-4 rounded-xl bg-gradient-to-br ${action.color} ${
                action.disabled 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:scale-105 transition-transform duration-300'
              } shadow-[var(--shadow-md)]`}
            >
              <action.icon className={`w-8 h-8 ${
                action.disabled ? 'text-gray-600' : 'text-primary'
              }`} />
              <span className={`text-sm font-semibold ${
                action.disabled ? 'text-gray-600' : 'text-primary'
              }`}>
                {action.label}
                {action.disabled && (
                  <span className="block text-xs font-normal text-gray-500 mt-1">
                    Not Available
                  </span>
                )}
              </span>
            </button>
          ))}
        </div>

        {!user?.is_active && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
            <p className="text-sm text-yellow-700 text-center">
              Your account is pending activation. Some features will be unavailable until your account is activated.
            </p>
          </div>
        )}
      </div>

      {/* Render active action component */}
      {activeAction === 'send' && <TransferMoney onClose={() => setActiveAction(null)} />}
      {activeAction === 'withdraw' && <WithdrawMoney onClose={() => setActiveAction(null)} />}
      {activeAction === 'us-transfer' && <USBankTransfer onClose={() => setActiveAction(null)} />}
    </div>
  );
};