import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Globe, Smartphone, Server, Webhook, 
  CheckCircle, XCircle, Loader2, ArrowRight
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import TerminalLog from '../components/audit/TerminalLog';
import { LiveTestsModal } from '../components/audit/LiveTestsModal';
import PageTransition from '../components/layout/PageTransition';
import api from '../services/api';

const typeIcons = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  api: Webhook
};

const AuditDetail = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['audit', 'common']);
  const wsRef = useRef(null);

  const [audit, setAudit] = useState(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [reportId, setReportId] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [tests, setTests] = useState([]);
  const [showTestsModal, setShowTestsModal] = useState(false);

  useEffect(() => {
    // Fetch audit details
    const fetchAudit = async () => {
      try {
        const response = await api.get(`/audits/${auditId}`);
        setAudit(response.data);
        setIsLoading(false);

        // If already completed, redirect to report
        if (response.data.status === 'completed') {
          navigate(`/report/${auditId}`);
          return;
        }

        // If failed, show error
        if (response.data.status === 'failed') {
          setError(response.data.error_message || 'Audit failed');
          return;
        }

        // Connect WebSocket for real-time updates
        connectWebSocket();
      } catch (err) {
        setError('Failed to load audit');
        setIsLoading(false);
      }
    };

    fetchAudit();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [auditId, navigate]);

  const connectWebSocket = () => {
    const wsUrl = process.env.REACT_APP_BACKEND_URL?.replace('https://', 'wss://').replace('http://', 'ws://');
    const ws = new WebSocket(`${wsUrl}/api/ws/audit/${auditId}`);
    wsRef.current = ws;

    let pingInterval;

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        // Ignore heartbeat responses
        if (data.type === 'pong') return;
        
        switch (data.type) {
          case 'log':
            setLogs(prev => [...prev, data.message]);
            break;
          case 'progress':
            setProgress(data.percent);
            setCurrentStep(data.current_step);
            break;
          case 'completed':
            setReportId(data.report_id);
            setProgress(100);
            break;
          case 'error':
            setError(data.message);
            break;
          case 'test_result':
            setTests(prev => [...prev, {
              name: data.name,
              status: data.status,
              message: data.message
            }]);
            break;
          default:
            break;
        }
      } catch (e) {
        console.error('Failed to parse websocket message:', e);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket closed');
      clearInterval(pingInterval);
    };

    // Keep alive
    pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send('ping');
      }
    }, 30000);

    return pingInterval;
  };

  if (isLoading) {
    return (
      <PageTransition>
        <div className="flex items-center justify-center h-96">
          <Loader2 className="w-8 h-8 text-cyan-400 animate-spin" />
        </div>
      </PageTransition>
    );
  }

  const Icon = typeIcons[audit?.type] || Globe;
  const targetDisplay = audit?.target?.url || audit?.target?.git_repo || audit?.target?.api_endpoint || audit?.target?.file_path || 'Unknown';
  const isCompleted = reportId !== null || progress === 100;
  const isFailed = error !== null;

  return (
    <PageTransition>
      <div className="max-w-4xl mx-auto" data-testid="audit-detail-page">
        {/* Header */}
        <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 mb-6 rounded-lg shadow-sm dark:shadow-none">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                <Icon className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-zinc-900 dark:text-white">
                  {audit?.name || t(`types.${audit?.type}`)}
                </h1>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 truncate max-w-md">
                  {audit?.name ? `${t(`types.${audit?.type}`)} • ${targetDisplay}` : targetDisplay}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="flex items-center gap-2">
              {isCompleted ? (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="flex items-center gap-2 px-4 py-2 bg-lime-500/10 text-lime-400 rounded-full"
                >
                  <CheckCircle className="w-5 h-5" />
                  <span className="font-medium">{t('status.completed', { ns: 'common' })}</span>
                </motion.div>
              ) : isFailed ? (
                <div className="flex items-center gap-2 px-4 py-2 bg-red-500/10 text-red-400 rounded-full">
                  <XCircle className="w-5 h-5" />
                  <span className="font-medium">{t('status.failed', { ns: 'common' })}</span>
                </div>
              ) : (
                <motion.div
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="flex items-center gap-2 px-4 py-2 bg-cyan-500/10 text-cyan-400 rounded-full"
                >
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span className="font-medium">{t('status.running', { ns: 'common' })}</span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Progress */}
        {!isCompleted && !isFailed && (
          <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 mb-6 rounded-lg shadow-sm dark:shadow-none">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-zinc-500 dark:text-zinc-400">{currentStep || t('progress.scanning')}</span>
              <span className="text-sm font-mono text-cyan-400">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2 bg-zinc-100 dark:bg-white/5" />
          </div>
        )}

        <div className="mb-6 rounded-lg overflow-hidden border border-zinc-200 dark:border-white/5">
          <div className="bg-zinc-50 dark:bg-white/5 p-3 flex items-center justify-between border-b border-zinc-200 dark:border-white/5">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Scan Logs</span>
            <button 
              onClick={() => setShowTestsModal(true)}
              className="text-xs font-medium text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              {t('common:buttons.viewScanDetails')} ({tests.length})
            </button>
          </div>
          <TerminalLog logs={logs} isRunning={!isCompleted && !isFailed} />
        </div>

        <LiveTestsModal 
          isOpen={showTestsModal} 
          onClose={() => setShowTestsModal(false)} 
          tests={tests} 
        />

        {/* Error Message */}
        {isFailed && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/30 p-6 mb-6 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-400" />
              <div>
                <p className="text-red-700 dark:text-red-400 font-medium">Audit Failed</p>
                <p className="text-sm text-red-600 dark:text-red-300/70">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* View Report Button */}
        {isCompleted && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Button
              onClick={() => navigate(`/report/${auditId}`)}
              size="lg"
              className="bg-cyan-500 hover:bg-cyan-400 text-black font-semibold px-8"
              data-testid="view-report-btn"
            >
              {t('common:buttons.viewReport')}
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  );
};

export default AuditDetail;
