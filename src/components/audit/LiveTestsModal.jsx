import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Shield, CheckCircle2, AlertTriangle, XCircle, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const LiveTestsModal = ({ isOpen, onClose, tests }) => {
  const { t } = useTranslation(['audit', 'common']);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pass': return <CheckCircle2 className="w-5 h-5 text-lime-400" />;
      case 'warn': return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'fail': return <XCircle className="w-5 h-5 text-red-400" />;
      default: return <Loader2 className="w-5 h-5 text-cyan-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pass': return 'border-lime-500/30 text-lime-400 bg-lime-500/5';
      case 'warn': return 'border-yellow-500/30 text-yellow-400 bg-yellow-500/5';
      case 'fail': return 'border-red-500/30 text-red-400 bg-red-500/5';
      default: return 'border-cyan-500/30 text-cyan-400 bg-cyan-500/5';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white dark:bg-[#13161D] border-zinc-200 dark:border-white/10">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-zinc-900 dark:text-white">
                {t('modals.liveTestsTitle') || 'Real-Time Scan Details'}
              </DialogTitle>
              <DialogDescription className="text-zinc-500 dark:text-zinc-400">
                {t('modals.liveTestsDesc') || 'Monitoring exact checks and security tests performed on the target.'}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="mt-6 space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
          {tests.length === 0 ? (
            <div className="text-center py-10">
              <Loader2 className="w-8 h-8 text-cyan-400 animate-spin mx-auto mb-4" />
              <p className="text-zinc-500">{t('modals.waitingTests') || 'Waiting for tests to start...'}</p>
            </div>
          ) : (
            tests.map((test, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border flex gap-4 transition-all ${getStatusColor(test.status)}`}
              >
                <div className="mt-1">
                  {getStatusIcon(test.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-semibold">
                      {(() => {
                        const match = test.name.match(/A(\d+):2025/);
                        if (match) {
                          const id = `A${match[1]}`;
                          return t(`owasp.${id}.name`) || test.name;
                        }
                        return test.name;
                      })()}
                    </h4>
                    <Badge variant="outline" className={`text-[10px] uppercase tracking-wider ${test.status === 'pass' ? 'border-lime-500/30' : ''}`}>
                      {test.status}
                    </Badge>
                  </div>
                  <p className="text-sm opacity-80 leading-relaxed">
                    {test.message}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-white/5 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-zinc-900 dark:bg-white text-white dark:text-black rounded-lg font-medium hover:opacity-90 transition-opacity"
          >
            {t('buttons.close', { ns: 'common' })}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export { LiveTestsModal };
