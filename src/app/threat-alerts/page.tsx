'use client';

import { ShieldAlert, AlertOctagon, AlertTriangle, Shield, CheckCircle2, Search, RefreshCw } from 'lucide-react';
import { useEffect, useState } from 'react';

const API_BASE = 'http://localhost:8000';

export default function ThreatAlertsPage() {
    const [threats, setThreats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [lastUpdated, setLastUpdated] = useState('');

    const fetchThreats = async () => {
        try {
            const res = await fetch(`${API_BASE}/api/threats/recent?limit=20`);
            const data = await res.json();
            const mapped = data.map((item: any, index: number) => ({
                id: `TH-${index}-${Date.now()}`,
                type: item.threat_type,
                sourceIp: item.src_ip,
                targetIp: item.dst_ip,
                severity: item.severity,
                timestamp: new Date().toISOString(),
                status: item.severity === 'Critical' ? 'Blocked' : item.severity === 'High' ? 'Investigating' : 'Logged',
                actionTaken: item.action_taken,
                confidence: item.confidence,
            }));
            setThreats(mapped);
            setLastUpdated(new Date().toLocaleTimeString());
            setLoading(false);
        } catch (e) {
            console.error('Failed to fetch threats:', e);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchThreats();
        const interval = setInterval(fetchThreats, 5000);
        return () => clearInterval(interval);
    }, []);

    const getSeverityConfig = (severity: string) => {
        switch (severity.toLowerCase()) {
            case 'critical':
                return { icon: AlertOctagon, color: 'text-red-400', bg: 'bg-red-500/10', badge: 'bg-red-500/10 text-red-400 border border-red-500/30' };
            case 'high':
                return { icon: AlertTriangle, color: 'text-orange-400', bg: 'bg-orange-500/10', badge: 'bg-orange-500/10 text-orange-400 border border-orange-500/30' };
            case 'medium':
                return { icon: Shield, color: 'text-yellow-400', bg: 'bg-yellow-500/10', badge: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/30' };
            default:
                return { icon: CheckCircle2, color: 'text-blue-400', bg: 'bg-blue-500/10', badge: 'bg-blue-500/10 text-blue-400 border border-blue-500/30' };
        }
    };

    const filtered = threats.filter(t =>
        !search || t.type.toLowerCase().includes(search.toLowerCase()) ||
        t.sourceIp.includes(search) || t.targetIp.includes(search) ||
        t.severity.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <ShieldAlert className="w-8 h-8 text-red-500" />
                        Threat Alerts Database
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        Live detections from GuardianOS AI engine &mdash; last updated: <span className="text-teal-400 font-mono">{lastUpdated || '…'}</span>
                    </p>
                </div>
                <div className="flex gap-3 w-full md:w-auto">
                    <div className="relative flex-1 md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Filter by IP, Type, Severity…"
                            className="w-full pl-9 pr-4 py-2 bg-slate-900/50 border border-slate-700 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 transition-all placeholder:text-slate-600"
                        />
                    </div>
                    <button onClick={fetchThreats} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden flex flex-col min-h-[500px]">
                <div className="flex-1 overflow-x-auto">
                    {loading ? (
                        <div className="flex items-center justify-center h-64">
                            <div className="text-slate-500 text-sm animate-pulse">Fetching threats from GuardianOS…</div>
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-64 text-slate-500 gap-3">
                            <CheckCircle2 className="w-10 h-10 text-green-500/50" />
                            <p>No threats detected matching your criteria.</p>
                        </div>
                    ) : (
                        <table className="w-full text-left border-collapse whitespace-nowrap">
                            <thead>
                                <tr className="bg-slate-950/80 text-slate-400 text-xs uppercase tracking-widest border-b border-slate-800">
                                    <th className="p-4 font-semibold">Incident Type</th>
                                    <th className="p-4 font-semibold">Source</th>
                                    <th className="p-4 font-semibold">Target</th>
                                    <th className="p-4 font-semibold">Severity</th>
                                    <th className="p-4 font-semibold">Confidence</th>
                                    <th className="p-4 font-semibold">Status</th>
                                    <th className="p-4 font-semibold">Action Taken</th>
                                    <th className="p-4 font-semibold text-right">Timestamp</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {filtered.map((threat) => {
                                    const config = getSeverityConfig(threat.severity);
                                    const Icon = config.icon;
                                    return (
                                        <tr key={threat.id} className="hover:bg-slate-800/40 transition-colors cursor-pointer group">
                                            <td className="p-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`p-2 rounded-lg ${config.bg}`}>
                                                        <Icon className={`w-4 h-4 ${config.color}`} />
                                                    </div>
                                                    <span className="font-medium text-slate-200 group-hover:text-white transition-colors">{threat.type}</span>
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
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                                                        <div
                                                            className={`h-full rounded-full ${threat.confidence > 0.9 ? 'bg-red-500' : threat.confidence > 0.75 ? 'bg-orange-500' : 'bg-yellow-500'}`}
                                                            style={{ width: `${(threat.confidence * 100).toFixed(0)}%` }}
                                                        />
                                                    </div>
                                                    <span className="text-xs text-slate-400 font-mono">{(threat.confidence * 100).toFixed(0)}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${threat.status === 'Investigating' ? 'bg-orange-500 animate-pulse' : threat.status === 'Blocked' ? 'bg-red-500' : 'bg-slate-500'}`} />
                                                    <span className="text-sm text-slate-300">{threat.status}</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-slate-400 text-sm">{threat.actionTaken}</td>
                                            <td className="p-4 text-right text-slate-500 font-mono text-xs">
                                                {new Date(threat.timestamp).toLocaleTimeString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
                <div className="p-4 border-t border-slate-800 bg-slate-950/30 flex items-center justify-between text-sm text-slate-400">
                    <div>Showing <span className="text-white font-medium">{filtered.length}</span> live detections</div>
                    <div className="flex items-center gap-2 text-xs text-teal-400">
                        <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse inline-block" />
                        Auto-refreshing every 5s
                    </div>
                </div>
            </div>
        </div>
    );
}
