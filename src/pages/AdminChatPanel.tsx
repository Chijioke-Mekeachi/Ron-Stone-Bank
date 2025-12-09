import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Bot, User, RefreshCw, BarChart3, Mail, User as UserIcon, Shield, ShieldOff, DollarSign, CreditCard, Search, Shield as AdminIcon, Lock, Eye, EyeOff, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { createClient } from '@supabase/supabase-js';

interface ConvoMessage {
  id: string;
  user_id: string;
  sender: 'user' | 'bot' | 'admin';
  message: string;
  created_at: string;
  conversation_id: string;
}

interface UserConversation {
  user_id: string;
  conversation_id: string;
  username?: string;
  email?: string;
  full_name?: string;
  is_active?: boolean;
  account_number?: string;
  balance?: number;
  last_message: string;
  last_message_time: string;
  message_count: number;
}

interface Stats {
  total_messages: number;
  total_users: number;
  active_users: number;
  messages_today: number;
  bot_messages: number;
  user_messages: number;
  total_accounts: number;
  active_accounts: number;
  inactive_accounts: number;
}

interface LoginForm {
  username: string;
  password: string;
}

export const AdminChatPanel = () => {
  const [conversations, setConversations] = useState<UserConversation[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string | null>(null);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [messages, setMessages] = useState<ConvoMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'conversations' | 'accounts' | 'stats'>('conversations');
  const [balanceUpdate, setBalanceUpdate] = useState({ amount: '', operation: 'set' });
  const [loginForm, setLoginForm] = useState<LoginForm>({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [supabase, setSupabase] = useState<any>(null);
  const [adminId, setAdminId] = useState<string>('');
  const subscriptionRef = useRef<any>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedLogin = localStorage.getItem('admin_logged_in');
    if (storedLogin === 'true') {
      setIsLoggedIn(true);
    }
  }, []);

  // Initialize Supabase and get admin ID
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
      
      // For demo, use a fixed admin ID or get from auth
      // In production, get admin ID from your auth context
      setAdminId('22222222-2222-2222-2222-222222222222'); // Example admin ID
    }
  }, []);

  // Load data when logged in
  useEffect(() => {
    if (isLoggedIn && supabase && adminId) {
      loadConversations();
      loadStats();
    }
  }, [isLoggedIn, supabase, adminId]);

  // Clean up subscription on unmount
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        supabase?.removeChannel(subscriptionRef.current);
      }
    };
  }, [supabase]);

  useEffect(() => {
    if (selectedConversationId && selectedUserId && isLoggedIn) {
      loadMessages(selectedConversationId);
      loadUserDetails(selectedUserId);
      subscribeToConversation(selectedConversationId);
    } else {
      // Clean up subscription if no conversation selected
      if (subscriptionRef.current) {
        supabase?.removeChannel(subscriptionRef.current);
        subscriptionRef.current = null;
      }
    }
  }, [selectedConversationId, selectedUserId, supabase, isLoggedIn]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 500));

      if (loginForm.username === 'admin' && loginForm.password === 'password') {
        setIsLoggedIn(true);
        localStorage.setItem('admin_logged_in', 'true');
        toast.success('Successfully logged in as admin');
      } else {
        setLoginError('Invalid username or password');
        toast.error('Login failed');
      }
    } catch (error) {
      setLoginError('Login failed. Please try again.');
      toast.error('Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('admin_logged_in');
    setSelectedConversationId(null);
    setSelectedUserId(null);
    setSelectedUser(null);
    setMessages([]);
    setConversations([]);
    toast.success('Successfully logged out');
  };

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      
      // Get all messages to group by conversation
      const { data: messages, error: messagesError } = await supabase
        .from('convo')
        .select('*')
        .order('created_at', { ascending: false });

      if (messagesError) throw messagesError;

      // Group by user_id and get the latest conversation for each user
      const conversationsByUser = new Map();
      messages?.forEach((msg: ConvoMessage) => {
        // Skip bot messages for grouping
        if (msg.sender === 'bot') return;
        
        if (!conversationsByUser.has(msg.user_id)) {
          conversationsByUser.set(msg.user_id, {
            user_id: msg.user_id,
            conversation_id: msg.conversation_id,
            last_message: msg.message,
            last_message_time: msg.created_at,
            message_count: 1
          });
        } else {
          const conv = conversationsByUser.get(msg.user_id);
          conv.message_count += 1;
        }
      });

      // Convert to array
      const conversationArray = Array.from(conversationsByUser.values());
      
      // Get user details for each conversation
      const userIds = conversationArray.map(c => c.user_id);
      
      if (userIds.length > 0) {
        const { data: users, error: usersError } = await supabase
          .from('profiles')
          .select('*')
          .in('id', userIds);

        if (!usersError && users) {
          // Merge user details with conversations
          const merged = conversationArray.map(conv => {
            const user = users.find(u => u.id === conv.user_id);
            return {
              ...conv,
              username: user?.username || 'Unknown User',
              email: user?.email || 'No email',
              full_name: user?.full_name,
              is_active: user?.is_active || false,
              account_number: user?.account_number,
              balance: user?.balance || 0
            };
          });

          setConversations(merged);
        } else {
          setConversations(conversationArray);
        }
      } else {
        setConversations([]);
      }

    } catch (error: any) {
      console.error('Error loading conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const { data: user, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (!error && user) {
        setSelectedUser(user);
      } else {
        // If no profile exists, create basic user info
        setSelectedUser({
          id: userId,
          username: 'Unknown User',
          email: 'No email',
          is_active: false
        });
      }
    } catch (error: any) {
      console.error('Error loading user details:', error);
    }
  };

  const loadMessages = async (conversationId: string) => {
    try {
      const { data, error } = await supabase
        .from('convo')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error: any) {
      console.error('Error loading messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const subscribeToConversation = (conversationId: string) => {
    if (!supabase || !conversationId) return;

    // Remove existing subscription
    if (subscriptionRef.current) {
      supabase.removeChannel(subscriptionRef.current);
    }

    // Create new subscription
    const subscription = supabase
      .channel(`admin_conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'convo',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          // Add new message to state immediately
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
          event: 'UPDATE',
          schema: 'public',
          table: 'convo',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload: any) => {
          setMessages(prev =>
            prev.map(msg =>
              msg.id === payload.new.id ? { ...msg, ...payload.new } : msg
            )
          );
        }
      )
      .subscribe((status: string) => {
        console.log('Admin subscription status:', status);
      });

    subscriptionRef.current = subscription;
    return subscription;
  };

  const loadStats = async () => {
    try {
      // Get total messages
      const { data: messagesData, error: messagesError } = await supabase
        .from('convo')
        .select('id, sender, created_at', { count: 'exact' });

      // Get total users (from profiles table)
      const { data: usersData, error: usersError } = await supabase
        .from('profiles')
        .select('id, is_active', { count: 'exact' });

      // Get today's messages
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const { data: todayMessages, error: todayError } = await supabase
        .from('convo')
        .select('id')
        .gte('created_at', today.toISOString());

      // Get bot messages
      const { data: botMessages, error: botError } = await supabase
        .from('convo')
        .select('id')
        .eq('sender', 'bot');

      if (!messagesError && !usersError) {
        const activeAccounts = usersData?.filter(u => u.is_active).length || 0;
        const inactiveAccounts = (usersData?.length || 0) - activeAccounts;

        setStats({
          total_messages: messagesData?.length || 0,
          total_users: conversations.length,
          active_users: activeAccounts,
          messages_today: todayMessages?.length || 0,
          bot_messages: botMessages?.length || 0,
          user_messages: (messagesData?.length || 0) - (botMessages?.length || 0),
          total_accounts: usersData?.length || 0,
          active_accounts: activeAccounts,
          inactive_accounts: inactiveAccounts
        });
      }
    } catch (error: any) {
      console.error('Error loading stats:', error);
    }
  };

  const activateAccount = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ 
          is_active: true,
          account_number: `ACC${Date.now().toString().slice(-8)}`,
          balance: 1000
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Account activated successfully');
      loadConversations();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, is_active: true });
      }
    } catch (error: any) {
      console.error('Error activating account:', error);
      toast.error('Failed to activate account');
    }
  };

  const deactivateAccount = async (userId: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ is_active: false })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Account deactivated successfully');
      loadConversations();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, is_active: false });
      }
    } catch (error: any) {
      console.error('Error deactivating account:', error);
      toast.error('Failed to deactivate account');
    }
  };

  const updateBalance = async (userId: string) => {
    if (!balanceUpdate.amount || isNaN(Number(balanceUpdate.amount))) {
      toast.error('Please enter a valid amount');
      return;
    }

    try {
      const { data: userData, error: fetchError } = await supabase
        .from('profiles')
        .select('balance')
        .eq('id', userId)
        .single();

      if (fetchError) throw fetchError;

      let newBalance = Number(balanceUpdate.amount);
      
      if (balanceUpdate.operation === 'add') {
        newBalance = (userData.balance || 0) + Number(balanceUpdate.amount);
      } else if (balanceUpdate.operation === 'subtract') {
        newBalance = (userData.balance || 0) - Number(balanceUpdate.amount);
      }

      const { error } = await supabase
        .from('profiles')
        .update({ balance: newBalance })
        .eq('id', userId);

      if (error) throw error;

      toast.success('Balance updated successfully');
      setBalanceUpdate({ amount: '', operation: 'set' });
      
      loadConversations();
      if (selectedUser?.id === userId) {
        setSelectedUser({ ...selectedUser, balance: newBalance });
      }
    } catch (error: any) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
    }
  };

  const sendMessageAsAdmin = async () => {
    if (!newMessage.trim() || !selectedConversationId || isSending || !adminId) return;

    const message = newMessage.trim();
    setIsSending(true);

    try {
      const { error } = await supabase
        .from('convo')
        .insert({
          user_id: adminId,
          sender: 'admin',
          message: message,
          conversation_id: selectedConversationId
        });

      if (error) throw error;

      // Clear input after successful send
      setNewMessage('');
      toast.success('Message sent');
    } catch (error: any) {
      console.error('Error sending message:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSenderName = (sender: string, userId: string) => {
    if (sender === 'bot') return 'Ron Stone Bot';
    if (sender === 'admin') return 'You (Admin)';
    return selectedUser?.username || 'User';
  };

  const getMessageStyles = (sender: string) => {
    if (sender === 'bot') {
      return 'bg-blue-100 border border-blue-200';
    } else if (sender === 'admin') {
      return 'bg-green-100 border border-green-200 ml-auto';
    } else {
      return 'bg-gray-100 border border-gray-200';
    }
  };

  const getSenderIcon = (sender: string) => {
    if (sender === 'bot') return <Bot className="w-4 h-4" />;
    if (sender === 'admin') return <AdminIcon className="w-4 h-4" />;
    return <User className="w-4 h-4" />;
  };

  const filteredConversations = conversations.filter(conv => 
    conv.user_id !== '11111111-1111-1111-1111-111111111111' && // Exclude bot
    (searchQuery === '' || 
      conv.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.full_name?.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Admin Login</CardTitle>
            <p className="text-sm text-gray-500 text-center">
              Enter your credentials to access the admin panel
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium">
                  Username
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter username"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="pl-10"
                    required
                    autoComplete="username"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                    className="pl-10 pr-10"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {loginError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-600 text-center">{loginError}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={isLoggingIn}
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Logging in...
                  </>
                ) : (
                  'Login'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Panel (logged in)
  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Welcome back, Admin</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'conversations' ? 'default' : 'outline'}
            onClick={() => setActiveTab('conversations')}
            className="flex items-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            Conversations
          </Button>
          <Button
            variant={activeTab === 'accounts' ? 'default' : 'outline'}
            onClick={() => setActiveTab('accounts')}
            className="flex items-center gap-2"
          >
            <UserIcon className="w-4 h-4" />
            Accounts
          </Button>
          <Button
            variant={activeTab === 'stats' ? 'default' : 'outline'}
            onClick={() => setActiveTab('stats')}
            className="flex items-center gap-2"
          >
            <BarChart3 className="w-4 h-4" />
            Statistics
          </Button>
          <Button onClick={loadConversations} variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
          </Button>
          <Button onClick={handleLogout} variant="destructive" className="flex items-center gap-2">
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>

      {activeTab === 'stats' && stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
              <MessageCircle className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_messages}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Accounts</CardTitle>
              <Shield className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.active_accounts}</div>
              <p className="text-xs text-muted-foreground">
                {stats.inactive_accounts} inactive
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Conversations</CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total_users}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Messages Today</CardTitle>
              <RefreshCw className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.messages_today}</div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'accounts' && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Account Management ({conversations.length} users)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredConversations.map((conv) => (
                <Card key={conv.user_id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{conv.username || 'Unknown User'}</h3>
                      <p className="text-sm text-gray-600">{conv.email || 'No email'}</p>
                    </div>
                    <Badge variant={conv.is_active ? "default" : "secondary"}>
                      {conv.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span className="font-mono">{conv.account_number || 'Not set'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="font-mono">${conv.balance || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span>{conv.message_count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span>{formatTime(conv.last_message_time)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {conv.is_active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateAccount(conv.user_id)}
                        className="flex-1"
                      >
                        <ShieldOff className="w-3 h-3 mr-1" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => activateAccount(conv.user_id)}
                        className="flex-1"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedConversationId(conv.conversation_id);
                        setSelectedUserId(conv.user_id);
                        setActiveTab('conversations');
                      }}
                    >
                      Chat
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Conversations ({filteredConversations.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-4">Loading conversations...</div>
            ) : filteredConversations.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No conversations found</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredConversations.map((conv) => (
                  <div
                    key={conv.conversation_id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedConversationId === conv.conversation_id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => {
                      setSelectedConversationId(conv.conversation_id);
                      setSelectedUserId(conv.user_id);
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {conv.username || conv.user_id.slice(0, 8)}
                      </span>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            conv.is_active ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        <Badge variant={conv.is_active ? "default" : "secondary"} className="text-xs">
                          {conv.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {conv.last_message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        {formatTime(conv.last_message_time)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conv.message_count} msgs
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Conversation & Account Management */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {selectedConversationId && selectedUser ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">
                          {selectedUser.username || selectedUser.id.slice(0, 8)}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {selectedUser.email || 'No email'}
                        </div>
                      </div>
                    </div>
                    <Badge variant={selectedUser.is_active ? "default" : "secondary"}>
                      {selectedUser.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedUser.account_number && (
                      <Badge variant="outline">
                        Acc: {selectedUser.account_number}
                      </Badge>
                    )}
                    {selectedUser.balance !== undefined && (
                      <Badge variant="outline">
                        <DollarSign className="w-3 h-3 mr-1" />
                        ${selectedUser.balance}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Conversation ID: {selectedConversationId.slice(0, 8)}...
                  </div>
                </div>
              ) : (
                'Select a conversation to view messages'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedConversationId ? (
              <>
                {/* Account Management Section */}
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3">Account Management</h3>
                  <div className="flex flex-wrap gap-4 items-center">
                    {selectedUser?.is_active ? (
                      <Button
                        variant="outline"
                        onClick={() => deactivateAccount(selectedUser.id)}
                        className="flex items-center gap-2"
                      >
                        <ShieldOff className="w-4 h-4" />
                        Deactivate Account
                      </Button>
                    ) : (
                      <Button
                        onClick={() => activateAccount(selectedUser.id)}
                        className="flex items-center gap-2"
                      >
                        <Shield className="w-4 h-4" />
                        Activate Account
                      </Button>
                    )}
                    
                    <div className="flex gap-2 items-center">
                      <select
                        value={balanceUpdate.operation}
                        onChange={(e) => setBalanceUpdate(prev => ({ ...prev, operation: e.target.value }))}
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="set">Set</option>
                        <option value="add">Add</option>
                        <option value="subtract">Subtract</option>
                      </select>
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={balanceUpdate.amount}
                        onChange={(e) => setBalanceUpdate(prev => ({ ...prev, amount: e.target.value }))}
                        className="w-24"
                      />
                      <Button
                        onClick={() => updateBalance(selectedUser.id)}
                        variant="outline"
                        size="sm"
                      >
                        <DollarSign className="w-4 h-4" />
                        Update Balance
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Conversation Section */}
                <div className="h-96 overflow-y-auto mb-4 border rounded-lg p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      No messages in this conversation
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`p-3 rounded-lg max-w-[80%] ${getMessageStyles(msg.sender)} ${
                            msg.sender === 'admin' ? 'ml-auto' : ''
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {getSenderIcon(msg.sender)}
                            <span className="text-xs font-medium">
                              {getSenderName(msg.sender, msg.user_id)}
                            </span>
                          </div>
                          <div className="text-sm">{msg.message}</div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(msg.created_at)}
                          </p>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </div>

                {/* Message Input */}
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessageAsAdmin()}
                    placeholder="Type your message as admin..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={sendMessageAsAdmin}
                    disabled={!newMessage.trim() || isSending}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send as Admin
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a conversation from the list to view and manage messages</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};