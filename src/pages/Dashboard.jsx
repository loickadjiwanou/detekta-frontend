import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Shield, 
  PlusCircle, 
  TrendingUp, 
  FileSearch, 
  Calendar,
  ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import AuditCard from '../components/audit/AuditCard';
import PageTransition from '../components/layout/PageTransition';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation(['common', 'audit']);
  const { user } = useAuthStore();
  const [audits, setAudits] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    avgScore: 0
  });

  useEffect(() => {
    const fetchAudits = async () => {
      try {
        const response = await api.get('/audits/', { params: { limit: 5 } });
        setAudits(response.data);
        
        // Calculate stats
        const completed = response.data.filter(a => a.status === 'completed');
        const scores = completed.filter(a => a.score !== null).map(a => a.score);
        const avgScore = scores.length > 0 
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : 0;
        
        setStats({
          total: response.data.length,
          completed: completed.length,
          avgScore
        });
      } catch (error) {
        console.error('Failed to fetch audits:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAudits();
  }, []);

  const statCards = [
    { 
      label: t('labels.total'), 
      value: user?.total_audits || stats.total, 
      icon: FileSearch,
      color: 'text-blue-400'
    },
    { 
      label: t('status.completed'), 
      value: stats.completed, 
      icon: Shield,
      color: 'text-lime-400'
    },
    { 
      label: t('labels.avgScore'), 
      value: stats.avgScore, 
      icon: TrendingUp,
      color: 'text-cyan-400'
    }
  ];

  return (
    <PageTransition>
      <div className="space-y-8" data-testid="dashboard-page">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-white font-heading">
              {t('labels.welcomeBack')}, {user?.full_name?.split(' ')[0]}
            </h1>
            <p className="text-zinc-500 dark:text-zinc-400 mt-1">
              {t('dashboard.welcomeHelp', { ns: 'audit' })}
            </p>
          </div>
          <Button
            onClick={() => navigate('/audit/new')}
            className="bg-blue-500 hover:bg-blue-400 text-white"
            data-testid="new-audit-btn"
          >
            <PlusCircle className="w-4 h-4 mr-2" />
            {t('common:buttons.startAudit')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 shadow-sm dark:shadow-none rounded-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500 mb-1">{stat.label}</p>
                  <p className={`text-3xl font-bold ${stat.color}`}>
                    {isLoading ? <Skeleton className="h-9 w-16" /> : stat.value}
                  </p>
                </div>
                <div className="w-12 h-12 bg-zinc-100 dark:bg-white/5 rounded-lg flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Recent Audits */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">{t('dashboard.recentAudits', { ns: 'audit' })}</h2>
            {audits.length > 0 && (
              <Button
                variant="ghost"
                onClick={() => navigate('/audits')}
                className="text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
                data-testid="view-all-audits-btn"
              >
                {t('common:buttons.viewAll')}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
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
                {t('list.empty', { ns: 'audit' })}
              </h3>
              <p className="text-zinc-500 mb-6">
                {t('list.emptyDesc', { ns: 'audit' })}
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
      </div>
    </PageTransition>
  );
};

export default Dashboard;
