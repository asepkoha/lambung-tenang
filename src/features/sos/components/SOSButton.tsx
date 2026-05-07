import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LifeBuoy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SOSButtonProps {
  className?: string;
}

export function SOSButton({ className }: SOSButtonProps) {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-collapse after 4 seconds of inactivity
  useEffect(() => {
    if (expanded) {
      collapseTimer.current = setTimeout(() => setExpanded(false), 4000);
    }
    return () => {
      if (collapseTimer.current) clearTimeout(collapseTimer.current);
    };
  }, [expanded]);

  const handleClick = () => {
    if (expanded) {
      navigate('/sos');
    } else {
      setExpanded(true);
    }
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      whileTap={{ scale: 0.94 }}
      onClick={handleClick}
      aria-label={expanded ? 'Masuk ke Ruang Aman' : 'Buka Ruang Aman'}
      title="Ruang Aman"
      className={cn(
        "flex items-center gap-2 h-9 px-2.5 rounded-full bg-white border border-sage-light text-sage-dark shadow-sm hover:shadow-md hover:bg-sage-warm transition-shadow",
        className
      )}
    >
      <LifeBuoy size={18} strokeWidth={2.2} className="shrink-0" />
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.span
            initial={{ width: 0, opacity: 0, marginRight: 0 }}
            animate={{ width: 'auto', opacity: 1, marginRight: 4 }}
            exit={{ width: 0, opacity: 0, marginRight: 0 }}
            transition={{ duration: 0.25 }}
            className="text-xs font-semibold whitespace-nowrap overflow-hidden"
          >
            Ruang Aman
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
