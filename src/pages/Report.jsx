import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Globe, Smartphone, Server, Webhook,
  Download, Clock, Cpu, ChevronDown, ChevronUp,
  ExternalLink, AlertTriangle, Zap, Target, HelpCircle
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger
} from '../components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Skeleton } from '../components/ui/skeleton';
import ScoreGauge from '../components/audit/ScoreGauge';
import SeverityBadge from '../components/audit/SeverityBadge';
import PageTransition from '../components/layout/PageTransition';
import api from '../services/api';

import useSettingsStore from '../store/settingsStore';

const typeIcons = {
  web: Globe,
  mobile: Smartphone,
  backend: Server,
  api: Webhook
};

const Report = () => {
  const { auditId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation(['report', 'audit', 'common']);
  const { theme } = useSettingsStore();

  const [report, setReport] = useState(null);
  const [audit, setAudit] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFindings, setExpandedFindings] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [reportRes, auditRes] = await Promise.all([
          api.get(`/reports/${auditId}`),
          api.get(`/audits/${auditId}`)
        ]);
        setReport(reportRes.data);
        setAudit(auditRes.data);
      } catch (err) {
        setError('Failed to load report');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [auditId]);

  const toggleFinding = (id) => {
    setExpandedFindings(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const handleDownload = async (format) => {
    try {
      const response = await api.get(`/reports/${auditId}/download/${format}?theme=${theme}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `detekta-report-${auditId}.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('Download failed:', err);
    }
  };

  const handleDownloadMobSF = async () => {
    try {
      const response = await api.get(`/reports/${auditId}/download/mobsf`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `mobsf-report-${auditId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      console.error('MobSF download failed:', err);
    }
  };
  if (isLoading) {
    return (
      <PageTransition>
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-48 w-full bg-zinc-200 dark:bg-white/5 rounded-lg" />
          <Skeleton className="h-96 w-full bg-zinc-200 dark:bg-white/5 rounded-lg" />
        </div>
      </PageTransition>
    );
  }

  if (error || !report) {
    return (
      <PageTransition>
        <div className="text-center py-20">
          <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-zinc-900 dark:text-white mb-2">{t('errors.notFound', { ns: 'common' })}</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-6">{error || t('errors.somethingWrong', { ns: 'common' })}</p>
          <Button onClick={() => navigate('/dashboard')}>
            {t('nav.dashboard', { ns: 'common' })}
          </Button>
        </div>
      </PageTransition>
    );
  }

  const Icon = typeIcons[audit?.type] || Globe;
  const targetDisplay = audit?.target?.url || audit?.target?.git_repo || audit?.target?.api_endpoint || audit?.target?.file_path || 'Unknown';

  return (
  <PageTransition>
    <div className="max-w-5xl mx-auto space-y-6" data-testid="report-page">
      {/* Header */}
      <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-8 rounded-lg shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-zinc-900 dark:text-white font-heading">
                {audit?.name || t('title')}
              </h1>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-1 truncate max-w-md">
                {audit?.name ? `${t('title')} • ${targetDisplay}` : targetDisplay}
              </p>
            </div>
          </div>

          {/* Score */}
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative cursor-help">
                <motion.div
                  className="rounded-full flex items-center justify-center shrink-0"
                  style={{ width: 140, height: 140 }}
                  whileHover={{ scale: 1.1, backgroundColor: "rgba(56, 189, 248, 0.05)" }}
                  whileTap={{ scale: 0.9 }}
                  animate={{
                    boxShadow: [
                      "0 0 0px rgba(56, 189, 248, 0)",
                      "0 0 30px rgba(56, 189, 248, 0.5)",
                      "0 0 0px rgba(56, 189, 248, 0)"
                    ],
                    scale: [1, 1.05, 1]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  <ScoreGauge score={report.summary.overall_score} size={140} strokeWidth={10} />
                </motion.div>

                {/* Small info button */}
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/10 rounded-full flex items-center justify-center shadow-lg text-blue-500">
                  <HelpCircle className="w-5 h-5" />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent className="max-w-2xl bg-white dark:bg-[#0B0D11] border-zinc-200 dark:border-white/10">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <Zap className="w-6 h-6 text-yellow-500" />
                  {t('scoring.modalTitle')}
                </DialogTitle>
                <DialogDescription className="text-zinc-500 dark:text-zinc-400 text-base py-4">
                  {t('scoring.intro')}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6">
                <div className="rounded-md border border-zinc-200 dark:border-white/5 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-zinc-50 dark:bg-white/5">
                      <TableRow>
                        <TableHead className="w-[150px]">{t('scoring.table.severity')}</TableHead>
                        <TableHead className="text-center">{t('scoring.table.penalty')}</TableHead>
                        <TableHead className="text-right">{t('scoring.table.cap')}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[
                        { key: 'critical', penalty: -25, cap: -100, color: 'text-red-400' },
                        { key: 'high', penalty: -15, cap: -80, color: 'text-orange-400' },
                        { key: 'medium', penalty: -8, cap: -40, color: 'text-yellow-400' },
                        { key: 'low', penalty: -3, cap: -20, color: 'text-lime-400' },
                        { key: 'info', penalty: -1, cap: -5, color: 'text-blue-400' },
                      ].map((row) => (
                        <TableRow key={row.key} className="border-zinc-200 dark:border-white/5">
                          <TableCell className={`font-semibold ${row.color}`}>{t(`severity.${row.key}`)}</TableCell>
                          <TableCell className="text-center font-mono">{row.penalty}</TableCell>
                          <TableCell className="text-right font-mono">{row.cap}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="p-4 bg-zinc-50 dark:bg-white/5 rounded-lg space-y-2">
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">
                    {t('scoring.formula')}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                    {t('scoring.note')}
                  </p>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Metadata */}
        <div className="flex flex-wrap gap-6 mt-8 pt-6 border-t border-zinc-200 dark:border-white/5 text-sm">
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Target className="w-4 h-4" />
            <span>{t(`types.${audit?.type}`, { ns: 'audit' })}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Clock className="w-4 h-4" />
            <span>{t('metadata.duration')}: {report.metadata.scan_duration_seconds}s</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 dark:text-zinc-400">
            <Cpu className="w-4 h-4" />
            <span>
              {t('metadata.apiMode')}: {
                report.ai_analysis
                  ? (report.ai_analysis.api_key_mode === 'own' ? t('apiKeySetup.usingOwn', { ns: 'audit' }) : t('apiKeySetup.usingPlatform', { ns: 'audit' }))
                  : t('apiKeySetup.noAiUsed', { ns: 'audit' })
              }
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mt-6">
          <Button
            variant="outline"
            onClick={() => handleDownload('pdf')}
            className="border-cyan-500/30 hover:bg-cyan-500/10 text-cyan-400"
            data-testid="download-pdf-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('download.pdf')}
          </Button>

          {audit?.type === 'mobile' && report.metadata?.mobsf_hash && (
            <Button
              variant="outline"
              onClick={handleDownloadMobSF}
              className="border-purple-500/30 hover:bg-purple-500/10 text-purple-400"
              data-testid="download-mobsf-btn"
            >
              <Download className="w-4 h-4 mr-2" />
              {t('download.mobsf')}
            </Button>
          )}

          <Button
            variant="outline"
            onClick={() => handleDownload('html')}
            className="border-zinc-200 dark:border-white/10 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-white"
            data-testid="download-html-btn"
          >
            <Download className="w-4 h-4 mr-2" />
            {t('download.html')}
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[
          { label: t('severity.critical'), value: report.summary.critical_count, color: 'text-red-400 bg-red-500/10' },
          { label: t('severity.high'), value: report.summary.high_count, color: 'text-orange-400 bg-orange-500/10' },
          { label: t('severity.medium'), value: report.summary.medium_count, color: 'text-yellow-400 bg-yellow-500/10' },
          { label: t('severity.low'), value: report.summary.low_count, color: 'text-lime-400 bg-lime-500/10' },
          { label: t('severity.info'), value: report.summary.info_count, color: 'text-blue-400 bg-blue-500/10' },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg ${stat.color.split(' ')[1]}`}
          >
            <p className={`text-3xl font-bold ${stat.color.split(' ')[0]}`}>{stat.value}</p>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="summary" className="space-y-6">
        <TabsList className="bg-zinc-100 dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-1 rounded-lg">
          <TabsTrigger value="summary" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
            {t('sections.summary')}
          </TabsTrigger>
          <TabsTrigger value="findings" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
            {t('sections.findings')} ({report.findings.length})
          </TabsTrigger>
          {report.ai_analysis && (
            <TabsTrigger value="ai" className="data-[state=active]:bg-white dark:data-[state=active]:bg-white/10 data-[state=active]:shadow-sm data-[state=active]:text-zinc-900 dark:data-[state=active]:text-white text-zinc-600 dark:text-zinc-400">
              {t('sections.aiAnalysis')}
            </TabsTrigger>
          )}
        </TabsList>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-6">
          <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{t('sections.summary')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {report.summary.executive_summary}
            </p>
          </div>

          <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
            <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">{t('sections.technical')}</h3>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed whitespace-pre-wrap">
              {report.summary.technical_summary}
            </p>
          </div>
        </TabsContent>

        {/* Findings Tab */}
        <TabsContent value="findings" className="space-y-4">
          {report.findings.length === 0 ? (
            <div className="bg-lime-50 dark:bg-[#13161D] border border-lime-200 dark:border-lime-500/30 p-12 text-center rounded-lg shadow-sm dark:shadow-none">
              <div className="w-16 h-16 bg-lime-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-lime-400" />
              </div>
              <h3 className="text-xl font-semibold text-lime-700 dark:text-white mb-2">{t('noFindings')}</h3>
              <p className="text-lime-600 dark:text-zinc-400">{t('noFindingsDesc')}</p>
            </div>
          ) : (
            report.findings.map((finding, index) => (
              <motion.div
                key={finding.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 overflow-hidden rounded-lg shadow-sm dark:shadow-none mb-4"
              >
                <button
                  onClick={() => toggleFinding(finding.id)}
                  className="w-full p-6 flex items-center justify-between hover:bg-zinc-50 dark:hover:bg-white/5 transition-colors"
                  data-testid={`finding-${finding.id}`}
                >
                  <div className="flex items-center gap-4">
                    <SeverityBadge severity={finding.severity} />
                    <div className="text-left">
                      <h4 className="font-semibold text-zinc-900 dark:text-white">{finding.title}</h4>
                      <p className="text-sm text-zinc-500">{finding.category}</p>
                    </div>
                  </div>
                  {expandedFindings[finding.id] ? (
                    <ChevronUp className="w-5 h-5 text-zinc-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-zinc-400" />
                  )}
                </button>

                <AnimatePresence>
                  {expandedFindings[finding.id] && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-zinc-200 dark:border-white/5"
                    >
                      <div className="p-6 space-y-4">
                        <div>
                          <p className="text-sm text-zinc-500 mb-1">{t('finding.affected')}</p>
                          <p className="text-zinc-900 dark:text-white font-mono text-sm">{finding.affected_component}</p>
                        </div>

                        <div>
                          <p className="text-sm text-zinc-500 mb-1">{t('labels.description', { ns: 'common' }) || 'Description'}</p>
                          <p className="text-zinc-700 dark:text-zinc-400">{finding.description}</p>
                        </div>

                        {finding.cvss_score && (
                          <div>
                            <p className="text-sm text-zinc-500 mb-1">{t('finding.cvss')}</p>
                            <p className="text-zinc-900 dark:text-white">{finding.cvss_score}</p>
                          </div>
                        )}

                        {finding.recommendation && (
                          <div className="bg-cyan-500/10 border border-cyan-500/30 p-4 rounded-lg">
                            <p className="text-sm text-cyan-600 dark:text-cyan-400 font-medium mb-2">{t('finding.recommendation')}</p>
                            <p className="text-zinc-700 dark:text-zinc-300">{finding.recommendation}</p>
                          </div>
                        )}

                        {finding.code_fix && (
                          <div>
                            <p className="text-sm text-zinc-500 mb-1">{t('finding.codeFix')}</p>
                            <pre className="bg-[#050508] p-4 rounded-lg overflow-x-auto text-sm text-lime-400 font-mono">
                              {finding.code_fix}
                            </pre>
                          </div>
                        )}

                        {finding.references && finding.references.length > 0 && (
                          <div>
                            <p className="text-sm text-zinc-500 mb-2">{t('finding.references')}</p>
                            <div className="flex flex-wrap gap-2">
                              {finding.references.map((ref, i) => (
                                <a
                                  key={i}
                                  href={ref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {new URL(ref).hostname}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </TabsContent>

        {/* AI Analysis Tab */}
        {report.ai_analysis && (
          <TabsContent value="ai" className="space-y-6">
            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                {t('actionPlan.priority')}
              </h3>
              <ul className="space-y-3">
                {report.ai_analysis.priority_actions.map((action, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-500/20 text-red-400 rounded-full flex items-center justify-center text-xs font-bold">
                      {i + 1}
                    </span>
                    <span className="text-zinc-700 dark:text-zinc-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                {t('actionPlan.quickWins')}
              </h3>
              <ul className="space-y-3">
                {report.ai_analysis.quick_wins.map((win, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Zap className="w-5 h-5 text-lime-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">{win}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-white dark:bg-[#13161D] border border-zinc-200 dark:border-white/5 p-6 rounded-lg shadow-sm dark:shadow-none">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white mb-4">
                {t('actionPlan.longTerm')}
              </h3>
              <ul className="space-y-3">
                {report.ai_analysis.long_term_recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Target className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
                    <span className="text-zinc-700 dark:text-zinc-300">{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </TabsContent>
        )}
      </Tabs>
      </div>
    </PageTransition>
  );
};

export default Report;
