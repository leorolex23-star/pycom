
import React, { useState, useEffect } from 'react';
import type { ServerInstance } from '../../types.ts';
import { 
    ServerIcon, TerminalIcon, CubeIcon, CheckCircleIcon, 
    CloudArrowUpIcon, TrashIcon, DatabaseIcon, 
    CpuChipIcon, GlobeAltIcon, ChartBarIcon, LockClosedIcon,
    ArrowPathIcon
} from '../Icons.tsx';

const ResourceGauge: React.FC<{ label: string, value: number, unit: string }> = ({ label, value, unit }) => {
    let color = 'bg-green-500';
    if (value > 80) color = 'bg-red-500';
    else if (value > 50) color = 'bg-yellow-500';

    return (
        <div className="flex flex-col w-full">
            <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                <span>{label}</span>
                <span className="font-mono">{value.toFixed(1)}{unit}</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ease-out ${color}`} 
                    style={{ width: `${Math.min(value, 100)}%` }}
                ></div>
            </div>
        </div>
    );
};

type SubTab = 'overview' | 'data' | 'infrastructure' | 'tools';

const ServerControlPanel: React.FC = () => {
    const [activeSubTab, setActiveSubTab] = useState<SubTab>('overview');
    const [servers, setServers] = useState<ServerInstance[]>([
        { 
            id: '1', name: 'PyCom Cloud Native (Free)', type: 'cloud', ip: '10.0.0.1', status: 'running', region: 'PyCom-Central', mcpEnabled: true, 
            metrics: { cpu: 12, ram: 24, diskIo: 5 },
            installedServices: [
                { id: 's1', name: 'FAISS', type: 'vector-db', status: 'running', port: 0 }
            ]
        },
        { id: '2', name: 'Localhost Docker', type: 'local', ip: '127.0.0.1', status: 'running', region: 'Local', mcpEnabled: true, metrics: { cpu: 5, ram: 10, diskIo: 0 }, installedServices: [] },
    ]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

    // Simulate Real-time Metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setServers(prevServers => prevServers.map(server => {
                if (server.status !== 'running') return { ...server, metrics: { cpu: 0, ram: 0, diskIo: 0 } };
                const newCpu = Math.min(100, Math.max(1, (server.metrics?.cpu || 10) + (Math.random() * 10 - 5)));
                const newRam = Math.min(100, Math.max(5, (server.metrics?.ram || 20) + (Math.random() * 5 - 2.5)));
                const newDisk = Math.max(0, (Math.random() * 50));
                return { ...server, metrics: { cpu: newCpu, ram: newRam, diskIo: newDisk } };
            }));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const openTerminal = (id: string) => {
        setActiveTerminal(id);
        const server = servers.find(s => s.id === id);
        setTerminalOutput([
            `Connecting to ${server?.name} (${server?.ip})...`,
            'Authenticating via PyCom Secure Shell...',
            'Access Granted.',
            'Welcome to PyCom OS 2.0 LTS',
            `root@${server?.name.replace(/\s/g, '-')}:~# `
        ]);
    };

    const NavButton: React.FC<{ id: SubTab, label: string, icon: any }> = ({ id, label, icon }) => (
        <button 
            onClick={() => setActiveSubTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeSubTab === id ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
        >
            {icon} {label}
        </button>
    );

    return (
        <div className="flex flex-col h-full bg-slate-900 rounded-xl border border-slate-800 overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                <h3 className="text-white font-bold text-lg flex items-center gap-2">
                    <ServerIcon className="w-5 h-5 text-blue-500" />
                    Infrastructure Control
                </h3>
                <div className="flex bg-slate-950 p-1 rounded-lg">
                    <NavButton id="overview" label="Overview" icon={<ChartBarIcon className="w-4 h-4" />} />
                    <NavButton id="data" label="Data & Storage" icon={<DatabaseIcon className="w-4 h-4" />} />
                    <NavButton id="infrastructure" label="Infrastructure" icon={<CpuChipIcon className="w-4 h-4" />} />
                    <NavButton id="tools" label="Tools" icon={<CubeIcon className="w-4 h-4" />} />
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar List */}
                <div className="w-72 border-r border-slate-800 p-4 overflow-y-auto bg-slate-900">
                    {servers.map(server => (
                        <div key={server.id} className={`p-4 mb-3 rounded-xl border cursor-pointer transition-all ${activeTerminal === server.id ? 'bg-slate-800 border-green-500' : 'bg-slate-950 border-slate-800 hover:border-slate-600'}`} onClick={() => openTerminal(server.id)}>
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${server.status === 'running' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                                    <span className="text-sm font-bold text-white">{server.name}</span>
                                </div>
                                {server.type === 'cloud' && <CloudArrowUpIcon className="w-4 h-4 text-purple-400" />}
                            </div>
                            <div className="space-y-2">
                                <ResourceGauge label="CPU" value={server.metrics?.cpu || 0} unit="%" />
                                <ResourceGauge label="RAM" value={server.metrics?.ram || 0} unit="%" />
                            </div>
                        </div>
                    ))}
                    <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-bold hover:border-green-500 hover:text-green-400 transition-colors text-sm">
                        + Provision Server
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-grow p-6 overflow-y-auto bg-black/20">
                    {activeSubTab === 'overview' && (
                        <div className="space-y-6">
                            {/* Terminal */}
                            <div className="bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden h-96 shadow-2xl">
                                <div className="bg-slate-900 p-2 border-b border-slate-800 flex items-center gap-2">
                                    <TerminalIcon className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-mono text-slate-400">Secure Shell Access</span>
                                </div>
                                <div className="flex-grow p-4 font-mono text-sm text-green-400 overflow-y-auto">
                                    {terminalOutput.map((line, i) => <div key={i}>{line}</div>)}
                                    {activeTerminal && <span className="animate-pulse">_</span>}
                                    {!activeTerminal && <div className="text-slate-600 italic text-center mt-20">Select a server instance to connect.</div>}
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSubTab === 'data' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <DatabaseIcon className="w-5 h-5 text-blue-400" /> Relational Databases
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-700">
                                        <div>
                                            <p className="font-bold text-white text-sm">Postgres-Main</p>
                                            <p className="text-xs text-slate-500">v15.2 • 20GB Storage</p>
                                        </div>
                                        <span className="text-xs bg-green-900/30 text-green-400 px-2 py-1 rounded">Healthy</span>
                                    </div>
                                    <button className="w-full py-2 bg-blue-600/20 text-blue-400 text-xs font-bold rounded hover:bg-blue-600/30">+ New Database</button>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <CloudArrowUpIcon className="w-5 h-5 text-orange-400" /> Object Storage (S3)
                                </h4>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center p-3 bg-slate-950 rounded-lg border border-slate-700">
                                        <div>
                                            <p className="font-bold text-white text-sm">pycom-assets-prod</p>
                                            <p className="text-xs text-slate-500">us-east-1 • Public Read</p>
                                        </div>
                                        <span className="text-xs text-slate-400">452 Files</span>
                                    </div>
                                    <button className="w-full py-2 bg-orange-600/20 text-orange-400 text-xs font-bold rounded hover:bg-orange-600/30">+ New Bucket</button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSubTab === 'infrastructure' && (
                        <div className="space-y-6">
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-4">Auto-Scaling Groups</h4>
                                <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-700">
                                    <div>
                                        <p className="font-bold text-white">Web Tier (Gunicorn)</p>
                                        <p className="text-xs text-slate-500">Min: 2 | Max: 10 | Current: 4</p>
                                    </div>
                                    <div className="w-32">
                                        <ResourceGauge label="Avg Load" value={45} unit="%" />
                                    </div>
                                </div>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                                <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                    <LockClosedIcon className="w-4 h-4 text-green-400" /> Security Groups
                                </h4>
                                <div className="grid grid-cols-3 gap-4 text-xs">
                                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                                        <p className="text-slate-400">SSH (22)</p>
                                        <p className="text-green-400">Allowed: 10.0.0.*</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                                        <p className="text-slate-400">HTTP (80)</p>
                                        <p className="text-green-400">Allowed: 0.0.0.0/0</p>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded border border-slate-700">
                                        <p className="text-slate-400">HTTPS (443)</p>
                                        <p className="text-green-400">Allowed: 0.0.0.0/0</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSubTab === 'tools' && (
                        <div className="grid grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                                <div className="w-12 h-12 bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-400">
                                    <GlobeAltIcon className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-white mb-2">Pysrch Browser</h4>
                                <p className="text-xs text-slate-400 mb-4">Secure, sandboxed browsing environment for AI agents.</p>
                                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-purple-700 transition-colors">
                                    Launch Pysrch
                                </button>
                            </div>
                            <div className="bg-slate-900 p-6 rounded-xl border border-slate-800 text-center">
                                <div className="w-12 h-12 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-400">
                                    <CubeIcon className="w-6 h-6" />
                                </div>
                                <h4 className="font-bold text-white mb-2">MCP Bridge</h4>
                                <p className="text-xs text-slate-400 mb-4">Connect local tools to AI models via Model Context Protocol.</p>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">
                                    Configure MCP
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServerControlPanel;
