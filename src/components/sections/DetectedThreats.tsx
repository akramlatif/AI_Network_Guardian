'use client';

import { useEffect, useState } from 'react';
import { AlertTriangle, Shield, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function DetectedThreats() {
  const [threats, setThreats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThreats = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/threats/recent');
        const data = await res.json();

        // Map Python backend format to frontend format if necessary
        // Python format: { src_ip, dst_ip, protocol, threat_type, confidence, severity, action_taken }
        // Frontend format expects: { id, type, source, target, severity, timestamp, action }

        const mappedData = data.map((item: any, index: number) => ({
          id: `TH-PY-${index}-${Date.now()}`,
          type: item.threat_type,
          source: item.src_ip,
          target: item.dst_ip,
          severity: item.severity,
          timestamp: new Date().toISOString(), // Fallback to now since simulation doesn't pass time string
          action: item.action_taken
        }));

        setThreats(mappedData);
      } catch (error) {
        console.error("Failed to fetch threats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchThreats();
    const interval = setInterval(fetchThreats, 5000); // Fetch every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const getSeverityConfig = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return { icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-500/10', badge: 'bg-red-500/10 text-red-400 border border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]' };
      case 'high':
        return { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]' };
      case 'medium':
        return { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/10', badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' };
      case 'low':
      default:
        return { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30' };
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      <div className="p-6 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white mb-1">
            Global Threat Radar
          </h2>
          <p className="text-slate-400 text-sm">
            Live security incident stream
          </p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-teal-500/10 text-teal-400 text-xs font-semibold border border-teal-500/20 shadow-[inset_0_0_10px_rgba(20,184,166,0.1)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-500"></span>
          </span>
          Scanning Networks
        </div>
      </div>

      <div className="flex-1 p-0 overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-500"></div>
          </div>
        ) : (
          <table className="w-full text-left border-collapse whitespace-nowrap">
            <thead>
              <tr className="bg-slate-800/40 text-slate-300 text-xs uppercase tracking-wider">
                <th className="p-4 font-semibold">Incident Type</th>
                <th className="p-4 font-semibold">Origin IP</th>
                <th className="p-4 font-semibold">Target Node</th>
                <th className="p-4 font-semibold">Risk Level</th>
                <th className="p-4 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {threats.map((threat, idx) => {
                const config = getSeverityConfig(threat.severity);
                const Icon = config.icon;
                return (
                  <motion.tr
                    key={threat.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-800/60 transition-colors group cursor-default"
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${config.bg} group-hover:scale-110 transition-transform`}>
                          <Icon className={`w-4 h-4 ${config.color}`} />
                        </div>
                        <span className="font-medium text-slate-200">{threat.type}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 rounded bg-slate-950 text-slate-400 font-mono text-xs border border-slate-800">
                        {threat.sourceIp}
                      </span>
                    </td>
                    <td className="p-4 text-slate-400 font-mono text-xs">{threat.targetIp}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-md text-[10px] uppercase font-bold tracking-wider ${config.badge}`}>
                        {threat.severity}
                      </span>
                    </td>
                    <td className="p-4 text-right text-slate-500 font-mono text-xs">
                      {new Date(threat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
