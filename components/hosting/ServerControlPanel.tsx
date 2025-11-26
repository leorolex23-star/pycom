

import React, { useState, useEffect } from 'react';
import type { ServerInstance, ServerService } from '../../types.ts';
import { ServerIcon, TerminalIcon, CubeIcon, CheckCircleIcon, StopIcon, ArrowPathIcon, TrashIcon, CloudArrowUpIcon, ChartBarIcon, CpuChipIcon, DatabaseIcon, PlayIcon } from '../Icons.tsx';

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

const OPEN_SOURCE_SERVICES = [
    { name: 'Milvus', type: 'vector-db', desc: 'High-performance vector database.', port: 19530 },
    { name: 'Qdrant', type: 'vector-db', desc: 'Vector search engine.', port: 6333 },
    { name: 'Weaviate', type: 'vector-db', desc: 'AI-native vector database.', port: 8080 },
    { name: 'FAISS', type: 'vector-db', desc: 'Facebook AI Similarity Search (Local).', port: 0 },
];

const ServerControlPanel: React.FC = () => {
    const [servers, setServers] = useState<ServerInstance[]>([
        { 
            id: '1', name: 'PyCom Cloud Native (Free)', type: 'cloud', ip: '10.0.0.1', status: 'running', region: 'PyCom-Central', mcpEnabled: true, 
            metrics: { cpu: 12, ram: 24, diskIo: 5 },
            installedServices: [
                { id: 's1', name: 'FAISS', type: 'vector-db', status: 'running', port: 0 }
            ]
        },
        { id: '2', name: 'Localhost Docker', type: 'local', ip: '127.0.0.1', status: 'running', region: 'Local', mcpEnabled: true, metrics: { cpu: 5, ram: 10, diskIo: 0 }, installedServices: [] },
        { id: '3', name: 'PyCom Premium GPU-1', type: 'cloud', ip: '192.168.10.5', status: 'stopped', region: 'PyCom-East', mcpEnabled: false, metrics: { cpu: 0, ram: 0, diskIo: 0 }, installedServices: [] },
    ]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string[]>([]);
    const [deployingService, setDeployingService] = useState<string | null>(null);

    // Simulate Real-time Metrics
    useEffect(() => {
        const interval = setInterval(() => {
            setServers(prevServers => prevServers.map(server => {
                if (server.status !== 'running') return { ...server, metrics: { cpu: 0, ram: 0, diskIo: 0 } };
                
                // Random fluctuation logic
                const loadFactor = server.mcpEnabled ? 1.5 : 1.0;
                const baseCpu = server.type === 'cloud' ? 15 : 5;
                
                const newCpu = Math.min(100, Math.max(1, baseCpu * loadFactor + (Math.random() * 20 - 10)));
                const newRam = Math.min(100, Math.max(5, (server.metrics?.ram || 20) + (Math.random() * 5 - 2.5)));
                const newDisk = Math.max(0, (Math.random() * 50 * (newCpu > 50 ? 2 : 0.5)));

                return {
                    ...server,
                    metrics: {
                        cpu: newCpu,
                        ram: newRam,
                        diskIo: newDisk
                    }
                };
            }));
        }, 1000); // Update every second for "real-time" feel

        return () => clearInterval(interval);
    }, []);

    const toggleServerStatus = (id: string) => {
        setServers(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s));
    };

    const toggleMCP = (id: string) => {
        setServers(prev => prev.map(s => s.id === id ? { ...s, mcpEnabled: !s.mcpEnabled } : s));
    };

    const handleDeleteServer = (id: string) => {
        if (window.confirm("DANGER: Are you sure you want to terminate this instance? This cannot be undone.")) {
            setServers(prev => prev.filter(s => s.id !== id));
            if (activeTerminal === id) setActiveTerminal(null);
        }
    };

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

    const handleDeployService = (serverId: string, serviceName: string, type: any, port: number) => {
        setDeployingService(`${serverId}-${serviceName}`);
        
        setTimeout(() => {
            setServers(prev => prev.map(s => {
                if (s.id === serverId) {
                    const existing = s.installedServices || [];
                    if (existing.some(svc => svc.name === serviceName)) return s;
                    
                    return {
                        ...s,
                        installedServices: [...existing, {
                            id: Date.now().toString(),
                            name: serviceName,
                            type: type,
                            status: 'running',
                            port: port
                        }]
                    };
                }
                return s;
            }));
            setDeployingService(null);
        }, 1500);
    };

    const handleStopService = (serverId: string, serviceId: string) => {
        setServers(prev => prev.map(s => {
            if (s.id === serverId) {
                return {
                    ...s,
                    installedServices: s.installedServices?.filter(svc => svc.id !== serviceId)
                };
            }
            return s;
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Server List */}
            <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-bold text-lg">Server Infrastructure</h3>
                    <span className="text-xs bg-purple-900/50 text-purple-300 px-2 py-1 rounded border border-purple-500/30">Admin Access</span>
                </div>
                
                {servers.map(server => (
                    <div key={server.id} className={`bg-slate-900 border ${activeTerminal === server.id ? 'border-green-500' : 'border-slate-800'} rounded-xl p-4 transition-all hover:border-slate-600 group relative shadow-lg`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${server.type === 'local' ? 'bg-blue-900/30 text-blue-400' : 'bg-purple-900/30 text-purple-400'}`}>
                                    {server.type === 'local' ? <ServerIcon className="w-6 h-6" /> : <CloudArrowUpIcon className="w-6 h-6" />}
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{server.name}</h4>
                                    <p className="text-xs text-slate-500 font-mono">{server.ip} • {server.region}</p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${server.status === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                        </div>

                        {/* Real-time Metrics */}
                        {server.status === 'running' && server.metrics && (
                            <div className="bg-black/30 p-3 rounded-lg mb-3 space-y-3 border border-slate-800">
                                <div className="flex items-center justify-between text-[10px] text-slate-500 uppercase tracking-widest mb-1 border-b border-slate-800 pb-1">
                                    <span>Live Metrics</span>
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                </div>
                                <ResourceGauge label="CPU" value={server.metrics.cpu} unit="%" />
                                <ResourceGauge label="RAM" value={server.metrics.ram} unit="%" />
                                <ResourceGauge label="I/O" value={server.metrics.diskIo} unit=" MB/s" />
                            </div>
                        )}

                        {/* Installed Services */}
                        {server.status === 'running' && (
                            <div className="mb-3">
                                <p className="text-[10px] text-slate-500 uppercase tracking-widest mb-2">Services</p>
                                <div className="flex flex-wrap gap-2">
                                    {server.installedServices?.map(svc => (
                                        <div key={svc.id} className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded text-xs text-slate-300 border border-slate-700 group/svc">
                                            <span className="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                                            {svc.name}
                                            <button onClick={() => handleStopService(server.id, svc.id)} className="ml-1 text-slate-500 hover:text-red-400 opacity-0 group-hover/svc:opacity-100">×</button>
                                        </div>
                                    ))}
                                    {(!server.installedServices || server.installedServices.length === 0) && <span className="text-xs text-slate-600 italic">No services running.</span>}
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button 
                                onClick={() => toggleMCP(server.id)}
                                disabled={server.status !== 'running'}
                                className={`text-xs font-bold py-1.5 px-2 rounded border flex items-center justify-center gap-1 transition-colors ${
                                    server.mcpEnabled 
                                    ? 'bg-purple-900/30 text-purple-300 border-purple-500/50' 
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                <CubeIcon className="w-3 h-3" />
                                MCP: {server.mcpEnabled ? 'ON' : 'OFF'}
                            </button>
                            <button 
                                onClick={() => openTerminal(server.id)}
                                disabled={server.status !== 'running'}
                                className="text-xs font-bold py-1.5 px-2 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <TerminalIcon className="w-3 h-3" />
                                Console
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <button 
                                onClick={() => toggleServerStatus(server.id)}
                                className={`flex-grow text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors ${
                                    server.status === 'running' 
                                    ? 'bg-slate-800 text-yellow-400 border border-yellow-600/30 hover:bg-slate-700' 
                                    : 'bg-green-900/20 text-green-400 border border-green-600/30 hover:bg-green-900/40'
                                }`}
                            >
                                {server.status === 'running' ? 'Stop' : 'Start'}
                            </button>
                            <button 
                                onClick={() => handleDeleteServer(server.id)}
                                className="bg-red-900/20 border border-red-600/30 text-red-400 p-2 rounded hover:bg-red-900/40 transition-colors"
                                title="Terminate Instance"
                            >
                                <TrashIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-bold hover:border-green-500 hover:text-green-400 transition-colors bg-slate-900/50">
                    + Provision New PyCom Server
                </button>
            </div>

            {/* Details Area */}
            <div className="lg:col-span-2 flex flex-col gap-6">
                
                {/* Open Source Service Manager */}
                {activeTerminal && servers.find(s => s.id === activeTerminal) && (
                    <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <DatabaseIcon className="w-5 h-5 text-yellow-400" />
                            Deploy Open Source Services (Free)
                        </h3>
                        <p className="text-sm text-slate-400 mb-6">Reduce costs by self-hosting vector stores and tools directly on your PyCom server.</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {OPEN_SOURCE_SERVICES.map(svc => {
                                const server = servers.find(s => s.id === activeTerminal);
                                const isInstalled = server?.installedServices?.some(is => is.name === svc.name);
                                const isDeploying = deployingService === `${activeTerminal}-${svc.name}`;

                                return (
                                    <div key={svc.name} className="bg-slate-950 border border-slate-800 rounded-lg p-4 hover:border-purple-500/50 transition-colors">
                                        <h4 className="font-bold text-white mb-1">{svc.name}</h4>
                                        <p className="text-[10px] text-slate-500 mb-3 h-8">{svc.desc}</p>
                                        {isInstalled ? (
                                            <button disabled className="w-full bg-green-900/30 text-green-400 text-xs font-bold py-2 rounded border border-green-500/30 cursor-default flex items-center justify-center gap-1">
                                                <CheckCircleIcon className="w-3 h-3" /> Running
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => handleDeployService(activeTerminal!, svc.name, svc.type, svc.port)}
                                                disabled={isDeploying}
                                                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2 rounded transition-colors flex items-center justify-center gap-1 disabled:opacity-50"
                                            >
                                                {isDeploying ? <ArrowPathIcon className="w-3 h-3 animate-spin" /> : <CloudArrowUpIcon className="w-3 h-3" />}
                                                {isDeploying ? 'Deploying...' : 'Deploy'}
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Active Terminal */}
                <div className="bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden flex-grow shadow-2xl min-h-[300px]">
                    <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <TerminalIcon className="w-4 h-4 text-green-500" />
                            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider font-mono">
                                {activeTerminal ? `ROOT@${servers.find(s => s.id === activeTerminal)?.ip}` : 'DISCONNECTED'}
                            </span>
                        </div>
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                        </div>
                    </div>
                    <div className="flex-grow p-6 font-mono text-sm text-slate-300 overflow-y-auto space-y-1" onClick={() => document.getElementById('server-term-input')?.focus()}>
                        {terminalOutput.map((line, i) => (
                            <div key={i} className={line.includes('root@') ? 'text-green-400 font-bold mt-4' : ''}>{line}</div>
                        ))}
                        {activeTerminal && (
                            <div className="flex items-center gap-1 text-green-400 font-bold">
                                <span>_</span>
                            </div>
                        )}
                        {!activeTerminal && (
                            <div className="flex items-center justify-center h-full text-slate-600 italic flex-col gap-2">
                                <ServerIcon className="w-12 h-12 opacity-20" />
                                <p>Select a server instance to establish secure shell connection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServerControlPanel;