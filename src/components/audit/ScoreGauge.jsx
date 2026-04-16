import { motion } from 'framer-motion';
import { useMemo } from 'react';

const ScoreGauge = ({ score, size = 200, strokeWidth = 12 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const center = size / 2;

  const { color, riskLevel } = useMemo(() => {
    if (score <= 30) return { color: '#EF4444', riskLevel: 'critical' };
    if (score <= 50) return { color: '#F97316', riskLevel: 'high' };
    if (score <= 70) return { color: '#EAB308', riskLevel: 'medium' };
    if (score <= 90) return { color: '#84CC16', riskLevel: 'low' };
    return { color: '#22C55E', riskLevel: 'secure' };
  }, [score]);

  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke="currentColor"
          className="text-zinc-200 dark:text-white/5"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <motion.circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          style={{
            filter: `drop-shadow(0 0 10px ${color}50)`
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black tracking-tighter"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.3 }}
        >
          {score}
        </motion.span>
        <span className="text-zinc-500 dark:text-zinc-400 text-sm font-medium uppercase tracking-wider">
          / 100
        </span>
      </div>
    </div>
  );
};

export default ScoreGauge;
