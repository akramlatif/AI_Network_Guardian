'use client';

import LiveTrafficStatistics from "@/components/sections/LiveTrafficStatistics";
import DetectedThreats from "@/components/sections/DetectedThreats";
import AttackTypeClassification from "@/components/sections/AttackTypeClassification";
import LogsAndAlerts from "@/components/sections/LogsAndAlerts";
import { toast } from 'sonner';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-blue-500">
            Network Overview
          </h1>
          <p className="text-slate-400 text-sm mt-1">Real-time threat monitoring and system status</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/system-logs"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Export Data
          </Link>
          <Link
            href="/settings"
            className="px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.5)] transition-all cursor-pointer"
          >
            Settings
          </Link>
        </div>
      </div>

      {/* Top Stats Row */}
      <LiveTrafficStatistics />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DetectedThreats />
          <LogsAndAlerts />
        </div>
        <div className="lg:col-span-1">
          <AttackTypeClassification />
        </div>
      </div>
    </div>
  );
}
