'use client';

import { useEffect, useState } from 'react';
import { Terminal, Download, Trash2, PauseCircle, PlayCircle, ShieldAlert, AlertCircle, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SystemLogsPage() {
    const [logs, setLogs] = useState<any[]>([]);
    const [isPaused, setIsPaused] = useState(false);

    // Generate initial mock logs
    useEffect(() => {
        const initialLogs = Array.from({ length: 20 }, (_, i) => generateMockLog(new Date(Date.now() - (20 - i) * 2000)));
        setLogs(initialLogs);
    }, []);

    // Simulate incoming logs
    useEffect(() => {
        if (isPaused) return;

        const interval = setInterval(() => {
            setLogs(prev => [...prev.slice(-49), generateMockLog()]);
        }, Math.random() * 2000 + 500); // Random interval between 0.5s and 2.5s

        return () => clearInterval(interval);
    }, [isPaused]);

    const generateMockLog = (date = new Date()) => {
        const levels = ['info', 'info', 'info', 'warning', 'critical'];
        const level = levels[Math.floor(Math.random() * levels.length)];

        const messages = {
            info: ['Connection established from 192.168.1.45', 'User admin authenticated successfully', 'Configuration backup completed', 'System heartbeat OK'],
            warning: ['High latency detected on eth0', 'Failed authentication attempt for user root', 'Disk usage nearing 85% capacity'],
            critical: ['DDoS mitigation activated', 'Malware signature matched in incoming stream', 'Unauthorized firewall rule modification detected!']
        };

        return {
            id: Math.random().toString(36).substr(2, 9),
            level,
            message: messages[level as keyof typeof messages][Math.floor(Math.random() * messages[level as keyof typeof messages].length)],
            timestamp: date.toISOString(),
        };
    };

    const clearLogs = () => setLogs([]);

    const getLogStyle = (level: string) => {
        switch (level) {
            case 'critical': return { icon: ShieldAlert, color: 'text-red-400', bg: 'bg-red-500/10' };
            case 'warning': return { icon: AlertCircle, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
            case 'info':
            default: return { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10' };
        }
    };

    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <Terminal className="w-8 h-8 text-teal-500" />
                        System Control Terminal
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Raw event stream from all monitoring nodes</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={() => setIsPaused(!isPaused)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors ${isPaused
                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                            : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                            }`}
                    >
                        {isPaused ? <PlayCircle className="w-4 h-4" /> : <PauseCircle className="w-4 h-4" />}
                        {isPaused ? 'Resume Stream' : 'Pause Stream'}
                    </button>

                    <button onClick={clearLogs} className="flex items-center gap-2 px-3 py-1.5 bg-slate-800 hover:bg-red-500/20 text-slate-300 hover:text-red-400 text-sm font-medium rounded-lg border border-slate-700 hover:border-red-500/40 transition-colors">
                        <Trash2 className="w-4 h-4" />
                        Clear
                    </button>

                    <button
                        onClick={() => {
                            const content = logs.map(l =>
                                `[${new Date(l.timestamp).toISOString()}] [${l.level.toUpperCase()}] ${l.message}`
                            ).join('\n');
                            const blob = new Blob([content], { type: 'text/plain' });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `guardian-logs-${Date.now()}.log`;
                            a.click();
                            URL.revokeObjectURL(url);
                        }}
                        className="flex items-center gap-2 px-3 py-1.5 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all">
                        <Download className="w-4 h-4" />
                        Export (.log)
                    </button>
                </div>
            </div>

            <div className="flex-1 bg-[#0a0f18] rounded-xl border border-slate-800 shadow-2xl overflow-hidden font-mono flex flex-col relative">
                <div className="bg-slate-950/80 px-4 py-3 flex items-center justify-between border-b border-slate-800 select-none">
                    <div className="flex items-center gap-4">
                        <div className="flex gap-2">
                            <div className="w-3 h-3 rounded-full bg-red-500/80 border border-red-600"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80 border border-yellow-600"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/80 border border-green-600"></div>
                        </div>
                        <span className="text-xs text-slate-500 font-sans tracking-widest uppercase">root@guardian-core:~</span>
                    </div>
                    <div className="text-xs text-slate-600">
                        {isPaused ? 'STREAM PAUSED' : 'LIVE MONITORING'}
                        {!isPaused && <span className="inline-block w-2 h-2 ml-2 rounded-full bg-teal-500 animate-pulse" />}
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto space-y-1.5 custom-scrollbar bg-[#020617]/80 flex flex-col-reverse">
                    <AnimatePresence initial={false}>
                        {/* Reverse the array to show newest at bottom when using flex-col-reverse */}
                        {[...logs].reverse().map((log) => {
                            const style = getLogStyle(log.level);
                            return (
                                <motion.div
                                    key={log.id}
                                    initial={{ opacity: 0, x: -10, height: 0 }}
                                    animate={{ opacity: 1, x: 0, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className={`text-sm flex gap-4 items-start p-1.5 rounded transition-colors group ${log.level === 'critical' ? 'bg-red-500/5' : 'hover:bg-slate-800/30'
                                        }`}
                                >
                                    <span className="text-slate-500 shrink-0 select-none">
                                        [{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}]
                                    </span>

                                    <span className={`shrink-0 uppercase font-bold text-[10px] tracking-wider w-16 pt-0.5 ${style.color}`}>
                                        {log.level}
                                    </span>

                                    <span className={`${style.color} break-words flex-1`}>
                                        {log.message}
                                    </span>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {/* Terminal Input Line Mockup */}
                <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2 text-sm text-slate-300">
                    <span className="text-teal-400 font-bold">root@guardian-core</span>
                    <span className="text-slate-500">~ $</span>
                    <span className="w-2.5 h-4 bg-slate-300 animate-[pulse_1s_infinite]" />
                </div>
            </div>
        </div>
    );
}
