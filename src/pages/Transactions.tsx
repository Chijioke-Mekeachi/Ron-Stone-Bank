import { ArrowUpRight, ArrowDownLeft, CheckCircle, Clock, RefreshCw } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom'; // Added for navigation

interface Transaction {
  id: string;
  created_at: string;
  type: 'credit' | 'debit';
  amount: number;
  status: 'completed' | 'pending' | 'failed';
  description: string;
  to_account_number?: string;
}

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export default function RecentTransactions () {
  const { user } = useAuth();
  const navigate = useNavigate(); // Added for navigation
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      fetchRecentTransactions();
    }
  }, [user]);

  const fetchRecentTransactions = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('access_token');
      const response = await fetch('/api/transactions?limit=8', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data: TransactionsResponse = await response.json();
        setTransactions(data.transactions || []);
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to fetch transactions');
        setTransactions([]);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast.error('Failed to load transactions');
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    fetchRecentTransactions();
  };

  const handleViewAll = () => {
    navigate('/transactions'); // Navigate to full transactions page
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
    const diffMinutes = Math.ceil(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays <= 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'pending':
        return <Clock className="w-3 h-3 text-yellow-500" />;
      case 'failed':
        return <div className="w-3 h-3 rounded-full bg-red-500" />;
      default:
        return <Clock className="w-3 h-3 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600';
      case 'pending':
        return 'text-yellow-600';
      case 'failed':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  // Calculate totals for the summary
  const totalCredits = transactions.filter(t => t.type === 'credit').length;
  const totalDebits = transactions.filter(t => t.type === 'debit').length;
  const totalAmount = transactions.reduce((sum, t) => {
    if (t.type === 'credit') return sum + t.amount;
    return sum - t.amount;
  }, 0);

  return (
    <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-md)] border border-border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-foreground">Recent Transactions</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="h-8 w-8 p-0"
            title="Refresh transactions"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleViewAll}
            className="text-gold hover:text-gold-light text-sm font-semibold transition-colors h-8 px-3"
          >
            View All
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">Loading transactions...</span>
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <ArrowUpRight className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground mb-2">No transactions yet</p>
          <p className="text-sm text-muted-foreground">
            Your transaction history will appear here
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-secondary rounded-xl hover:bg-secondary/80 transition-colors border border-border group cursor-pointer"
              onClick={() => navigate(`/transactions/${transaction.id}`)} // Added click handler
            >
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'credit'
                      ? 'bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-red-100 text-red-600 dark:bg-red-900/20 dark:text-red-400'
                  }`}
                >
                  {transaction.type === 'credit' ? (
                    <ArrowDownLeft className="w-6 h-6" />
                  ) : (
                    <ArrowUpRight className="w-6 h-6" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground truncate">
                    {transaction.description}
                  </p>
                  {transaction.to_account_number && (
                    <p className="text-xs text-muted-foreground truncate">
                      To: {transaction.to_account_number}
                    </p>
                  )}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <span>{formatDate(transaction.created_at)}</span>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(transaction.status)}
                      <span className={getStatusColor(transaction.status)}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div
                className={`text-right flex-shrink-0 ml-4 ${
                  transaction.type === 'credit' 
                    ? 'text-green-600 dark:text-green-400' 
                    : 'text-foreground'
                }`}
              >
                <p className="text-lg font-bold whitespace-nowrap">
                  {transaction.type === 'credit' ? '+' : '-'}$
                  {formatCurrency(transaction.amount)}
                </p>
                <p className="text-sm text-muted-foreground">USD</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Transaction Summary */}
      {transactions.length > 0 && (
        <div className="mt-6 pt-6 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-green-600 font-semibold">
                {totalCredits}
              </div>
              <div className="text-muted-foreground">Credits</div>
            </div>
            <div className="text-center">
              <div className="text-red-600 font-semibold">
                {totalDebits}
              </div>
              <div className="text-muted-foreground">Debits</div>
            </div>
            <div className="text-center">
              <div className={`font-semibold ${totalAmount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {totalAmount >= 0 ? '+' : ''}{formatCurrency(totalAmount)}
              </div>
              <div className="text-muted-foreground">Net Flow</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};