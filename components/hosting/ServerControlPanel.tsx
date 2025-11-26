
import React, { useState } from 'react';
import type { ServerInstance } from '../../types.ts';
import { ServerIcon, TerminalIcon, CubeIcon, CheckCircleIcon, StopIcon, ArrowPathIcon } from '../Icons.tsx';

const ServerControlPanel: React.FC = () => {
    const [servers, setServers] = useState<ServerInstance[]>([
        { id: '1', name: 'Localhost Docker', type: 'local', ip: '127.0.0.1', status: 'running', region: 'Local', mcpEnabled: true },
        { id: '2', name: 'Production VPS-1', type: 'cloud', ip: '192.168.1.42', status: 'running', region: 'US-East', mcpEnabled: false },
    ]);
    const [activeTerminal, setActiveTerminal] = useState<string | null>(null);
    const [terminalOutput, setTerminalOutput] = useState<string[]>(['Welcome to PyCom Server OS v1.0', 'System is healthy.']);

    const toggleServerStatus = (id: string) => {
        setServers(prev => prev.map(s => s.id === id ? { ...s, status: s.status === 'running' ? 'stopped' : 'running' } : s));
    };

    const toggleMCP = (id: string) => {
        setServers(prev => prev.map(s => s.id === id ? { ...s, mcpEnabled: !s.mcpEnabled } : s));
    };

    const openTerminal = (id: string) => {
        setActiveTerminal(id);
        setTerminalOutput([`Connecting to ${servers.find(s => s.id === id)?.name}...`, 'Auth successful.', `user@${servers.find(s => s.id === id)?.ip}:~$ `]);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Server List */}
            <div className="lg:col-span-1 space-y-4 overflow-y-auto">
                <h3 className="text-white font-bold text-lg mb-2">Infrastructure</h3>
                {servers.map(server => (
                    <div key={server.id} className={`bg-slate-900 border ${activeTerminal === server.id ? 'border-purple-500' : 'border-slate-800'} rounded-xl p-4 transition-all hover:border-slate-600`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${server.type === 'local' ? 'bg-blue-900/30 text-blue-400' : 'bg-orange-900/30 text-orange-400'}`}>
                                    <ServerIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white text-sm">{server.name}</h4>
                                    <p className="text-xs text-slate-500 font-mono">{server.ip}</p>
                                </div>
                            </div>
                            <div className={`w-3 h-3 rounded-full ${server.status === 'running' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 mb-3">
                            <button 
                                onClick={() => toggleMCP(server.id)}
                                className={`text-xs font-bold py-1.5 px-2 rounded border flex items-center justify-center gap-1 transition-colors ${
                                    server.mcpEnabled 
                                    ? 'bg-purple-900/30 text-purple-300 border-purple-500/50' 
                                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
                                }`}
                            >
                                <CubeIcon className="w-3 h-3" />
                                MCP: {server.mcpEnabled ? 'ON' : 'OFF'}
                            </button>
                            <button 
                                onClick={() => openTerminal(server.id)}
                                className="text-xs font-bold py-1.5 px-2 rounded bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 flex items-center justify-center gap-1"
                            >
                                <TerminalIcon className="w-3 h-3" />
                                SSH
                            </button>
                        </div>

                        <button 
                            onClick={() => toggleServerStatus(server.id)}
                            className={`w-full text-xs font-bold py-2 rounded flex items-center justify-center gap-2 transition-colors ${
                                server.status === 'running' 
                                ? 'bg-red-900/20 text-red-400 hover:bg-red-900/40' 
                                : 'bg-green-900/20 text-green-400 hover:bg-green-900/40'
                            }`}
                        >
                            {server.status === 'running' ? 'Stop Server' : 'Start Server'}
                        </button>
                    </div>
                ))}
                <button className="w-full py-3 border-2 border-dashed border-slate-700 rounded-xl text-slate-500 font-bold hover:border-slate-500 hover:text-slate-300 transition-colors">
                    + Provision Server
                </button>
            </div>

            {/* Active Terminal */}
            <div className="lg:col-span-2 bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden h-96 lg:h-auto shadow-2xl">
                <div className="bg-slate-900 p-3 border-b border-slate-800 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <TerminalIcon className="w-4 h-4 text-green-500" />
                        <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                            {activeTerminal ? `SSH: ${servers.find(s => s.id === activeTerminal)?.ip}` : 'No Active Session'}
                        </span>
                    </div>
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                    </div>
                </div>
                <div className="flex-grow p-6 font-mono text-sm text-slate-300 overflow-y-auto space-y-1" onClick={() => document.getElementById('terminal-input')?.focus()}>
                    {terminalOutput.map((line, i) => (
                        <div key={i} className={line.includes('user@') ? 'text-green-400 font-bold mt-4' : ''}>{line}</div>
                    ))}
                    {activeTerminal && (
                        <div className="flex items-center gap-1 text-green-400 font-bold">
                            <span>_</span>
                        </div>
                    )}
                    {!activeTerminal && (
                        <div className="flex items-center justify-center h-full text-slate-600 italic">
                            Select a server to initiate connection...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ServerControlPanel;
