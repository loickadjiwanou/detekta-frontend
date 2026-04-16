import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TerminalLog = ({ logs = [], isRunning = false }) => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogColor = (log) => {
    if (log.includes('[ERROR]')) return 'text-red-400';
    if (log.includes('[WARN]')) return 'text-yellow-400';
    if (log.includes('[INFO]')) return 'text-lime-400';
    return 'text-lime-400';
  };

  return (
    <div className="relative bg-[#050508] border border-cyan-500/30 p-6 overflow-hidden">
      {/* Scanline effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.1) 2px, rgba(6,182,212,0.1) 4px)'
        }}
      />
      
      {/* Terminal header */}
      <div className="flex items-center gap-2 mb-4 pb-4 border-b border-cyan-500/20">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-4 text-xs text-cyan-400 font-mono uppercase tracking-wider">
          Detekta Scanner Terminal
        </span>
        {isRunning && (
          <motion.span
            className="ml-auto text-xs text-cyan-400 font-mono"
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            SCANNING...
          </motion.span>
        )}
      </div>

      {/* Log content */}
      <div
        ref={containerRef}
        className="h-80 overflow-y-auto font-mono text-sm leading-relaxed tracking-tight space-y-1 scrollbar-thin scrollbar-thumb-cyan-500/20 scrollbar-track-transparent"
      >
        <AnimatePresence mode="popLayout">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className={getLogColor(log)}
            >
              {log}
            </motion.div>
          ))}
        </AnimatePresence>
        {isRunning && (
          <motion.span
            className="inline-block w-2 h-4 bg-lime-400 ml-1"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          />
        )}
      </div>
    </div>
  );
};

export default TerminalLog;
