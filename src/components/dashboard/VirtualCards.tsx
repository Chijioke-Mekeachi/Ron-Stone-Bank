import { useState } from 'react';
import { CreditCard, Plus, Lock, Unlock, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

interface VirtualCard {
  id: string;
  cardNumber: string;
  cvv: string;
  expiryDate: string;
  cardholderName: string;
  spendingLimit: number;
  spent: number;
  status: 'active' | 'frozen';
  createdAt: string;
}

export const VirtualCards = () => {
  const [cards, setCards] = useState<VirtualCard[]>(() => {
    const stored = localStorage.getItem('virtualCards');
    return stored ? JSON.parse(stored) : [];
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newCardLimit, setNewCardLimit] = useState('1000');

  const generateCardNumber = () => {
    const parts = [];
    for (let i = 0; i < 4; i++) {
      parts.push(Math.floor(1000 + Math.random() * 9000));
    }
    return parts.join(' ');
  };

  const createCard = () => {
    const newCard: VirtualCard = {
      id: Date.now().toString(),
      cardNumber: generateCardNumber(),
      cvv: Math.floor(100 + Math.random() * 900).toString(),
      expiryDate: `12/${new Date().getFullYear() + 3 - 2000}`,
      cardholderName: 'CARDHOLDER NAME',
      spendingLimit: parseFloat(newCardLimit),
      spent: 0,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    const updatedCards = [...cards, newCard];
    setCards(updatedCards);
    localStorage.setItem('virtualCards', JSON.stringify(updatedCards));
    toast.success('Virtual card created successfully!');
    setIsDialogOpen(false);
    setNewCardLimit('1000');
  };

  const toggleFreeze = (cardId: string) => {
    const updatedCards = cards.map(card =>
      card.id === cardId
        ? { ...card, status: (card.status === 'active' ? 'frozen' : 'active') as 'active' | 'frozen' }
        : card
    );
    setCards(updatedCards);
    localStorage.setItem('virtualCards', JSON.stringify(updatedCards));
    toast.success(`Card ${updatedCards.find(c => c.id === cardId)?.status === 'frozen' ? 'frozen' : 'unfrozen'}`);
  };

  const deleteCard = (cardId: string) => {
    const updatedCards = cards.filter(card => card.id !== cardId);
    setCards(updatedCards);
    localStorage.setItem('virtualCards', JSON.stringify(updatedCards));
    toast.success('Card deleted successfully');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5 text-gold" />
          Virtual Cards
        </CardTitle>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" />
              Get Card
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Virtual Card</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <Label htmlFor="limit">Spending Limit (USD)</Label>
                <Input
                  id="limit"
                  type="number"
                  value={newCardLimit}
                  onChange={(e) => setNewCardLimit(e.target.value)}
                  placeholder="1000"
                />
              </div>
              <Button onClick={createCard} className="w-full">
                Create Card
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {cards.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <CreditCard className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>No virtual cards yet</p>
            <p className="text-sm">Create your first virtual card to get started</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {cards.map((card) => (
              <div
                key={card.id}
                className={`bg-gradient-primary rounded-xl p-6 text-white relative overflow-hidden ${
                  card.status === 'frozen' ? 'opacity-60' : ''
                }`}
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/10 rounded-full blur-2xl"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <p className="text-xs text-white/70 mb-1">Card Number</p>
                      <p className="text-lg font-mono">{card.cardNumber}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70 mb-1">CVV</p>
                      <p className="text-lg font-mono">{card.cvv}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-end mb-4">
                    <div>
                      <p className="text-xs text-white/70 mb-1">Cardholder</p>
                      <p className="text-sm font-semibold">{card.cardholderName}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-white/70 mb-1">Expires</p>
                      <p className="text-sm font-semibold">{card.expiryDate}</p>
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-white/70">Spending Limit</span>
                      <span className="text-sm font-semibold">${card.spendingLimit.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div
                        className="bg-gold h-2 rounded-full transition-all"
                        style={{ width: `${(card.spent / card.spendingLimit) * 100}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-white/70 mt-1">
                      ${card.spent.toLocaleString()} spent
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => toggleFreeze(card.id)}
                      className="flex-1 gap-2"
                    >
                      {card.status === 'active' ? (
                        <>
                          <Lock className="w-4 h-4" />
                          Freeze
                        </>
                      ) : (
                        <>
                          <Unlock className="w-4 h-4" />
                          Unfreeze
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteCard(card.id)}
                      className="gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
