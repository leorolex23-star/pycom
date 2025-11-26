
import React, { useState, useEffect, useRef } from 'react';
import type { Agent, AgentWorkflow, WorkflowTemplate } from '../../types.ts';
import { AGENT_WORKFLOWS } from '../../constants.ts';
import { 
    RobotIcon, CogIcon, PlayIcon, CheckCircleIcon, ArrowRightOnRectangleIcon, 
    PlusIcon, LinkIcon, DatabaseIcon, CubeIcon, DownloadIcon, ArrowPathIcon, TableCellsIcon
} from '../Icons.tsx';
import IntegrationsModal from './IntegrationsModal.tsx';
import AutoPilot from './AutoPilot.tsx';
import MCPServer from './MCPServer.tsx';
import KnowledgeBase from './KnowledgeBase.tsx';
import AgentSettings from './AgentSettings.tsx';
import BigDataTool from './BigDataTool.tsx';

interface AgentWorkstationProps {
    agent: Agent;
    onLogout: () => void;
}

type View = 'dashboard' | 'mcp' | 'autopilot' | 'knowledge' | 'settings' | 'bigdata';

const AgentWorkstation: React.FC<AgentWorkstationProps> = ({ agent, onLogout }) => {
    const [activeView, setActiveView] = useState<View>('dashboard');
    const [isIntegrationModalOpen, setIsIntegrationModalOpen] = useState(false);
    const [connectedServices, setConnectedServices] = useState<string[]>([]);
    
    // Workflow State
    const [workflowStatus, setWorkflowStatus] = useState<'idle' | 'initializing' | 'running' | 'completed'>('idle');
    const [currentStepIndex, setCurrentStepIndex] = useState(-1);
    const [logs, setLogs] = useState<string[]>([]);
    const [artifacts, setArtifacts] = useState<{name: string, type: string}[]>([]);
    const [activeWorkflowName, setActiveWorkflowName] = useState<string>(AGENT_WORKFLOWS[agent.id]?.name || 'Default Workflow');
    const [workflowSteps, setWorkflowSteps] = useState(AGENT_WORKFLOWS[agent.id]?.steps || []);
    
    const logContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (logContainerRef.current) {
            logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
        }
    }, [logs]);

    const addLog = (message: string, type: 'info' | 'success' | 'warn' | 'error' = 'info') => {
        const timestamp = new Date().toLocaleTimeString();
        let colorClass = 'text-green-500';
        if (type === 'warn') colorClass = 'text-yellow-500';
        if (type === 'success') colorClass = 'text-blue-400';
        if (type === 'error') colorClass = 'text-red-500';
        
        setLogs(prev => [`<span class="text-slate-500 font-mono text-[10px]">[${timestamp}]</span> <span class="${colorClass}">${message}</span>`, ...prev]);
    };

    const handleDeployTemplate = (template: WorkflowTemplate) => {
        setActiveWorkflowName(template.title);
        const actions = [
            "Initializing Context Vector Store",
            "Authenticating with External APIs",
            "Scraping Data Source A",
            "Normalizing Data Schema",
            "Generating Intermediate Embeddings",
            "Synthesizing Report Draft",
            "Finalizing Artifact Output",
            "Cleaning Up Temp Files"
        ];
        
        const newSteps = Array.from({ length: template.steps }).map((_, i) => ({
            id: i + 1,
            action: actions[i % actions.length] || `Executing Logic Block ${i}`,
            tool: i % 2 === 0 ? 'MCP Bridge' : 'Gemini 2.5 Pro',
            duration: 1500 + Math.random() * 1000,
            outputDescription: `Step ${i + 1} artifact generated successfully.`
        }));
        
        setWorkflowSteps(newSteps);
        setActiveView('dashboard');
        addLog(`Template deployed: ${template.title}. System ready.`, 'success');
        setWorkflowStatus('idle');
    };

    const startWorkflow = () => {
        setWorkflowStatus('initializing');
        setLogs([]);
        setArtifacts([]);
        setCurrentStepIndex(0);
        
        addLog(`Initializing ${activeWorkflowName} protocol...`);
        setTimeout(() => {
            addLog("Checking MCP Server connection...", 'warn');
            setTimeout(() => {
                addLog("Context loaded. Allocating resources.", 'success');
                setWorkflowStatus('running');
            }, 1000);
        }, 800);
    };

    // Workflow Engine
    useEffect(() => {
        if (workflowStatus !== 'running') return;

        if (currentStepIndex >= workflowSteps.length) {
            setWorkflowStatus('completed');
            addLog("WORKFLOW COMPLETE. All tasks finished successfully.", 'success');
            return;
        }

        const step = workflowSteps[currentStepIndex];
        
        // 1. Log Start
        addLog(`Starting Step ${step.id}: ${step.action}...`);
        addLog(`> Tool: ${step.tool}`, 'warn');

        const timer = setTimeout(() => {
            // 2. Log Result & Artifact
            addLog(`>> ${step.outputDescription}`, 'success');
            
            // Add artifact occasionally
            if (Math.random() > 0.5 || currentStepIndex === workflowSteps.length - 1) {
                const artifactName = `${activeWorkflowName.replace(/\s/g, '_')}_Part_${currentStepIndex + 1}.${Math.random() > 0.5 ? 'json' : 'txt'}`;
                setArtifacts(prev => [...prev, { name: artifactName, type: 'data' }]);
                addLog(`[ARTIFACT] Generated: ${artifactName}`, 'success');
            }
            
            setCurrentStepIndex(prev => prev + 1);
        }, step.duration);

        return () => clearTimeout(timer);
    }, [workflowStatus, currentStepIndex, workflowSteps]);

    const handleConnectService = (service: string) => {
        setConnectedServices(prev => [...prev, service]);
        addLog(`Integration added: ${service}`, 'success');
    };

    const handleDownloadArtifacts = () => {
        const content = `
AGENCY REPORT: ${agent.name} - ${activeWorkflowName}
DATE: ${new Date().toLocaleDateString()}
------------------------------------------------
EXECUTION LOGS:
${logs.map(l => l.replace(/<[^>]*>/g, '')).reverse().join('\n')}

GENERATED ARTIFACTS SUMMARY:
${artifacts.map(a => `- ${a.name}`).join('\n')}
        `;
        const blob = new Blob([content], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${activeWorkflowName.replace(/\s+/g, '_')}_Full_Report.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const NavButton: React.FC<{ view: View, icon: any, label: string }> = ({ view, icon, label }) => (
        <button
            onClick={() => setActiveView(view)}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${
                activeView === view 
                ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/20 font-bold' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span className="text-sm">{label}</span>
        </button>
    );

    return (
        <div className="flex flex-col h-screen max-h-[900px] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 shadow-2xl">
            <IntegrationsModal 
                isOpen={isIntegrationModalOpen} 
                onClose={() => setIsIntegrationModalOpen(false)}
                onConnect={handleConnectService}
                connectedServices={connectedServices}
            />

            {/* Top Bar */}
            <div className="bg-slate-900 p-4 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center text-white font-bold border-2 border-white shadow-lg shadow-purple-500/30">
                        {agent.name.charAt(0)}
                    </div>
                    <div>
                        <h2 className="text-white font-bold text-lg leading-none">{agent.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{agent.role} | ONLINE</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    {workflowStatus === 'completed' && (
                        <button onClick={handleDownloadArtifacts} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors shadow-lg shadow-green-900/20 animate-pop-in">
                            <DownloadIcon className="w-4 h-4" />
                            Download Results
                        </button>
                    )}
                    <button onClick={onLogout} className="bg-red-500/10 text-red-400 px-3 py-2 rounded hover:bg-red-500/20 transition-colors" title="Logout">
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar */}
                <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col shrink-0">
                    <div className="space-y-2">
                        <NavButton view="dashboard" icon={<RobotIcon className="w-5 h-5" />} label="Workstation Dashboard" />
                        <NavButton view="mcp" icon={<CubeIcon className="w-5 h-5" />} label="MCP Server" />
                        <NavButton view="bigdata" icon={<TableCellsIcon className="w-5 h-5" />} label="Big Data Studio" />
                        <NavButton view="autopilot" icon={<PlayIcon className="w-5 h-5" />} label="Auto-Pilot Library" />
                        <NavButton view="knowledge" icon={<DatabaseIcon className="w-5 h-5" />} label="Knowledge Base" />
                        <NavButton view="settings" icon={<CogIcon className="w-5 h-5" />} label="Agent Settings" />
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800">
                        <h3 className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-widest">Active Integrations</h3>
                        <div className="space-y-2 mb-4 max-h-32 overflow-y-auto">
                            {connectedServices.length === 0 && <p className="text-xs text-slate-600 italic">No tools connected.</p>}
                            {connectedServices.map(s => (
                                <div key={s} className="flex items-center gap-2 text-xs text-green-400 bg-green-900/10 px-2 py-1.5 rounded border border-green-900/30">
                                    <LinkIcon className="w-3 h-3" /> {s}
                                </div>
                            ))}
                        </div>
                        <button 
                            onClick={() => setIsIntegrationModalOpen(true)}
                            className="w-full text-xs bg-slate-800 text-slate-300 px-2 py-2 rounded hover:bg-slate-700 border border-slate-600 flex items-center justify-center gap-1 transition-colors"
                        >
                            <PlusIcon className="w-3 h-3" /> Add Connection
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex-grow bg-slate-950 relative overflow-hidden flex flex-col">
                    {activeView === 'dashboard' && (
                        <div className="flex flex-col h-full">
                            {/* Workspace Area */}
                            <div className="flex-grow p-6 flex flex-col relative overflow-hidden">
                                <div className="absolute inset-0 bg-grid-white/[0.02] pointer-events-none"></div>
                                
                                {workflowStatus === 'idle' ? (
                                    <div className="flex flex-col items-center justify-center h-full text-center max-w-md mx-auto z-10 animate-fade-in-up">
                                        <div className="w-24 h-24 bg-purple-900/20 rounded-full flex items-center justify-center mb-6 border border-purple-500/50 shadow-[0_0_30px_rgba(147,51,234,0.2)]">
                                            <PlayIcon className="w-10 h-10 text-purple-400" />
                                        </div>
                                        <h1 className="text-2xl font-bold text-white mb-2">{activeWorkflowName}</h1>
                                        <p className="text-slate-400 mb-8 text-sm">Workflow configured and ready. Initialize autonomous execution sequence to begin processing.</p>
                                        
                                        <button 
                                            onClick={startWorkflow}
                                            className="group relative inline-flex items-center justify-center px-8 py-3 font-bold text-white transition-all duration-200 bg-purple-600 rounded-lg hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/40 hover:-translate-y-1"
                                        >
                                            <PlayIcon className="w-5 h-5 mr-2" />
                                            Initialize Automation
                                        </button>
                                    </div>
                                ) : (
                                    <div className="w-full max-w-4xl mx-auto z-10 h-full flex flex-col">
                                        <div className="flex justify-between items-end mb-6">
                                            <h3 className="text-xl font-bold text-white flex items-center gap-3">
                                                {workflowStatus === 'running' || workflowStatus === 'initializing' ? (
                                                    <span className="relative flex h-3 w-3">
                                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                      <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                                    </span>
                                                ) : (
                                                    <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                                                )}
                                                {workflowStatus === 'initializing' ? 'Booting System...' : workflowStatus === 'running' ? 'Executing Workflow...' : 'Task Complete'}
                                            </h3>
                                            <span className="text-slate-500 font-mono text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">SESSION ID: {Date.now().toString().slice(-6)}</span>
                                        </div>

                                        <div className="flex flex-grow gap-6 overflow-hidden">
                                            {/* Steps Visualization */}
                                            <div className="w-2/3 bg-slate-900/50 rounded-xl border border-slate-800 p-4 overflow-y-auto">
                                                <div className="space-y-3">
                                                    {workflowSteps.map((step, index) => {
                                                        let statusClass = 'border-slate-800 bg-slate-900/30 text-slate-600'; // pending
                                                        let icon = <div className="w-6 h-6 rounded-full border-2 border-slate-700 flex items-center justify-center text-xs font-mono">{index + 1}</div>;

                                                        if (index < currentStepIndex || workflowStatus === 'completed') {
                                                            statusClass = 'border-green-900/50 bg-green-900/10 text-green-400'; // completed
                                                            icon = <CheckCircleIcon className="w-6 h-6 text-green-500" />;
                                                        } else if (index === currentStepIndex && workflowStatus === 'running') {
                                                            statusClass = 'border-blue-900/50 bg-blue-900/10 text-blue-400 border-l-4 border-l-blue-500'; // active
                                                            icon = <div className="w-6 h-6 rounded-full border-2 border-blue-500 flex items-center justify-center text-xs font-bold text-blue-400 animate-pulse">{index + 1}</div>;
                                                        }

                                                        return (
                                                            <div key={step.id} className={`p-3 rounded-lg border transition-all duration-500 flex items-center gap-4 ${statusClass}`}>
                                                                {icon}
                                                                <div className="flex-grow">
                                                                    <div className="flex justify-between items-center">
                                                                        <h4 className="font-bold text-sm">{step.action}</h4>
                                                                        <span className="text-[10px] uppercase tracking-wider opacity-70">{step.tool}</span>
                                                                    </div>
                                                                    {index < currentStepIndex && <p className="text-xs opacity-70 mt-1">{step.outputDescription}</p>}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>

                                            {/* Logs Panel */}
                                            <div className="w-1/3 bg-black rounded-xl border border-slate-800 flex flex-col overflow-hidden">
                                                <div className="bg-slate-900 p-2 border-b border-slate-800 flex justify-between items-center">
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-2">System Logs</span>
                                                    <span className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                                                </div>
                                                <div 
                                                    ref={logContainerRef}
                                                    className="flex-grow p-4 font-mono text-xs overflow-y-auto space-y-1"
                                                >
                                                    {logs.map((log, i) => (
                                                        <div key={i} dangerouslySetInnerHTML={{__html: log}} />
                                                    ))}
                                                    <div className="animate-pulse text-green-500">_</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeView === 'mcp' && <MCPServer />}
                    {activeView === 'bigdata' && <BigDataTool />}
                    {activeView === 'autopilot' && <AutoPilot onDeploy={handleDeployTemplate} />}
                    {activeView === 'knowledge' && <KnowledgeBase />}
                    {activeView === 'settings' && <AgentSettings />}
                </div>
            </div>
        </div>
    );
};

export default AgentWorkstation;