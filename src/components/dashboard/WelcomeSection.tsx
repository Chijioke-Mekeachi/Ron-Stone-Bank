import { useAuth } from '@/contexts/AuthContext';

export const WelcomeSection = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <div className="bg-card rounded-2xl p-8 shadow-[var(--shadow-sm)] border border-border">
      <h1 className="text-3xl font-bold text-foreground mb-2">
        {getGreeting()}, {user?.name}! 👋
      </h1>
      <p className="text-muted-foreground">
        Welcome to Ron Stone Bank. Your most trusted digital banking partner.
      </p>
    </div>
  );
};
