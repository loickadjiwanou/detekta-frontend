import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const severityConfig = {
  critical: { color: 'bg-red-500', textColor: 'text-red-500', borderColor: 'border-red-500' },
  high: { color: 'bg-orange-500', textColor: 'text-orange-500', borderColor: 'border-orange-500' },
  medium: { color: 'bg-yellow-500', textColor: 'text-yellow-500', borderColor: 'border-yellow-500' },
  low: { color: 'bg-lime-500', textColor: 'text-lime-500', borderColor: 'border-lime-500' },
  info: { color: 'bg-blue-500', textColor: 'text-blue-500', borderColor: 'border-blue-500' }
};

const SeverityBadge = ({ severity, size = 'md' }) => {
  const { t } = useTranslation('report');
  const config = severityConfig[severity] || severityConfig.info;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className={`inline-flex items-center font-bold uppercase tracking-wider rounded ${config.color} text-black ${sizeClasses[size]}`}
    >
      {t(`severity.${severity}`)}
    </motion.span>
  );
};

export default SeverityBadge;
