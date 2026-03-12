'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShieldAlert,
  Activity,
  Terminal,
  LayoutDashboard,
  Settings,
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 transition-transform -translate-x-full sm:translate-x-0 bg-[#0f172a] border-r border-slate-800 flex flex-col">
      <div className="h-full px-3 py-4 overflow-y-auto w-full">
        <div className="flex items-center mb-8 px-2 mt-2 gap-3 w-full">
          <div className="p-2 bg-teal-500/10 rounded-lg border border-teal-500/20 shrink-0">
            <ShieldAlert className="w-6 h-6 text-teal-400" />
          </div>
          <span className="self-center text-xl font-bold whitespace-nowrap text-white truncate">Guardian<span className="text-teal-400">OS</span></span>
        </div>
        <ul className="space-y-2 font-medium w-full">
          <li className="w-full">
            <Link href="/" className={`flex items-center p-3 rounded-lg group transition-colors w-full ${pathname === '/'
                ? 'text-white bg-slate-800 border-l-2 border-teal-500 shadow-[inset_4px_0_0_rgba(20,184,166,1)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}>
              <LayoutDashboard className={`w-5 h-5 transition duration-75 shrink-0 ${pathname === '/' ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="ms-3 truncate">Dashboard</span>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/network-traffic" className={`flex items-center p-3 rounded-lg group transition-colors w-full ${pathname === '/network-traffic'
                ? 'text-white bg-slate-800 border-l-2 border-teal-500 shadow-[inset_4px_0_0_rgba(20,184,166,1)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}>
              <Activity className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/network-traffic' ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1 ms-3 whitespace-nowrap truncate">Network Traffic</span>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/threat-alerts" className={`flex items-center p-3 rounded-lg group transition-colors w-full ${pathname === '/threat-alerts'
                ? 'text-white bg-slate-800 border-l-2 border-teal-500 shadow-[inset_4px_0_0_rgba(20,184,166,1)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}>
              <ShieldAlert className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/threat-alerts' ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1 ms-3 whitespace-nowrap truncate">Threat Alerts</span>
              <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 ms-3 text-[10px] font-medium text-red-100 bg-red-500/20 rounded-full border border-red-500/30">3</span>
            </Link>
          </li>
          <li className="w-full">
            <Link href="/system-logs" className={`flex items-center p-3 rounded-lg group transition-colors w-full ${pathname === '/system-logs'
                ? 'text-white bg-slate-800 border-l-2 border-teal-500 shadow-[inset_4px_0_0_rgba(20,184,166,1)]'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
              }`}>
              <Terminal className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/system-logs' ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
              <span className="flex-1 ms-3 whitespace-nowrap truncate">System Logs</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="p-4 border-t border-slate-800 mt-auto w-full">
        <Link href="/settings" className={`flex items-center p-3 rounded-lg group transition-colors w-full ${pathname === '/settings'
            ? 'text-white bg-slate-800 border-l-2 border-teal-500 shadow-[inset_4px_0_0_rgba(20,184,166,1)]'
            : 'text-slate-300 hover:text-white hover:bg-slate-800/50 border-l-2 border-transparent'
          }`}>
          <Settings className={`flex-shrink-0 w-5 h-5 transition duration-75 ${pathname === '/settings' ? 'text-teal-400' : 'text-slate-400 group-hover:text-white'}`} />
          <span className="flex-1 ms-3 whitespace-nowrap truncate">Settings</span>
        </Link>
      </div>
    </aside>
  );
}
