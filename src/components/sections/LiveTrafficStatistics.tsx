'use client';

import { useEffect, useState } from 'react';
import { Activity, ShieldAlert, Wifi, Server } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LiveTrafficStatistics() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/traffic/stats');
        const json = await res.json();

        // Map Python backend format to frontend format
        setData({
          currentBandwidth: `${(json.current_bandwidth_bps / 1000000).toFixed(2)} Mbps`,
          activeNodes: json.active_nodes,
          droppedPackets: Math.floor(json.total_packets * 0.05), // Mock derived stat for UI
          encryptionRate: '99.8%'
        });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch traffic stats:', error);
        setLoading(false);
      }
    };
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-32 w-full bg-slate-900/40 rounded-xl border border-slate-800">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  const stats = [
    { label: "Packets Analyzed", value: data?.totalPacketsAnalyzed?.toLocaleString() || "0", icon: Activity, color: "text-teal-400", bg: "bg-teal-500/10", border: "border-teal-500/20", shadow: "hover:shadow-[0_0_20px_rgba(20,184,166,0.15)]" },
    { label: "Blocked Threats", value: data?.currentlyBlockedThreats?.toLocaleString() || "0", icon: ShieldAlert, color: "text-red-400", bg: "bg-red-500/10", border: "border-red-500/20", shadow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]" },
    { label: "Active Connections", value: data?.activeConnections?.toLocaleString() || "0", icon: Wifi, color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20", shadow: "hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]" },
    { label: "Network Load", value: data?.networkLoad || "0%", icon: Server, color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20", shadow: "hover:shadow-[0_0_20px_rgba(168,85,247,0.15)]" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.1, duration: 0.4 }}
          className={`bg-slate-900/60 backdrop-blur-md border ${stat.border} p-5 rounded-xl transition-all duration-300 relative overflow-hidden group ${stat.shadow}`}
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transform scale-150 rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110 duration-500">
            <stat.icon className={`w-24 h-24 ${stat.color}`} />
          </div>

          <div className="flex justify-between items-start mb-4 relative z-10">
            <div className={`p-2.5 rounded-lg ${stat.bg} ring-1 ring-inset ${stat.border}`}>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </div>
            {idx === 0 && (
              <span className="flex h-2.5 w-2.5 relative mt-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-500"></span>
              </span>
            )}
          </div>
          <div className="relative z-10">
            <h3 className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">{stat.label}</h3>
            <div className="flex items-baseline gap-2">
              <p className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                {stat.value}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
