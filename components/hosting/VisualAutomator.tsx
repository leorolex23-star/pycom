
import React, { useState } from 'react';
import { BoltIcon, CodeBracketIcon, DatabaseIcon, RobotIcon, ArrowPathIcon } from '../Icons.tsx';

const VisualAutomator: React.FC = () => {
    const [nodes, setNodes] = useState([
        { id: 1, type: 'webhook', label: 'Webhook Listener', x: 50, y: 100, status: 'active' },
        { id: 2, type: 'script', label: 'Python Script', x: 300, y: 100, status: 'idle' },
        { id: 3, type: 'ai', label: 'Gemini Agent', x: 550, y: 100, status: 'idle' },
        { id: 4, type: 'db', label: 'Postgres Insert', x: 800, y: 100, status: 'idle' },
    ]);

    const [isRunning, setIsRunning] = useState(false);

    const handleRun = () => {
        setIsRunning(true);
        // Simulate execution flow
        nodes.forEach((node, index) => {
            setTimeout(() => {
                setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'running' } : n));
                setTimeout(() => {
                    setNodes(prev => prev.map(n => n.id === node.id ? { ...n, status: 'success' } : n));
                    if (index === nodes.length - 1) setIsRunning(false);
                }, 1000);
            }, index * 1200);
        });
    };

    const getNodeColor = (type: string) => {
        switch(type) {
            case 'webhook': return 'bg-orange-600';
            case 'script': return 'bg-blue-600';
            case 'ai': return 'bg-purple-600';
            case 'db': return 'bg-green-600';
            default: return 'bg-gray-600';
        }
    };

    const getNodeIcon = (type: string) => {
        switch(type) {
            case 'webhook': return <BoltIcon className="w-5 h-5" />;
            case 'script': return <CodeBracketIcon className="w-5 h-5" />;
            case 'ai': return <RobotIcon className="w-5 h-5" />;
            case 'db': return <DatabaseIcon className="w-5 h-5" />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center">
                <h2 className="font-bold text-white flex items-center gap-2">
                    <BoltIcon className="w-6 h-6 text-yellow-400" />
                    Workflow Automator
                </h2>
                <button 
                    onClick={handleRun} 
                    disabled={isRunning}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors"
                >
                    {isRunning ? <ArrowPathIcon className="w-4 h-4 animate-spin" /> : <BoltIcon className="w-4 h-4" />}
                    {isRunning ? 'Executing...' : 'Test Workflow'}
                </button>
            </div>
            
            <div className="flex-grow bg-slate-950 relative overflow-hidden p-8">
                {/* Grid Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
                <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(#334155 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.2 }}></div>

                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <path d="M 200 140 L 300 140" stroke="#475569" strokeWidth="2" />
                    <path d="M 450 140 L 550 140" stroke="#475569" strokeWidth="2" />
                    <path d="M 700 140 L 800 140" stroke="#475569" strokeWidth="2" />
                </svg>

                {/* Nodes */}
                {nodes.map(node => (
                    <div 
                        key={node.id}
                        className={`absolute w-40 p-3 rounded-xl shadow-lg border-2 transition-all duration-300 ${
                            node.status === 'running' ? 'border-yellow-400 scale-105 shadow-yellow-500/20' :
                            node.status === 'success' ? 'border-green-500 shadow-green-500/20' : 
                            'border-slate-700 bg-slate-900'
                        }`}
                        style={{ left: node.x, top: node.y }}
                    >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 text-white ${getNodeColor(node.type)}`}>
                            {getNodeIcon(node.type)}
                        </div>
                        <p className="text-xs text-white font-bold">{node.label}</p>
                        <p className="text-[10px] text-slate-400 mt-1 capitalize">{node.status}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default VisualAutomator;
