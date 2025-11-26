
import React from 'react';
import { MCP_SERVICES } from '../../constants.ts';
import { CubeIcon, CheckCircleIcon, XMarkIcon, ArrowPathIcon, ServerStackIcon } from '../Icons.tsx';

const MCPServer: React.FC = () => {
    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <CubeIcon className="w-8 h-8 text-blue-500" />
                        MCP Server Control
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Model Context Protocol v1.0.2 • Local Instance</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-green-900/20 border border-green-500/30 rounded-lg">
                    <span className="relative flex h-3 w-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <span className="text-green-400 font-mono text-sm font-bold">ONLINE</span>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-y-auto">
                {/* Server Stats */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                        <ServerStackIcon className="w-5 h-5 text-purple-400" />
                        System Resources
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                                <span>Context Window Usage</span>
                                <span>4,096 / 32,000 Tokens</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '12%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm text-slate-400 mb-1">
                                <span>Memory (RAM)</span>
                                <span>1.2 GB / 8.0 GB</span>
                            </div>
                            <div className="w-full bg-slate-800 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pt-4 border-t border-slate-800">
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">12ms</p>
                                <p className="text-xs text-slate-500">Avg Latency</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">99.9%</p>
                                <p className="text-xs text-slate-500">Uptime</p>
                            </div>
                            <div className="text-center">
                                <p className="text-2xl font-bold text-white">5</p>
                                <p className="text-xs text-slate-500">Active Tools</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Connections List */}
                <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-bold text-white">Connected Resources</h3>
                        <button className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors">
                            + Add Resource
                        </button>
                    </div>
                    <div className="space-y-3">
                        {MCP_SERVICES.map(service => (
                            <div key={service.id} className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800 group hover:border-slate-600 transition-colors">
                                <div className="flex items-center gap-3">
                                    <div className={`w-2 h-2 rounded-full ${service.status === 'connected' ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <div>
                                        <p className="font-semibold text-slate-200 text-sm">{service.name}</p>
                                        <p className="text-xs text-slate-500 uppercase">{service.type} • {service.latency}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-slate-400 hover:text-white"><ArrowPathIcon className="w-4 h-4" /></button>
                                    <button className="text-slate-400 hover:text-red-400"><XMarkIcon className="w-4 h-4" /></button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Live Logs */}
                <div className="col-span-1 lg:col-span-2 bg-black rounded-xl border border-slate-800 font-mono text-xs p-4 h-48 overflow-y-auto">
                    <div className="text-green-500">[MCP-CORE] Server started on port 3000</div>
                    <div className="text-blue-400">[MCP-CONN] Establishing connection to PostgresDB... Success.</div>
                    <div className="text-blue-400">[MCP-CONN] Handshake with HubSpot API... Validated.</div>
                    <div className="text-yellow-500">[MCP-WARN] Slack Bot integration token expired. Re-auth required.</div>
                    <div className="text-slate-500">[MCP-IDLE] Waiting for agent requests...</div>
                    <div className="animate-pulse text-green-500">_</div>
                </div>
            </div>
        </div>
    );
};

export default MCPServer;
