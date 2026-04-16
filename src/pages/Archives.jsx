import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Archive, Trash2, RotateCcw, Loader2, AlertTriangle,
  Globe, Smartphone, Server, Webhook, Clock
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { ConfirmModal } from '../components/ui/ConfirmModal';
import PageTransition from '../components/layout/PageTransition';
import useSettingsStore from '../store/settingsStore';
import api from '../services/api';
import { toast } from 'sonner';

const typeIcons = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  api: Webhook
};

const Archives = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['audit', 'common']);
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteAuditId, setDeleteAuditId] = useState(null);
  const [restoreAuditId, setRestoreAuditId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  const fetchArchivedAudits = async () => {
    try {
      const response = await api.get('/audits/', { params: { archived: true, limit: 50 } });
      setAudits(response.data);
    } catch (error) {
      console.error('Failed to fetch archived audits:', error);
      toast.error(t('toasts.loadFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchArchivedAudits();
  }, []);

  const handleRestore = async () => {
    if (!restoreAuditId) return;

    setIsRestoring(true);
    try {
      await api.post(`/audits/${restoreAuditId}/unarchive`);
      toast.success(t('toasts.restoreSuccess'));
      setAudits(audits.filter(a => a.id !== restoreAuditId));
    } catch (error) {
      toast.error(t('toasts.restoreFailed'));
    } finally {
      setIsRestoring(false);
      setRestoreAuditId(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteAuditId) return;
    
    setIsDeleting(true);
    try {
      await api.delete(`/audits/${deleteAuditId}`);
      toast.success(t('toasts.deleteSuccess'));
      setAudits(audits.filter(a => a.id !== deleteAuditId));
    } catch (error) {
      toast.error(t('toasts.deleteFailed'));
    } finally {
      setIsDeleting(false);
      setDeleteAuditId(null);
    }
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <PageTransition>
      <div className="space-y-6" data-testid="archives-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight font-heading text-zinc-900 dark:text-white">
              <Archive className="w-8 h-8 inline-block mr-3 text-zinc-500" />
              {t('archives.title', { ns: 'audit' })}
            </h1>
            <p className="mt-1 text-zinc-500 dark:text-zinc-400">
              {t('archives.count', { ns: 'audit', count: audits.length })}
            </p>
          </div>
        </div>

        {/* Warning message */}
        <div className="flex items-center gap-3 p-4 rounded-lg bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30">
          <AlertTriangle className="w-5 h-5 text-orange-500" />
          <p className="text-sm text-orange-700 dark:text-orange-300">
            {t('archives.warning', { ns: 'audit' })}
          </p>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-zinc-200 dark:bg-white/5 rounded-lg" />
            ))}
          </div>
        ) : audits.length > 0 ? (
          <div className="space-y-4">
            <AnimatePresence>
              {audits.map((audit, index) => {
                const Icon = typeIcons[audit.type] || Globe;
                return (
                  <motion.div
                    key={audit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 border transition-all bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/5 hover:border-zinc-300 dark:hover:border-white/10 shadow-sm dark:shadow-none rounded-lg"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center bg-zinc-100 dark:bg-white/5">
                          <Icon className="w-6 h-6 text-zinc-500 dark:text-zinc-400" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-zinc-900 dark:text-white">
                            {t(`types.${audit.type}`)}
                          </h3>
                          <p className="text-sm truncate max-w-[300px] text-zinc-500">
                            {audit.target_display}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        {/* Score */}
                        {audit.score !== null && audit.score !== undefined && (
                          <div className="text-right mr-4">
                            <span className={`text-xl font-bold ${
                              audit.score > 70 ? 'text-lime-500' : 
                              audit.score > 50 ? 'text-yellow-500' : 
                              audit.score > 30 ? 'text-orange-500' : 'text-red-500'
                            }`}>
                              {audit.score}
                            </span>
                            <span className="text-sm text-zinc-500">/100</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setRestoreAuditId(audit.id)}
                            disabled={isRestoring}
                            className="border-zinc-200 dark:border-white/10 hover:bg-zinc-50 dark:hover:bg-white/5 text-zinc-700 dark:text-white"
                            data-testid={`restore-${audit.id}`}
                          >
                            <>
                              <RotateCcw className="w-4 h-4 mr-1" />
                              {t('common:buttons.restore')}
                            </>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setDeleteAuditId(audit.id)}
                            className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                            data-testid={`delete-${audit.id}`}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            {t('common:buttons.delete')}
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {t('labels.created', { ns: 'common' })}: {formatDate(audit.created_at)}
                      </div>
                      <span className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                        {t(`status.${audit.status}`, { ns: 'common' })}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-12 text-center border bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/5 rounded-lg shadow-sm dark:shadow-none"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-zinc-100 dark:bg-white/5">
              <Archive className="w-8 h-8 text-zinc-400 dark:text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium mb-2 text-zinc-900 dark:text-white">
              {t('archives.empty', { ns: 'audit' })}
            </h3>
            <p className="text-zinc-500">
              {t('archives.emptyDesc', { ns: 'audit' })}
            </p>
          </motion.div>
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmModal
          isOpen={!!deleteAuditId}
          onClose={() => setDeleteAuditId(null)}
          onConfirm={handleDelete}
          title={t('modals.deleteTitle', { ns: 'common' })}
          description={t('modals.deleteDesc', { ns: 'common' })}
          confirmText={t('modals.deleteConfirm', { ns: 'common' })}
          isLoading={isDeleting}
          variant="destructive"
        />

        {/* Restore Confirmation Dialog */}
        <ConfirmModal
          isOpen={!!restoreAuditId}
          onClose={() => setRestoreAuditId(null)}
          onConfirm={handleRestore}
          title={t('modals.restoreTitle', { ns: 'common' })}
          description={t('modals.restoreDesc', { ns: 'common' })}
          confirmText={t('modals.restoreConfirm', { ns: 'common' })}
          isLoading={isRestoring}
          variant="default"
        />
      </div>
    </PageTransition>
  );
};

export default Archives;
