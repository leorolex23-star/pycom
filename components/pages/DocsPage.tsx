

import React, { useState } from 'react';
import { BookOpenIcon, ShieldCheckIcon, ServerStackIcon, BoltIcon, UserGroupIcon, LifebuoyIcon, CubeIcon, BanknotesIcon } from '../Icons.tsx';

type DocSection = 'help' | 'platform' | 'user' | 'self-hosting' | 'mcp' | 'server';

const DocsPage: React.FC = () => {
    const [activeSection, setActiveSection] = useState<DocSection>('help');

    const SidebarItem: React.FC<{ id: DocSection, label: string, icon: any }> = ({ id, label, icon }) => (
        <button
            onClick={() => setActiveSection(id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                activeSection === id ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
        >
            {icon}
            <span className="font-semibold text-sm">{label}</span>
        </button>
    );

    const renderContent = () => {
        switch (activeSection) {
            case 'help':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">Help Center & Support</h1>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-bold text-purple-400 mb-3">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                <details className="group">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-200">
                                        <span>How do I reset my password?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-slate-400 mt-3 group-open:animate-fadeIn">
                                        Currently, as this is a demo platform, simulated accounts do not require password resets. For the live version, visit your Profile Settings.
                                    </p>
                                </details>
                                <details className="group">
                                    <summary className="flex justify-between items-center font-medium cursor-pointer list-none text-slate-200">
                                        <span>Is PyCom free to use?</span>
                                        <span className="transition group-open:rotate-180">
                                            <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path></svg>
                                        </span>
                                    </summary>
                                    <p className="text-slate-400 mt-3 group-open:animate-fadeIn">
                                        Yes! The core platform, including Gamezone and basic AI Lab features, is free. Advanced hosting and B2B features require a subscription.
                                    </p>
                                </details>
                            </div>
                        </div>
                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h2 className="text-xl font-bold text-purple-400 mb-3">Contact Support</h2>
                            <p className="text-slate-300 mb-2">Need help with your account or found a bug?</p>
                            <p className="text-slate-400">Email: <a href="mailto:support@pycom.io" className="text-blue-400 hover:underline">support@pycom.io</a></p>
                            <p className="text-slate-400">Discord: <a href="#" className="text-blue-400 hover:underline">Join our Community</a></p>
                        </div>
                    </div>
                );
            case 'platform':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">Platform Guide</h1>
                        <p className="text-slate-400 text-lg">PyCom is an all-encompassing ecosystem for Python developers.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-2">Gamezone</h3>
                                <p className="text-slate-400 text-sm">
                                    Gamified learning modules covering everything from syntax (Indentation Invaders) to AI concepts (Hugging Face Quest).
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-2">AI Lab</h3>
                                <p className="text-slate-400 text-sm">
                                    A suite of generative AI tools powered by Gemini. Create images, videos, and audio, or chat with our AI Tutor.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-2">SourceKit</h3>
                                <p className="text-slate-400 text-sm">
                                    Developer resources, snippet library, and a simulated Git environment to practice version control.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-xl font-bold text-white mb-2">Agentic AI</h3>
                                <p className="text-slate-400 text-sm">
                                    Automate business workflows with role-specific AI agents (Sales, SEO, Marketing) capable of tool use.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'user':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">User Guide</h1>
                        
                        <div className="prose prose-invert max-w-none">
                            <h3>Getting Started</h3>
                            <ol>
                                <li><strong>Sign Up:</strong> Use your Google account or email to create a profile.</li>
                                <li><strong>Choose a Path:</strong> Select a Career Path from the home page to get a tailored roadmap.</li>
                                <li><strong>Start Learning:</strong> Navigate to the Gamezone or Courses section.</li>
                            </ol>

                            <h3>Gamification & Rewards</h3>
                            <p>
                                You earn XP for every game completed, code snippet saved, and course module finished. 
                                High scores unlock new difficulty levels and exclusive profile badges.
                            </p>

                            <h3>Managing Your Profile</h3>
                            <p>
                                Your profile stores your progress, saved snippets, and certificates. 
                                Navigate to the dashboard to view your stats and download your achievements.
                            </p>
                        </div>
                    </div>
                );
            case 'self-hosting':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">Self-Hosting Guide</h1>
                        <p className="text-slate-400">
                            PyCom supports robust self-hosting capabilities, allowing you to run your own AI infrastructure and deployment pipelines.
                        </p>

                        <div className="bg-black p-4 rounded-lg font-mono text-sm text-green-400 border border-slate-700 overflow-x-auto">
                            <p className="text-slate-500 mb-2"># 1. Pull the PyCom Docker Image</p>
                            <p>docker pull pycom/server:latest</p>
                            <br/>
                            <p className="text-slate-500 mb-2"># 2. Run the container</p>
                            <p>docker run -d -p 3000:3000 -e API_KEY="your_key" pycom/server</p>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-3">Host & Build Features</h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li><strong>Deployment Manager:</strong> Connect your Git repository to automatically build and deploy your Python apps.</li>
                                <li><strong>Visual Automator:</strong> Build n8n-style workflows to connect webhooks, scripts, and AI agents.</li>
                                <li><strong>Server Control:</strong> Manage local Docker instances or remote VPS resources directly from the UI.</li>
                            </ul>
                        </div>

                        <div className="bg-gradient-to-r from-green-900/30 to-slate-900 p-6 rounded-xl border border-green-500/30">
                            <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                                <BanknotesIcon className="w-6 h-6 text-green-400" />
                                Cost-Efficiency with Open Source
                            </h3>
                            <p className="text-slate-300 mb-4">
                                Reduce cloud costs by deploying free, open-source vector stores directly on your PyCom Server instead of using managed paid services.
                            </p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-black/40 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-white mb-1">Milvus / Qdrant</h4>
                                    <p className="text-xs text-slate-400">
                                        Production-grade vector databases. Free to self-host via Docker. Ideal for RAG applications requiring persistence.
                                    </p>
                                </div>
                                <div className="bg-black/40 p-4 rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-white mb-1">FAISS</h4>
                                    <p className="text-xs text-slate-400">
                                        Lightweight library for efficient similarity search. Runs locally in memory. Perfect for smaller datasets and lower latency.
                                    </p>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 mt-4">
                                You can deploy these services instantly via the <span className="font-mono text-purple-300">Host & Build &gt; Server Control</span> panel.
                            </p>
                        </div>
                    </div>
                );
            case 'mcp':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">MCP Guide (Model Context Protocol)</h1>
                        <p className="text-slate-400">
                            The Model Context Protocol (MCP) is our standard for connecting AI models to external tools and data sources.
                        </p>

                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-3">Defining Tools</h3>
                            <p className="text-slate-400 mb-4">
                                Tools are JSON definitions that tell the AI what functions it can call.
                            </p>
                            <div className="bg-black p-4 rounded-lg font-mono text-xs text-blue-300 border border-slate-700">
{`{
  "name": "get_stock_price",
  "description": "Retrieves the current stock price for a given symbol.",
  "parameters": {
    "type": "object",
    "properties": {
      "symbol": { "type": "string", "description": "The stock ticker (e.g., AAPL)" }
    },
    "required": ["symbol"]
  }
}`}
                            </div>
                        </div>

                        <div className="bg-slate-900 p-6 rounded-xl border border-slate-800">
                            <h3 className="text-xl font-bold text-white mb-3">Security Best Practices</h3>
                            <ul className="list-disc list-inside space-y-2 text-slate-400">
                                <li><strong>API Keys:</strong> Rotate your MCP Master Key regularly via the Server Control Panel.</li>
                                <li><strong>IP Whitelisting:</strong> Restrict access to your MCP server to known IP addresses.</li>
                                <li><strong>TLS/SSL:</strong> Always enable TLS encryption for production environments.</li>
                            </ul>
                        </div>
                    </div>
                );
            case 'server':
                return (
                    <div className="space-y-6 animate-fade-in-up">
                        <h1 className="text-3xl font-bold text-white mb-4">PyCom Server Infrastructure</h1>
                        <p className="text-slate-400">
                            Our internal cloud infrastructure is designed for high-performance AI workloads.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-white font-bold mb-2">Compute Nodes</h3>
                                <p className="text-slate-400 text-sm">
                                    Powered by NVIDIA A100 GPUs for rapid inference and model fine-tuning. Auto-scaling Kubernetes clusters ensure high availability.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-white font-bold mb-2">Storage</h3>
                                <p className="text-slate-400 text-sm">
                                    Distributed NVMe storage for dataset caching and vector databases (Pinecone/Milvus) for RAG applications.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-white font-bold mb-2">Networking</h3>
                                <p className="text-slate-400 text-sm">
                                    Global CDN with edge caching. Private VPC peering available for Enterprise clients for secure data transfer.
                                </p>
                            </div>
                            <div className="bg-slate-900 p-5 rounded-xl border border-slate-800">
                                <h3 className="text-white font-bold mb-2">Monitoring</h3>
                                <p className="text-slate-400 text-sm">
                                    Real-time Prometheus/Grafana dashboards monitoring latency, token usage, and error rates 24/7.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-[calc(100vh-100px)] flex bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-2xl animate-fade-in-up">
            {/* Sidebar */}
            <div className="w-64 bg-slate-900 border-r border-slate-800 p-4 flex flex-col shrink-0">
                <h2 className="text-white font-bold text-xl px-4 mb-6 flex items-center gap-2">
                    <BookOpenIcon className="w-6 h-6 text-purple-500" />
                    Docs Hub
                </h2>
                <div className="space-y-2 overflow-y-auto flex-grow">
                    <SidebarItem id="help" label="Help Guide" icon={<LifebuoyIcon className="w-5 h-5" />} />
                    <SidebarItem id="platform" label="Platform Guide" icon={<CubeIcon className="w-5 h-5" />} />
                    <SidebarItem id="user" label="User Guide" icon={<UserGroupIcon className="w-5 h-5" />} />
                    <div className="my-2 border-t border-slate-800"></div>
                    <p className="px-4 text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 mt-4">Technical</p>
                    <SidebarItem id="self-hosting" label="Self-Hosting" icon={<ServerStackIcon className="w-5 h-5" />} />
                    <SidebarItem id="mcp" label="MCP Guide" icon={<BoltIcon className="w-5 h-5" />} />
                    <SidebarItem id="server" label="PyCom Server" icon={<ShieldCheckIcon className="w-5 h-5" />} />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-grow p-8 overflow-y-auto bg-slate-950 relative">
                <div className="max-w-4xl mx-auto">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default DocsPage;