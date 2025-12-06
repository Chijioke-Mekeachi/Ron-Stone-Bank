import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

export const ChatSupport = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const supabaseRef = useRef<any>(null);

  // --- ADDED: state to track if the bot has already replied to this user
  const [botHasReplied, setBotHasReplied] = useState(false);

  // Your existing server URL
  const API_BASE_URL = 'https://renostarbank.onrender.com';
  
  // Admin UUID for bot messages
  const BOT_USER_ID = '11111111-1111-1111-1111-111111111111';

  // Initialize Supabase client for real-time
  useEffect(() => {
    const url = import.meta.env.VITE_SUPABASE_URL;
    const anon = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (url && anon) {
      supabaseRef.current = createClient(url, anon);
    }
  }, []);


  // Real-time subscription setup
  useEffect(() => {
    if (!isOpen || !user?.id || !supabaseRef.current) return;

    let subscription: any;

    const setupRealtime = async () => {
      try {
        subscription = supabaseRef.current
          .channel('public:messages')
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `user_id=eq.${user.id}`
            },
            (payload: any) => {
              setMessages(prev => {
                const exists = prev.some(msg => msg.id === payload.new.id);
                if (!exists) {
                  return [...prev, payload.new];
                }
                return prev;
              });
            }
          )
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'messages',
              filter: `user_id=eq.${BOT_USER_ID}`
            },
            (payload: any) => {
              setMessages(prev => {
                const exists = prev.some(msg => msg.id === payload.new.id);
                if (!exists) {
                  return [...prev, payload.new];
                }
                return prev;
              });
              // --- ADDED: Set the local tracker when a bot message is inserted
              if (payload.new && payload.new.user_id === BOT_USER_ID) {
                setBotHasReplied(true);
              }
            }
          )
          .subscribe((status: string) => {
            // console.log('📡 Realtime subscription status:', status);
          });

      } catch (error) {
        // console.error('❌ Error setting up real-time subscription:', error);
      }
    };

    setupRealtime();

    return () => {
      if (subscription) {
        supabaseRef.current.removeChannel(subscription);
      }
    };
  }, [isOpen, user?.id]);

  useEffect(() => {
    if (isOpen && user) {
      initializeChat();
    } else {
      // Reset state when closing
      setMessages([]);
      setError(null);
      setBotHasReplied(false); // --- ADDED
    }
  }, [isOpen, user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const testApiConnection = async (): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      if (response.ok) {
        const data = await response.json();
        return data.status === 'OK';
      }
      return false;
    } catch {
      return false;
    }
  };

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Test if API is available
      const apiWorking = await testApiConnection();
      if (!apiWorking) {
        setError('Chat service is currently unavailable. Please try again later.');
        return;
      }

      if (!user?.id) {
        setError('Please log in to use chat support');
        return;
      }

      // Load existing messages for this user, checks if bot has replied
      await fetchUserMessages();
      
    } catch (error) {
      setError('Failed to initialize chat. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // --- MODIFIED: Check if a bot reply exists already (for this user!)
  const fetchUserMessages = async () => {
    try {
      if (!user?.id) return;
      const response = await fetch(`${API_BASE_URL}/messages/${user.id}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      if (data.success && data.data) {
        setMessages(data.data);
        // ADDED: Check if there is ANY bot message that's a reply (not just greeting)
        // You may want stricter logic, e.g. checking if bot's message is after a user message.
        const botReplyExists = data.data.some(msg =>
          msg.user_id === BOT_USER_ID && !msg.message.includes("Hello! I\'m Ron Stone Bot")
        );
        setBotHasReplied(botReplyExists);
      } else {
        setBotHasReplied(false);
        await addWelcomeMessage();
      }
    } catch (error) {
      setError('Failed to load messages');
      setBotHasReplied(false);
      await addWelcomeMessage();
    }
  };

  const addWelcomeMessage = async () => {
    try {
      // Prevent duplicate greeting messages
      const hasWelcome = messages.some(msg => 
        msg.user_id === BOT_USER_ID && 
        msg.message.includes('Hello! I\'m Ron Stone Bot')
      );
      
      if (!hasWelcome) {
        const welcomeMessage = await sendMessageToAPI(BOT_USER_ID, 'Hello! I\'m Ron Stone Bot. How can I assist you with your banking needs today?');
        setMessages(prev => [...prev, welcomeMessage]);
      }
    } catch (error) {
      const localWelcome: Message = {
        id: `welcome-${Date.now()}`,
        user_id: BOT_USER_ID,
        message: 'Hello! I\'m Ron Stone Bot. How can I assist you with your banking needs today?',
        created_at: new Date().toISOString(),
      };
      setMessages(prev => [...prev, localWelcome]);
    }
  };

  const getBotResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    if (message.includes('balance') || message.includes('money')) {
      return "I can help you check your account balance. Please visit the Dashboard to view your current balance and transaction history.";
    } else if (message.includes('transfer') || message.includes('send money')) {
      return "You can transfer money to other accounts using the Transfer feature in your dashboard. Make sure you have the recipient's account number ready.";
    } else if (message.includes('card') || message.includes('debit')) {
      return "For debit card inquiries, including lost or stolen cards, please contact our card services department at 1-800-RON-STONE.";
    } else if (message.includes('loan') || message.includes('credit')) {
      return "We offer various loan options. You can apply for a loan through our online portal or visit your nearest branch for personalized assistance.";
    } else if (message.includes('fee') || message.includes('charge')) {
      return "You can view all account fees and charges in the Fees Schedule section of our website or mobile app.";
    } else if (message.includes('active') || message.includes('activate')) {
      return "Account activation typically takes 24-48 hours after verification. Our team will notify you once your account is active.";
    } else if (message.includes('hello') || message.includes('hi')) {
      return "Hello! I'm Ron Stone Bot, your virtual banking assistant. How can I help you today?";
    } else {
      return "Thank you for your message. I'm here to help with your banking needs. For specific account issues, you can also visit the support section in your dashboard.";
    }
  };

  // Send message to Supabase backend
  const sendMessageToAPI = async (userId: string, messageText: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        message: messageText
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.data;
  };

  // --- MODIFIED: Only send bot response if botHasReplied is false
  const handleSend = async () => {
    if (!message.trim() || isSending || !user?.id) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);
    setError(null);

    try {
      // Send user message to backend
      const savedUserMessage = await sendMessageToAPI(user.id, userMessage);
      setMessages(prev => [...prev, savedUserMessage]);
      
      // --- APPLY BOT-ONCE-ONLY LOGIC
      // Only send bot response once per user (if botHasReplied is false!)
      if (!botHasReplied) {
        // Show thinking...
        const thinkingMessage: Message = {
          id: `thinking-${Date.now()}`,
          user_id: BOT_USER_ID,
          message: 'Thinking...',
          created_at: new Date().toISOString(),
        };
        setMessages(prev => [...prev, thinkingMessage]);

        setTimeout(async () => {
          const botResponseText = getBotResponse(userMessage);
          try {
            const botResponse = await sendMessageToAPI(BOT_USER_ID, botResponseText);
            setMessages(prev => prev.filter(msg => !msg.id.startsWith('thinking-')));
            setBotHasReplied(true); // --- Once bot has replied, record this!
          } catch (error) {
            setMessages(prev => prev.filter(msg => !msg.id.startsWith('thinking-')));
            toast.error('Failed to get bot response');
          }
        }, 1500);

      }
      // If botHasReplied is true, do nothing else (user message just stores, NO bot reply)

    } catch (error) {
      setError('Failed to send message');
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSenderIcon = (messageUserId: string) => {
    return messageUserId === user?.id ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
  };

  const getSenderName = (messageUserId: string) => {
    return messageUserId === user?.id ? 'You' : 'Ron Stone Bot';
  };

  const getMessageStyles = (messageUserId: string) => {
    if (messageUserId === user?.id) {
      return 'bg-gradient-primary text-white ml-auto';
    } else {
      return 'bg-card border border-border';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-primary rounded-full shadow-[var(--shadow-gold)] flex items-center justify-center text-white hover:scale-110 transition-transform durati[...]
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
      </button>
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-3rem)] bg-card rounded-2xl shadow-[var(--shadow-lg)] border border-border z-50 animate-scale-in flex flex-col h-[500px]">
          <div className="bg-gradient-primary text-white p-4 rounded-t-2xl">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">Ron Stone Support</h3>
                <p className="text-sm text-white/80 flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full animate-pulse bg-green-400"></div>
                  AI Assistant • 24/7 • Live
                </p>
              </div>
            </div>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-secondary/30">
            {error ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <AlertCircle className="w-12 h-12 text-red-500 mb-2" />
                <p className="text-red-600 font-medium mb-2">Chat Error</p>
                <p className="text-sm text-muted-foreground">{error}</p>
                <Button 
                  onClick={initializeChat} 
                  variant="outline" 
                  size="sm" 
                  className="mt-4"
                >
                  Try Again
                </Button>
              </div>
            ) : isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Loading chat...</span>
                </div>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex justify-center items-center h-full">
                <div className="text-center text-muted-foreground">
                  <Bot className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Start a conversation with our support team</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-3 rounded-lg max-w-[85%] ${getMessageStyles(msg.user_id)} ${
                      msg.id.includes('thinking') ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getSenderIcon(msg.user_id)}
                      <span className="text-xs font-medium opacity-80">
                        {getSenderName(msg.user_id)}
                      </span>
                    </div>
                    <div className="text-sm">
                      {msg.message}
                      {msg.id.includes('thinking') && (
                        <span className="inline-block ml-1 animate-pulse">...</span>
                      )}
                    </div>
                    <p className="text-xs opacity-70 mt-1">
                      {formatTime(msg.created_at)}
                    </p>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
            )}
          </div>
          <div className="p-4 border-t border-border bg-card rounded-b-2xl">
            <div className="flex gap-2">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Type your message..."
                className="flex-1"
                disabled={isSending || isLoading || !user || !!error}
              />
              <Button 
                onClick={handleSend} 
                size="icon"
                disabled={!message.trim() || isSending || isLoading || !user || !!error}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2 text-center">
                Please log in to use chat support
              </p>
            )}
            <p className="text-xs text-green-600 mt-2 text-center">
              ✓ Real-time updates enabled
            </p>
          </div>
        </div>
      )}
    </>
  );
};
