import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { WifiOff } from 'lucide-react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

export function OfflineIndicator() {
  const [offline, setOffline] = useState(!navigator.onLine);
  const reduced = useReducedMotion();

  useEffect(() => {
    const goOffline = () => setOffline(true);
    const goOnline = () => setOffline(false);
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', goOnline);
    return () => {
      window.removeEventListener('offline', goOffline);
      window.removeEventListener('online', goOnline);
    };
  }, []);

  return (
    <AnimatePresence>
      {offline && (
        <motion.div
          role="alert"
          initial={reduced ? { opacity: 0 } : { y: -40, opacity: 0 }}
          animate={reduced ? { opacity: 1 } : { y: 0, opacity: 1 }}
          exit={reduced ? { opacity: 0 } : { y: -40, opacity: 0 }}
          className="fixed top-0 inset-x-0 z-[200] flex items-center justify-center gap-2
            bg-warning/95 text-warning-foreground py-2 px-4 text-sm font-medium shadow-md"
        >
          <WifiOff size={16} />
          You are offline
        </motion.div>
      )}
    </AnimatePresence>
  );
}
