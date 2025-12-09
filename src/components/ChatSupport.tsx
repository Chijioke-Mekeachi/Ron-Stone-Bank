import { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, User, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

interface ConvoMessage {
  id: string;
  user_id: string;
  sender: 'user' | 'bot' | 'admin';
  message: string;
  created_at: string;
  conversation_id: string;
}

export const ChatSupport = () => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<ConvoMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [botHasReplied, setBotHasReplied] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const subscriptionRef = useRef<any>(null);

  // Initialize Supabase
  useEffect(() => {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
    
    if (supabaseUrl && supabaseAnonKey) {
      const client = createClient(supabaseUrl, supabaseAnonKey, {
        realtime: {
          params: {
            eventsPerSecond: 10
          }
        }
      });
      setSupabase(client);
    }
  }, []);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase?.removeChannel(subscriptionRef.current);
      }
    };
  }, [supabase]);

  // Load or create conversation when user opens chat
  useEffect(() => {
    if (isOpen && user && supabase) {
      initializeChat();
    } else {
      setMessages([]);
      setConversationId(null);
      setError(null);
      setBotHasReplied(false);
      
      // Clean up subscription
      if (subscriptionRef.current) {
        supabase?.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
  }, [isOpen, user, supabase]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const initializeChat = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user?.id) {
        setError('Please log in to use chat support');
        return;
      }

      // Check if user already has a conversation
      const { data: existingMessages, error: messagesError } = await supabase
        .from('convo')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true });

      if (messagesError) throw messagesError;

      if (existingMessages && existingMessages.length > 0) {
        // Use existing conversation
        const convId = existingMessages[0].conversation_id;
        setConversationId(convId);
        setMessages(existingMessages);
        
        // Check if bot has replied in this conversation (not counting welcome message)
        const hasBotReply = existingMessages.some(msg => 
          msg.sender === 'bot' && !msg.message.includes("Hello! I'm Ron Stone Bot")
        );
        setBotHasReplied(hasBotReply);
        
        // Subscribe to new messages
        await subscribeToConversation(convId);
      } else {
        // Create new conversation with welcome message
        await createNewConversation();
      }

    } catch (error: any) {
      console.error('Error initializing chat:', error);
      setError('Failed to initialize chat. Please try again.');
      toast.error('Chat initialization failed');
    } finally {
      setIsLoading(false);
    }
  };

  const createNewConversation = async () => {
    try {
      const newConversationId = uuidv4();
      setConversationId(newConversationId);

      // Add welcome message
      const welcomeMessage = {
        user_id: '11111111-1111-1111-1111-111111111111', // Bot ID
        sender: 'bot' as const,
        message: 'Hello! I\'m Ron Stone Bot. How can I assist you with your banking needs today?',
        conversation_id: newConversationId
      };

      const { data, error } = await supabase
        .from('convo')
        .insert(welcomeMessage)
        .select()
        .single();

      if (error) throw error;

      setMessages([data]);
      await subscribeToConversation(newConversationId);
    } catch (error: any) {
      console.error('Error creating conversation:', error);
      throw error;
    }
  };

  const subscribeToConversation = async (conversationId: string) => {
    if (!supabase) return;

    // Remove existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    // Create new subscription
    const subscription = supabase
      .channel(`conversation:${conversationId}:${user?.id}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'convo',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          // Add new message to state
          setMessages(prev => {
            const exists = prev.some(msg => msg.id === payload.new.id);
            if (!exists) {
              return [...prev, payload.new];
            }
            return prev;
          });

          // Check if this is a bot reply (not welcome message)
          if (payload.new.sender === 'bot' && 
              !payload.new.message.includes("Hello! I'm Ron Stone Bot")) {
            setBotHasReplied(true);
          }
        }
      )
      .subscribe((status: string) => {
        console.log('Subscription status:', status);
      });

    subscriptionRef.current = subscription;
    return subscription;
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

  const handleSend = async () => {
    if (!message.trim() || isSending || !user?.id || !conversationId) return;

    const userMessage = message.trim();
    setMessage('');
    setIsSending(true);
    setError(null);

    try {
      // Send user message
      const userMsg = {
        user_id: user.id,
        sender: 'user' as const,
        message: userMessage,
        conversation_id: conversationId
      };

      const { error: sendError } = await supabase
        .from('convo')
        .insert(userMsg);

      if (sendError) throw sendError;

      // Only send bot response if bot hasn't replied yet (and not counting welcome message)
      if (!botHasReplied) {
        // Wait a bit before bot responds
        setTimeout(async () => {
          try {
            // Send bot response
            const botResponse = getBotResponse(userMessage);
            const botMsg = {
              user_id: '11111111-1111-1111-1111-111111111111',
              sender: 'bot' as const,
              message: botResponse,
              conversation_id: conversationId
            };

            await supabase
              .from('convo')
              .insert(botMsg);
            
            // Bot has now replied, no more bot messages
            setBotHasReplied(true);
          } catch (error) {
            console.error('Error sending bot response:', error);
          }
        }, 1500);
      }
    } catch (error: any) {
      console.error('Error sending message:', error);
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

  const getSenderIcon = (sender: string) => {
    if (sender === 'user') return <User className="w-4 h-4" />;
    if (sender === 'bot') return <Bot className="w-4 h-4" />;
    return <User className="w-4 h-4" />; // Admin icon
  };

  const getSenderName = (sender: string, userId: string) => {
    if (sender === 'user') return 'You';
    if (sender === 'bot') return 'Ron Stone Bot';
    if (sender === 'admin') return 'Support Agent';
    return 'Unknown';
  };

  const getMessageStyles = (sender: string) => {
    if (sender === 'user') {
      return 'bg-gradient-primary text-white ml-auto';
    } else if (sender === 'bot') {
      return 'bg-card border border-border';
    } else {
      return 'bg-green-100 border border-green-200';
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-primary rounded-full shadow-[var(--shadow-gold)] flex items-center justify-center text-white hover:scale-110 transition-transform duration-200 z-50"
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
                  {botHasReplied ? 'Admin Support' : 'AI Assistant'} • 24/7 • Live
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
                    className={`p-3 rounded-lg max-w-[85%] ${getMessageStyles(msg.sender)} ${
                      msg.sender === 'user' ? 'ml-auto' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {getSenderIcon(msg.sender)}
                      <span className="text-xs font-medium opacity-80">
                        {getSenderName(msg.sender, msg.user_id)}
                      </span>
                    </div>
                    <div className="text-sm">
                      {msg.message}
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
                placeholder={botHasReplied ? "Waiting for admin response..." : "Type your message..."}
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
            <div className="flex justify-between items-center mt-2">
              <p className="text-xs text-green-600">
                ✓ Real-time chat enabled
              </p>
              <p className="text-xs text-gray-500">
                {botHasReplied ? 'Admin support mode' : 'AI bot mode'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};