
import React, { useState } from 'react';
import { ServerStackIcon, BoltIcon, CloudArrowDownIcon } from '../Icons.tsx';
import DeploymentManager from '../hosting/DeploymentManager.tsx';
import VisualAutomator from '../hosting/VisualAutomator.tsx';
import ServerControlPanel from '../hosting/ServerControlPanel.tsx';

type HostTab = 'deploy' | 'automate' | 'manage';

const HostPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<HostTab>('manage');

    return (
        <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-8 text-center shrink-0">
                <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-2">Host & Build</h1>
                <p className="text-lg text-slate-400">Self-hosted infrastructure, CI/CD pipelines, and workflow automation.</p>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col flex-grow overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="bg-slate-900 p-2 flex justify-center border-b border-slate-800 shrink-0">
                    <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <button
                            onClick={() => setActiveTab('manage')}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                                activeTab === 'manage' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <ServerStackIcon className="w-4 h-4" />
                            Server Control
                        </button>
                        <button
                            onClick={() => setActiveTab('deploy')}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                                activeTab === 'deploy' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <CloudArrowDownIcon className="w-4 h-4" />
                            Deployments
                        </button>
                        <button
                            onClick={() => setActiveTab('automate')}
                            className={`px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                                activeTab === 'automate' ? 'bg-yellow-500 text-gray-900 shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                            }`}
                        >
                            <BoltIcon className="w-4 h-4" />
                            Automation
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-6 overflow-hidden bg-slate-950 relative">
                    <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                    {activeTab === 'manage' && <ServerControlPanel />}
                    {activeTab === 'deploy' && <DeploymentManager />}
                    {activeTab === 'automate' && <VisualAutomator />}
                </div>
            </div>
        </div>
    );
};

export default HostPage;
