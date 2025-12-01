import { useEffect, useState } from 'react';
import { UserPlus } from 'lucide-react';

export const SignupNotification = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show notification every 3 minutes
    const showNotification = () => {
      setIsVisible(true);
      
      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    };

    // Show first notification after 10 seconds
    const initialTimeout = setTimeout(showNotification, 10000);
    
    // Then show every 3 minutes
    const interval = setInterval(showNotification, 180000); // 3 minutes

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return (
    <div
      className={`fixed bottom-6 left-6 z-50 transition-all duration-500 transform ${
        isVisible
          ? 'translate-x-0 opacity-100'
          : '-translate-x-full opacity-0 pointer-events-none'
      }`}
    >
      <div className="bg-card border border-gold/30 rounded-2xl shadow-[var(--shadow-lg)] px-6 py-4 flex items-center gap-4 backdrop-blur-sm min-w-[280px] animate-scale-in">
        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center flex-shrink-0 shadow-[var(--shadow-gold)]">
          <UserPlus className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">🎉 New Signup!</p>
          <p className="text-xs text-muted-foreground">A new user just joined Ron Stone Bank</p>
        </div>
      </div>
    </div>
  );
};
