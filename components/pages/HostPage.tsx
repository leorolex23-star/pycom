
import React, { useState } from 'react';
import { ServerStackIcon, BoltIcon, CloudArrowDownIcon, ShoppingBagIcon, GlobeAltIcon } from '../Icons.tsx';
import DeploymentManager from '../hosting/DeploymentManager.tsx';
import VisualAutomator from '../hosting/VisualAutomator.tsx';
import ServerControlPanel from '../hosting/ServerControlPanel.tsx';
import PyPingChatbot from '../hosting/PyPingChatbot.tsx';
import Marketplace from '../hosting/Marketplace.tsx';
import PysrchBrowser from '../hosting/PysrchBrowser.tsx';

type HostTab = 'manage' | 'deploy' | 'automate' | 'marketplace' | 'browser';

const HostPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState<HostTab>('manage');

    const TabButton: React.FC<{ id: HostTab, label: string, icon: any, color: string }> = ({ id, label, icon, color }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`px-4 lg:px-6 py-2.5 rounded-lg font-bold text-sm flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === id ? `${color} text-white shadow-lg` : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
        >
            {icon}
            <span className="hidden sm:inline">{label}</span>
        </button>
    );

    return (
        <div className="animate-fade-in-up h-[calc(100vh-100px)] flex flex-col relative">
            <PyPingChatbot />
            
            <div className="mb-6 text-center shrink-0">
                <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">PyCom Cloud Host</h1>
                <p className="text-sm md:text-base text-slate-400">Open-Source, AI-Powered Cloud Infrastructure & CI/CD.</p>
            </div>

            <div className="bg-slate-950 rounded-2xl border border-slate-800 flex flex-col flex-grow overflow-hidden shadow-2xl">
                {/* Tabs */}
                <div className="bg-slate-900 p-2 flex justify-center border-b border-slate-800 shrink-0 overflow-x-auto">
                    <div className="flex space-x-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                        <TabButton id="manage" label="Server Control" icon={<ServerStackIcon className="w-4 h-4" />} color="bg-blue-600" />
                        <TabButton id="deploy" label="Deployments" icon={<CloudArrowDownIcon className="w-4 h-4" />} color="bg-purple-600" />
                        <TabButton id="automate" label="Automation" icon={<BoltIcon className="w-4 h-4" />} color="bg-yellow-500 text-gray-900" />
                        <TabButton id="marketplace" label="Marketplace" icon={<ShoppingBagIcon className="w-4 h-4" />} color="bg-pink-600" />
                        <TabButton id="browser" label="Pysrch Browser" icon={<GlobeAltIcon className="w-4 h-4" />} color="bg-teal-600" />
                    </div>
                </div>

                {/* Content */}
                <div className="flex-grow p-4 md:p-6 overflow-hidden bg-slate-950 relative">
                    <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                    {activeTab === 'manage' && <ServerControlPanel />}
                    {activeTab === 'deploy' && <DeploymentManager />}
                    {activeTab === 'automate' && <VisualAutomator />}
                    {activeTab === 'marketplace' && <Marketplace />}
                    {activeTab === 'browser' && <PysrchBrowser />}
                </div>
            </div>
        </div>
    );
};

export default HostPage;
