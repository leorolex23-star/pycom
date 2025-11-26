
import React, { useState } from 'react';
import { CloudArrowDownIcon, GitHubIcon, ArrowPathIcon, CheckCircleIcon, XMarkIcon, TerminalIcon } from '../Icons.tsx';
import type { Deployment } from '../../types.ts';

const DeploymentManager: React.FC = () => {
    const [deployments, setDeployments] = useState<Deployment[]>([
        { id: '1', name: 'pycom-blog', repo: 'jeyabal/pycom-blog', branch: 'main', status: 'deployed', url: 'https://blog.pycom.app', lastBuilt: '2m ago', commitMessage: 'Update styles' }
    ]);
    const [isDeploying, setIsDeploying] = useState(false);
    const [logs, setLogs] = useState<string[]>([]);

    const startDeployment = () => {
        setIsDeploying(true);
        setLogs(['> Initializing build environment...', '> Cloning repository jeyabal/new-project...']);
        
        setTimeout(() => {
            setLogs(prev => [...prev, '> Installing dependencies (pip install -r requirements.txt)...', '> Found 42 packages.']);
            setTimeout(() => {
                setLogs(prev => [...prev, '> Running tests...', '> Tests passed (12/12).']);
                setTimeout(() => {
                    setLogs(prev => [...prev, '> Building Docker image...', '> Pushing to registry...', '> Deployment successful!']);
                    setIsDeploying(false);
                    const newDeploy: Deployment = {
                        id: Date.now().toString(),
                        name: 'new-project',
                        repo: 'jeyabal/new-project',
                        branch: 'main',
                        status: 'deployed',
                        url: 'https://new-project.pycom.app',
                        lastBuilt: 'Just now',
                        commitMessage: 'Initial commit'
                    };
                    setDeployments([newDeploy, ...deployments]);
                }, 2000);
            }, 1500);
        }, 1500);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* Deployment List */}
            <div className="lg:col-span-2 space-y-4 overflow-y-auto">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="text-white font-bold text-lg">Active Deployments</h3>
                    <button 
                        onClick={startDeployment}
                        disabled={isDeploying}
                        className="bg-purple-600 hover:bg-purple-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
                    >
                        {isDeploying ? 'Deploying...' : '+ New Project'}
                    </button>
                </div>
                
                {deployments.map(deploy => (
                    <div key={deploy.id} className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex items-center justify-between hover:border-purple-500/50 transition-colors">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="font-bold text-white">{deploy.name}</h4>
                                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded flex items-center gap-1">
                                    <GitHubIcon className="w-3 h-3" /> {deploy.repo}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-slate-500">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> {deploy.branch}</span>
                                <span>{deploy.commitMessage}</span>
                                <span>{deploy.lastBuilt}</span>
                            </div>
                        </div>
                        <div className="text-right">
                            {deploy.status === 'deployed' && (
                                <a href={deploy.url} target="_blank" rel="noreferrer" className="text-purple-400 text-sm font-bold hover:underline flex items-center gap-1">
                                    Visit Site <CloudArrowDownIcon className="w-4 h-4" />
                                </a>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Logs Panel */}
            <div className="bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden h-96 lg:h-auto">
                <div className="bg-slate-900 p-3 border-b border-slate-800 flex items-center gap-2">
                    <TerminalIcon className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">Build Logs</span>
                </div>
                <div className="flex-grow p-4 font-mono text-xs overflow-y-auto space-y-1">
                    {logs.length === 0 && <span className="text-slate-600 italic">Ready to deploy...</span>}
                    {logs.map((log, i) => (
                        <div key={i} className="text-green-400">{log}</div>
                    ))}
                    {isDeploying && <div className="animate-pulse text-green-500">_</div>}
                </div>
            </div>
        </div>
    );
};

export default DeploymentManager;
