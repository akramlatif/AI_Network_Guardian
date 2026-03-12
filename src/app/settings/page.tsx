'use client';

import { Settings, Shield, Bell, User, Key, Globe, Database, Save } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('security');

    const handleSave = () => {
        toast.success('Settings Saved', {
            description: 'Your configuration changes have been applied successfully.',
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3 text-white">
                        <Settings className="w-8 h-8 text-slate-400" />
                        System Configuration
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Manage AI Network Guardian parameters</p>
                </div>

                <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2 bg-teal-500 hover:bg-teal-600 text-white text-sm font-medium rounded-lg shadow-[0_0_15px_rgba(20,184,166,0.3)] transition-all">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Settings Navigation Sidebar */}
                <div className="w-full md:w-64 space-y-2">
                    <button
                        onClick={() => setActiveTab('security')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'security'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                            }`}
                    >
                        <Shield className="w-5 h-5" />
                        Security Rules
                    </button>
                    <button
                        onClick={() => setActiveTab('network')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'network'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                            }`}
                    >
                        <Globe className="w-5 h-5" />
                        Network Topology
                    </button>
                    <button
                        onClick={() => setActiveTab('notifications')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'notifications'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                            }`}
                    >
                        <Bell className="w-5 h-5" />
                        Alerts & Notifications
                    </button>
                    <button
                        onClick={() => setActiveTab('api')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === 'api'
                            ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
                            : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200 border border-transparent'
                            }`}
                    >
                        <Key className="w-5 h-5" />
                        API Keys
                    </button>
                </div>

                {/* Settings Content Area */}
                <div className="flex-1 bg-slate-900/60 backdrop-blur-md border border-slate-800 rounded-xl p-6 md:p-8">

                    {activeTab === 'security' && (
                        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Automated Threat Mitigation</h2>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                                        <div>
                                            <h3 className="text-slate-200 font-medium">Auto-ban Malicious IPs</h3>
                                            <p className="text-slate-500 text-sm mt-1">Automatically drop traffic from IPs with high risk scores.</p>
                                        </div>
                                        {/* Toggle Switch */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </div>

                                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-950/50 border border-slate-800">
                                        <div>
                                            <h3 className="text-slate-200 font-medium">DDoS Protection Mode</h3>
                                            <p className="text-slate-500 text-sm mt-1">Enable aggressive rate limiting during traffic spikes.</p>
                                        </div>
                                        {/* Toggle Switch */}
                                        <label className="relative inline-flex items-center cursor-pointer">
                                            <input type="checkbox" className="sr-only peer" defaultChecked />
                                            <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-800" />

                            <div>
                                <h2 className="text-xl font-bold text-white mb-4">Deep Packet Inspection (DPI)</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-slate-400 text-sm mb-2">Sensitivity Level</label>
                                        <select defaultValue="High (Maximum Security)" className="w-full md:w-1/2 p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500">
                                            <option value="Low (Performance Optimized)">Low (Performance Optimized)</option>
                                            <option value="Medium (Balanced)">Medium (Balanced)</option>
                                            <option value="High (Maximum Security)">High (Maximum Security)</option>
                                            <option value="Paranoid (Log Everything)">Paranoid (Log Everything)</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== 'security' && (
                        <div className="flex flex-col items-center justify-center h-64 text-center space-y-4 animate-in fade-in duration-500">
                            <Database className="w-12 h-12 text-slate-700" />
                            <div>
                                <h2 className="text-xl font-bold text-slate-300">Configuration Locked</h2>
                                <p className="text-slate-500 mt-2 max-w-md">This configuration module is currently read-only in the demonstration environment.</p>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
