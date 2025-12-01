import { useState, useEffect, useRef } from 'react';
import { Send, Users, MessageCircle, Bot, User, RefreshCw, BarChart3, Mail, User as UserIcon, Shield, ShieldOff, DollarSign, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Message {
  id: string;
  user_id: string;
  message: string;
  created_at: string;
}

interface UserConversation {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  account_number: string;
  balance: number;
  last_message: string;
  last_message_time: string;
  message_count: number;
  is_online: boolean;
  created_at: string;
}

interface UserDetails {
  user_id: string;
  username: string;
  email: string;
  full_name: string;
  is_active: boolean;
  account_number: string;
  balance: number;
  created_at?: string;
  avatar_url?: string;
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

export const AdminChatPanel = () => {
  const [users, setUsers] = useState<UserConversation[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [selectedUserDetails, setSelectedUserDetails] = useState<UserDetails | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [stats, setStats] = useState<Stats | null>(null);
  const [activeTab, setActiveTab] = useState<'conversations' | 'stats' | 'accounts'>('conversations');
  const [balanceUpdate, setBalanceUpdate] = useState({ amount: '', operation: 'set' });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const API_BASE_URL = 'https://renostarbank.onrender.com';
  const ADMIN_TOKEN = 'your-secret-admin-token-here';

  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  useEffect(() => {
    if (selectedUser) {
      loadConversation(selectedUser);
      loadUserDetails(selectedUser);
      // Start polling for new messages
      const interval = setInterval(() => {
        loadConversation(selectedUser);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [selectedUser]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: {
          'admin-token': ADMIN_TOKEN
        }
      });

      if (!response.ok) throw new Error('Failed to load users');

      const data = await response.json();
      setUsers(data.data || []);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
        headers: {
          'admin-token': ADMIN_TOKEN
        }
      });

      if (!response.ok) throw new Error('Failed to load user details');

      const data = await response.json();
      setSelectedUserDetails(data.data);
    } catch (error) {
      console.error('Error loading user details:', error);
    }
  };

  const loadStats = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/stats`, {
        headers: {
          'admin-token': ADMIN_TOKEN
        }
      });

      if (!response.ok) throw new Error('Failed to load stats');

      const data = await response.json();
      setStats(data.data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadConversation = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/conversations/${userId}`, {
        headers: {
          'admin-token': ADMIN_TOKEN
        }
      });

      if (!response.ok) throw new Error('Failed to load conversation');

      const data = await response.json();
      setMessages(data.data || []);
      
      // Update user details if available from conversation endpoint
      if (data.user_details && !selectedUserDetails) {
        setSelectedUserDetails({
          user_id: userId,
          ...data.user_details
        });
      }
    } catch (error) {
      console.error('Error loading conversation:', error);
    }
  };

  const activateAccount = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/activate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': ADMIN_TOKEN
        },
        body: JSON.stringify({ initial_balance: 1000 })
      });

      if (!response.ok) throw new Error('Failed to activate account');

      const data = await response.json();
      toast.success('Account activated successfully');
      
      // Reload user details and users list
      loadUserDetails(userId);
      loadUsers();
    } catch (error) {
      console.error('Error activating account:', error);
      toast.error('Failed to activate account');
    }
  };

  const deactivateAccount = async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/deactivate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': ADMIN_TOKEN
        }
      });

      if (!response.ok) throw new Error('Failed to deactivate account');

      const data = await response.json();
      toast.success('Account deactivated successfully');
      
      // Reload user details and users list
      loadUserDetails(userId);
      loadUsers();
    } catch (error) {
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
      const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/balance`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': ADMIN_TOKEN
        },
        body: JSON.stringify({
          balance: Number(balanceUpdate.amount),
          operation: balanceUpdate.operation
        })
      });

      if (!response.ok) throw new Error('Failed to update balance');

      const data = await response.json();
      toast.success('Balance updated successfully');
      setBalanceUpdate({ amount: '', operation: 'set' });
      
      // Reload user details
      loadUserDetails(userId);
      loadUsers();
    } catch (error) {
      console.error('Error updating balance:', error);
      toast.error('Failed to update balance');
    }
  };

  const sendMessageAsBot = async () => {
    if (!newMessage.trim() || !selectedUser || isSending) return;

    const message = newMessage.trim();
    setNewMessage('');
    setIsSending(true);

    try {
      const response = await fetch(`${API_BASE_URL}/admin/conversations/${selectedUser}/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-token': ADMIN_TOKEN
        },
        body: JSON.stringify({ message })
      });

      if (!response.ok) throw new Error('Failed to send message');

      // Reload conversation to show the new message
      await loadConversation(selectedUser);
      toast.success('Message sent as bot');
    } catch (error) {
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

  const getSenderName = (userId: string) => {
    return userId === '11111111-1111-1111-1111-111111111111' ? 'Ron Stone Bot' : 
           selectedUserDetails?.username || 'User';
  };

  const getMessageStyles = (userId: string) => {
    return userId === '11111111-1111-1111-1111-111111111111' 
      ? 'bg-blue-100 border border-blue-200'
      : 'bg-gray-100 border border-gray-200 ml-auto';
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
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
          <Button onClick={loadUsers} variant="outline" size="icon">
            <RefreshCw className="w-4 h-4" />
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
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
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
              Account Management
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {users.map((user) => (
                <Card key={user.user_id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold">{user.username}</h3>
                      <p className="text-sm text-gray-600">{user.email}</p>
                    </div>
                    <Badge variant={user.is_active ? "default" : "secondary"}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Account:</span>
                      <span className="font-mono">{user.account_number}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span className="font-mono">${user.balance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Messages:</span>
                      <span>{user.message_count}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    {user.is_active ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deactivateAccount(user.user_id)}
                        className="flex-1"
                      >
                        <ShieldOff className="w-3 h-3 mr-1" />
                        Deactivate
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        onClick={() => activateAccount(user.user_id)}
                        className="flex-1"
                      >
                        <Shield className="w-3 h-3 mr-1" />
                        Activate
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user.user_id)}
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
        {/* Users List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-4">Loading users...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-4 text-gray-500">No users found</div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((user) => (
                  <div
                    key={user.user_id}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      selectedUser === user.user_id
                        ? 'bg-blue-50 border-blue-200'
                        : 'bg-white border-gray-200 hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedUser(user.user_id)}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm">
                        {user.username}
                      </span>
                      <div className="flex items-center gap-1">
                        <div
                          className={`w-2 h-2 rounded-full ${
                            user.is_online ? 'bg-green-500' : 'bg-gray-300'
                          }`}
                        />
                        <Badge variant={user.is_active ? "default" : "secondary"} className="text-xs">
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-xs text-gray-600 truncate">
                      {user.last_message}
                    </p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-xs text-gray-400">
                        {formatTime(user.last_message_time)}
                      </p>
                      <span className="text-xs text-gray-500">
                        {user.message_count} msgs
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
              {selectedUser && selectedUserDetails ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      <div>
                        <div className="font-semibold">
                          {selectedUserDetails.username}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-3 h-3" />
                          {selectedUserDetails.email}
                        </div>
                      </div>
                    </div>
                    <Badge variant={selectedUserDetails.is_active ? "default" : "secondary"}>
                      {selectedUserDetails.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedUserDetails.account_number && (
                      <Badge variant="outline">
                        Acc: {selectedUserDetails.account_number}
                      </Badge>
                    )}
                    {selectedUserDetails.balance !== undefined && (
                      <Badge variant="outline">
                        <DollarSign className="w-3 h-3 mr-1" />
                        {selectedUserDetails.balance}
                      </Badge>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    User since: {selectedUserDetails.created_at ? formatDate(selectedUserDetails.created_at) : 'Unknown'}
                  </div>
                </div>
              ) : (
                'Select a user to view conversation'
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {selectedUser ? (
              <>
                {/* Account Management Section */}
                <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                  <h3 className="font-semibold mb-3">Account Management</h3>
                  <div className="flex gap-4 items-center">
                    {selectedUserDetails?.is_active ? (
                      <Button
                        variant="outline"
                        onClick={() => deactivateAccount(selectedUser)}
                        className="flex items-center gap-2"
                      >
                        <ShieldOff className="w-4 h-4" />
                        Deactivate Account
                      </Button>
                    ) : (
                      <Button
                        onClick={() => activateAccount(selectedUser)}
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
                        onClick={() => updateBalance(selectedUser)}
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
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`p-3 rounded-lg max-w-[80%] ${getMessageStyles(message.user_id)}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            {message.user_id === '11111111-1111-1111-1111-111111111111' ? (
                              <Bot className="w-4 h-4" />
                            ) : (
                              <User className="w-4 h-4" />
                            )}
                            <span className="text-xs font-medium">
                              {getSenderName(message.user_id)}
                            </span>
                          </div>
                          <div className="text-sm">{message.message}</div>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatTime(message.created_at)}
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
                    onKeyPress={(e) => e.key === 'Enter' && sendMessageAsBot()}
                    placeholder="Type your message as Ron Stone Bot..."
                    className="flex-1"
                    disabled={isSending}
                  />
                  <Button
                    onClick={sendMessageAsBot}
                    disabled={!newMessage.trim() || isSending}
                    className="flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Send as Bot
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Select a user from the list to view and manage their conversation</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};