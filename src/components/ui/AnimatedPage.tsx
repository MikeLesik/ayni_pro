import { type ReactNode } from 'react';
import { motion, useReducedMotion, type Variants } from 'framer-motion';

const staggerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' },
  },
};

interface AnimatedPageProps {
  children: ReactNode;
  className?: string;
  /** Enable staggerChildren animation for direct children wrapped in StaggerItem */
  stagger?: boolean;
}

/**
 * Page content wrapper. When `stagger` is true, orchestrates
 * staggered entry of child `<StaggerItem>` components.
 */
export function AnimatedPage({ children, className, stagger }: AnimatedPageProps) {
  const reducedMotion = useReducedMotion();

  if (stagger && !reducedMotion) {
    return (
      <motion.div
        className={className}
        variants={staggerVariants}
        initial="hidden"
        animate="visible"
      >
        {children}
      </motion.div>
    );
  }

  return <div className={className}>{children}</div>;
}

/** Wrap individual sections inside `<AnimatedPage stagger>` */
export function StaggerItem({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
}
