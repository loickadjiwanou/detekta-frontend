import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Skeleton } from '../components/ui/skeleton';
import AuditCard from '../components/audit/AuditCard';
import PageTransition from '../components/layout/PageTransition';
import { PlusCircle, FileSearch } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuditsList = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['audit', 'common']);
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await api.get('/audits/', { params: { limit: 50 } });
        setAudits(response.data);
      } catch (error) {
        console.error('Failed to fetch audits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, []);

  return (
    <PageTransition>
      <div className="space-y-6" data-testid="audits-list-page">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
              {t('list.title')}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              {audits.length} {audits.length === 1 ? 'audit' : 'audits'}
            </p>
          </div>
          <Button
            onClick={() => navigate('/audit/new')}
            className="bg-blue-500 hover:bg-blue-400 text-white"
            data-testid="new-audit-list-btn"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('common:buttons.startAudit')}
          </Button>
        </div>

        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-24 w-full bg-zinc-200 dark:bg-white/5 rounded-lg" />
            ))}
          </div>
        ) : audits.length > 0 ? (
          <div className="space-y-4">
            {audits.map((audit, index) => (
              <AuditCard 
                key={audit.id} 
                audit={audit} 
                index={index} 
                onArchive={(id) => setAudits(audits.filter(a => a.id !== id))}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-12 text-center rounded-lg shadow-sm dark:shadow-none"
          >
            <div className="w-16 h-16 bg-zinc-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileSearch className="w-8 h-8 text-zinc-500" />
            </div>
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">
              {t('list.empty')}
            </h3>
            <p className="text-zinc-500 mb-6">
              {t('list.emptyDesc')}
            </p>
            <Button
              onClick={() => navigate('/audit/new')}
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              {t('common:buttons.startAudit')}
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default AuditsList;
