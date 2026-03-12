'use client';

import { useEffect, useState } from 'react';
import { Terminal, AlertCircle, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

let _logCounter = 0;
const nextLogId = (prefix: string) => `${prefix}-${Date.now()}-${++_logCounter}`;

export default function LogsAndAlerts() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let fallbackInterval: ReturnType<typeof setInterval> | null = null;

    const startFallback = () => {
      if (fallbackInterval) return; // Already running
      const mockMessages = [
        { level: 'INFO', message: 'System heartbeat — backend connection unavailable, running in local mode.' },
        { level: 'INFO', message: 'Connection from 192.168.1.45 — flow tracked.' },
        { level: 'WARNING', message: 'High latency on eth0 — 143ms spike.' },
        { level: 'INFO', message: 'User admin authenticated successfully.' },
        { level: 'CRITICAL', message: 'DDoS signature detected from 45.33.22.10.' },
        { level: 'WARNING', message: 'Disk usage at 85% — consider cleanup.' },
      ];
      let idx = 0;
      fallbackInterval = setInterval(() => {
        const mock = mockMessages[idx % mockMessages.length];
        idx++;
        setLogs(prev => [{
          id: nextLogId('log-fb'),
          timestamp: new Date().toISOString(),
          level: mock.level,
          message: mock.message,
          source: 'LocalSim'
        }, ...prev].slice(0, 50));
        setLoading(false);
      }, 2500);
    };

    // Try to connect to FastAPI WebSocket
    let ws: WebSocket | null = null;
    try {
      ws = new WebSocket('ws://localhost:8000/api/logs/stream');

      ws.onmessage = (event) => {
        try {
          const newLog = JSON.parse(event.data);
          const mappedLog = {
            id: nextLogId('log-ws'),
            timestamp: new Date(newLog.timestamp * 1000).toISOString(),
            level: newLog.level,
            message: newLog.message,
            source: 'GuardianOS_Core'
          };
          setLogs(prevLogs => [mappedLog, ...prevLogs].slice(0, 50));
          setLoading(false);
        } catch (e) { /* ignore parse errors */ }
      };

      // Silently fall back to mock mode if WS errors — no console.error
      ws.onerror = () => startFallback();
      ws.onclose = (e) => { if (e.code !== 1000) startFallback(); };
    } catch {
      startFallback();
    }

    return () => {
      if (ws && ws.readyState === WebSocket.OPEN) ws.close(1000, 'component unmounted');
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, []);

  const getLogStyle = (level: string) => {
    switch (level.toLowerCase()) {
      case 'critical': return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' };
      case 'warning': return { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
      case 'info':
      default: return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' };
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[400px]">
      <div className="bg-slate-950/80 px-4 py-3 flex items-center gap-3 border-b border-slate-800">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-teal-500"></div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <Terminal className="w-4 h-4 text-slate-400" />
          <span className="text-xs text-slate-400 font-mono tracking-widest uppercase">Guardian_OS_Terminal</span>
        </div>
      </div>

      <div className="flex-1 p-4 overflow-y-auto space-y-2 font-mono custom-scrollbar bg-[#020617]/50">
        {loading ? (
          <div className="flex items-center gap-3 text-slate-500 text-sm animate-pulse">
            <span className="w-2 h-4 bg-teal-500 inline-block animate-pulse"></span>
            Initializing secure connection...
          </div>
        ) : (
          <>
            <AnimatePresence>
              {logs.map((log, idx) => {
                const style = getLogStyle(log.level);
                const Icon = style.icon;
                return (
                  <motion.div
                    key={log.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`text-xs flex gap-3 items-start p-2.5 rounded-md border border-transparent hover:border-slate-800 hover:bg-slate-800/50 transition-colors ${log.level.toLowerCase() === 'critical' ? 'bg-red-500/5 border-red-500/10' : ''}`}
                  >
                    <span className="text-slate-500 shrink-0">
                      [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false })}]
                    </span>
                    <div className="flex gap-2 w-full break-words">
                      <Icon className={`w-4 h-4 shrink-0 ${style.color}`} />
                      <span className={`${style.color}`}>
                        {log.message}
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div className="text-slate-500 text-xs flex items-center gap-2 mt-4 ml-2">
              <span className="w-2 h-4 bg-teal-500 inline-block animate-pulse shadow-[0_0_8px_rgba(20,184,166,0.8)]"></span>
              Awaiting new telemetry data...
            </div>
          </>
        )}
      </div>
    </div>
  );
}
