import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Smartphone, Server, Webhook, Clock, ChevronRight, Archive } from 'lucide-react';
import { ConfirmModal } from '../ui/ConfirmModal';
import { useState } from 'react';
import api from '../../services/api';
import { toast } from 'sonner';

const typeIcons = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  api: Webhook
};

const statusConfig = {
  pending: { color: 'bg-zinc-500', pulse: false },
  running: { color: 'bg-cyan-500', pulse: true },
  completed: { color: 'bg-lime-500', pulse: false },
  failed: { color: 'bg-red-500', pulse: false }
};

const AuditCard = ({ audit, index = 0, onArchive }) => {
  const navigate = useNavigate();
  const { t } = useTranslation(['audit', 'common']);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [isArchiving, setIsArchiving] = useState(false);
  
  const Icon = typeIcons[audit.type] || Globe;
  const status = statusConfig[audit.status] || statusConfig.pending;

  const handleClick = () => {
    if (audit.status === 'completed') {
      navigate(`/report/${audit.id}`);
    } else {
      navigate(`/audit/${audit.id}`);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleArchive = async () => {
    setIsArchiving(true);
    try {
      await api.post(`/audits/${audit.id}/archive`);
      toast.success(t('toasts.archiveSuccess'));
      if (onArchive) onArchive(audit.id);
      setShowArchiveModal(false);
    } catch (error) {
      toast.error(t('toasts.archiveFailed'));
    } finally {
      setIsArchiving(false);
    }
  };

  const onArchiveClick = (e) => {
    e.stopPropagation();
    setShowArchiveModal(true);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.02, 
          borderColor: 'rgba(6,182,212,0.5)',
          boxShadow: '0 0 20px rgba(6,182,212,0.2)'
        }}
        onClick={handleClick}
        className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 cursor-pointer transition-all duration-200 group rounded-lg shadow-sm dark:shadow-none"
        data-testid={`audit-card-${audit.id}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
              <Icon className="w-6 h-6 text-cyan-400" />
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                {audit.name || t(`types.${audit.type}`, { ns: 'audit' })}
              </h3>
              <p className="text-sm text-zinc-500 truncate max-w-[300px]">
                {audit.name ? `${t(`types.${audit.type}`, { ns: 'audit' })} • ${audit.target_display}` : audit.target_display}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Score (if completed) */}
            {audit.score !== null && audit.score !== undefined && (
              <div className="text-right">
                <span className={`text-2xl font-bold ${
                  audit.score > 70 ? 'text-lime-400' : 
                  audit.score > 50 ? 'text-yellow-400' : 
                  audit.score > 30 ? 'text-orange-400' : 'text-red-400'
                }`}>
                  {audit.score}
                </span>
                <span className="text-zinc-500 text-sm">/100</span>
              </div>
            )}

            {/* Status */}
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${status.color} ${status.pulse ? 'animate-pulse' : ''}`} />
              <span className="text-sm text-zinc-500 dark:text-zinc-400">
                {t(`status.${audit.status}`, { ns: 'common' })}
              </span>
            </div>

            <ChevronRight className="w-5 h-5 text-zinc-400 dark:text-zinc-600 group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-xs text-zinc-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {t('labels.created', { ns: 'common' })}: {formatDate(audit.created_at)}
          </div>
          
          {(audit.status === 'completed' || audit.status === 'failed') && (
            <button
              onClick={onArchiveClick}
              className="flex items-center gap-1 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors p-1"
              title={t('modals.archiveConfirm', { ns: 'common' })}
            >
              <Archive className="w-4 h-4" />
            </button>
          )}
        </div>
      </motion.div>

      <ConfirmModal
        isOpen={showArchiveModal}
        onClose={() => setShowArchiveModal(false)}
        onConfirm={handleArchive}
        title={t('modals.archiveTitle', { ns: 'common' })}
        description={t('modals.archiveDesc', { ns: 'common' })}
        confirmText={t('modals.archiveConfirm', { ns: 'common' })}
        isLoading={isArchiving}
        variant="default"
      />
    </>
  );
};

export default AuditCard;
