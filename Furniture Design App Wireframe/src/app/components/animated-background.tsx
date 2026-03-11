import { motion } from 'motion/react';
import { useTheme } from './theme-context';

export function AnimatedBackground() {
  const { isDark } = useTheme();

  return (
    <div className="absolute inset-0 z-0">
      {/* Animated gradient layer */}
      <motion.div
        animate={{
          backgroundPosition: ['0% 0%', '100% 100%', '0% 100%', '100% 0%', '0% 0%'],
        }}
        transition={{ duration: 20, ease: 'linear', repeat: Infinity }}
        className="absolute inset-0"
        style={{
          backgroundSize: '400% 400%',
          backgroundImage: isDark
            ? 'linear-gradient(120deg, #4c1d95, #be185d, #0f172a, #312e81)'
            : 'linear-gradient(120deg, #c4b5fd, #f9a8d4, #e2e8f0, #a5b4fc)',
          opacity: isDark ? 0.45 : 0.55,
        }}
      />
      {/* Blur overlay */}
      <div
        className="absolute inset-0 backdrop-blur-[80px]"
        style={{
          backgroundColor: isDark ? 'rgba(10,10,15,0.65)' : 'rgba(248,250,252,0.72)',
        }}
      />
    </div>
  );
}
