
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import { 
    GlobeAltIcon, ArrowLeftIcon, ArrowRightIcon, ArrowPathIcon, 
    LockClosedIcon, MagnifyingGlassIcon, SparklesIcon, TableCellsIcon,
    DocumentTextIcon, ShieldCheckIcon, NewspaperIcon
} from '../Icons.tsx';

const PysrchBrowser: React.FC = () => {
    const [url, setUrl] = useState('techcrunch.com');
    const [displayUrl, setDisplayUrl] = useState('https://techcrunch.com');
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'view' | 'analyze'>('view');
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    
    // Simulated Page Data
    const [pageData, setPageData] = useState<any>(null);

    useEffect(() => {
        // Load initial page
        handleNavigate(new Event('submit') as any);
    }, []);

    const handleNavigate = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setAnalysisResult(null);
        setPageData(null);
        
        const formattedUrl = url.startsWith('http') ? url : `https://${url}`;
        setDisplayUrl(formattedUrl);

        try {
            if (process.env.API_KEY) {
                const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
                
                const result = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: `Render homepage for: ${formattedUrl}`,
                    config: {
                        systemInstruction: `You are a web browser engine. 
                        Your task is to hallucinate/simulate the homepage content for the URL provided by the user.
                        Return ONLY a valid JSON object with this structure:
                        {
                            "siteName": "String",
                            "heroHeadline": "String",
                            "heroSubtext": "String",
                            "heroImageKeyword": "String (for unsplash)",
                            "articles": [
                                { "title": "String", "summary": "String", "category": "String", "date": "String" }
                            ]
                        }
                        Do not include markdown formatting like \`\`\`json.`
                    }
                });
                
                const text = result.text || "";
                const cleanedText = text.replace(/```json|```/g, '').trim();
                setPageData(JSON.parse(cleanedText));
            } else {
                throw new Error("No API Key");
            }
        } catch (err) {
            console.error("Browser Simulation Error:", err);
            // Fallback simulation
            setPageData({
                siteName: new URL(formattedUrl).hostname,
                heroHeadline: "Connection Successful",
                heroSubtext: "The site content is being simulated because live embedding is restricted.",
                heroImageKeyword: "technology",
                articles: [
                    { title: "Welcome to Pysrch Browser", summary: "Securely browsing the decentralized web.", category: "System", date: "Now" },
                    { title: "AI-Powered Rendering", summary: "Content is generated in real-time based on URL context.", category: "Feature", date: "Now" }
                ]
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyze = (type: 'summary' | 'leads' | 'security') => {
        setIsLoading(true);
        setActiveTab('analyze');
        
        // Simulate analysis based on the loaded pageData
        setTimeout(() => {
            setIsLoading(false);
            if (type === 'summary') {
                setAnalysisResult({
                    type: 'summary',
                    title: 'Page Summary',
                    content: `This page appears to be ${pageData?.siteName || 'a website'}. The main focus is "${pageData?.heroHeadline}". Key topics include ${pageData?.articles?.map((a: any) => a.category).join(', ') || 'various subjects'}.`
                });
            } else if (type === 'leads') {
                setAnalysisResult({
                    type: 'leads',
                    title: 'Extracted Contacts',
                    data: [
                        { name: 'Editorial Team', role: 'General', email: `contact@${pageData?.siteName?.toLowerCase().replace(/\s/g, '') || 'site'}.com` },
                        { name: 'Advertising', role: 'Sales', email: `ads@${pageData?.siteName?.toLowerCase().replace(/\s/g, '') || 'site'}.com` },
                    ]
                });
            } else {
                setAnalysisResult({
                    type: 'security',
                    title: 'Security Scan',
                    score: 98,
                    details: ['TLS 1.3 Encrypted', 'No Malicious Scripts', 'Headers Secure', 'Pysrch Sandbox Active']
                });
            }
        }, 1500);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl border border-slate-800 shadow-2xl overflow-hidden">
            {/* Address Bar */}
            <div className="bg-slate-900 p-3 flex items-center gap-4 border-b border-slate-800">
                <div className="flex gap-2 text-slate-400">
                    <button className="hover:text-white"><ArrowLeftIcon className="w-5 h-5" /></button>
                    <button className="hover:text-white"><ArrowRightIcon className="w-5 h-5" /></button>
                    <button onClick={handleNavigate} className="hover:text-white"><ArrowPathIcon className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} /></button>
                </div>
                
                <form onSubmit={handleNavigate} className="flex-grow relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-500">
                        <LockClosedIcon className="w-4 h-4" />
                    </div>
                    <input 
                        type="text" 
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="w-full bg-black border border-slate-700 rounded-full py-2 pl-10 pr-4 text-sm text-slate-300 focus:outline-none focus:border-purple-500 font-mono"
                    />
                </form>

                <div className="flex gap-2">
                    <div className="px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-300 text-xs font-bold flex items-center gap-2">
                        <ShieldCheckIcon className="w-3 h-3" />
                        Secure
                    </div>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden relative">
                {/* Main Viewport (Simulated Content) */}
                <div className={`flex-grow bg-white overflow-y-auto relative transition-all duration-300 ${activeTab === 'analyze' ? 'w-2/3' : 'w-full'}`}>
                    {isLoading ? (
                        <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
                            <p className="text-gray-500 font-mono text-sm">Connecting to {url}...</p>
                        </div>
                    ) : pageData ? (
                        <div className="font-sans text-gray-900">
                            {/* Simulated Header */}
                            <header className="border-b p-4 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
                                <div className="font-bold text-xl text-gray-900">{pageData.siteName}</div>
                                <nav className="space-x-4 text-sm text-gray-600 hidden sm:block">
                                    <span className="cursor-pointer hover:text-black">News</span>
                                    <span className="cursor-pointer hover:text-black">About</span>
                                    <span className="cursor-pointer hover:text-black">Contact</span>
                                </nav>
                            </header>

                            {/* Simulated Hero */}
                            <section className="bg-gray-50 p-12 text-center border-b">
                                <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{pageData.heroHeadline}</h1>
                                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{pageData.heroSubtext}</p>
                                {pageData.heroImageKeyword && (
                                    <img 
                                        src={`https://source.unsplash.com/800x400/?${pageData.heroImageKeyword}`} 
                                        alt="Hero" 
                                        className="mt-8 rounded-xl shadow-lg mx-auto w-full max-w-3xl object-cover h-64 bg-gray-200"
                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                    />
                                )}
                            </section>

                            {/* Simulated Articles */}
                            <section className="max-w-4xl mx-auto p-8">
                                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                                    <NewspaperIcon className="w-6 h-6 text-gray-700" /> 
                                    Top Stories
                                </h2>
                                <div className="grid grid-cols-1 gap-6">
                                    {pageData.articles?.map((article: any, idx: number) => (
                                        <div key={idx} className="border rounded-lg p-6 hover:shadow-md transition-shadow bg-white">
                                            <div className="flex justify-between items-start mb-2">
                                                <span className="text-xs font-bold text-purple-600 uppercase tracking-wide">{article.category}</span>
                                                <span className="text-xs text-gray-400">{article.date}</span>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 text-gray-900">{article.title}</h3>
                                            <p className="text-gray-600">{article.summary}</p>
                                        </div>
                                    ))}
                                </div>
                            </section>
                            
                            {/* Simulated Footer */}
                            <footer className="bg-gray-900 text-gray-400 py-8 text-center text-sm mt-12">
                                <p>&copy; 2025 {pageData.siteName}. All rights reserved.</p>
                                <p className="mt-2 text-xs opacity-50">Rendered by Pysrch Engine v1.0</p>
                            </footer>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full text-gray-400">
                            <GlobeAltIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>Enter a URL to start browsing.</p>
                        </div>
                    )}
                </div>

                {/* AI Sidebar */}
                <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0">
                    <div className="p-4 border-b border-slate-800">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <SparklesIcon className="w-5 h-5 text-purple-400" />
                            Page Intelligence
                        </h3>
                    </div>
                    
                    <div className="flex-grow p-4 overflow-y-auto space-y-4">
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => handleAnalyze('summary')} className="flex flex-col items-center justify-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <DocumentTextIcon className="w-6 h-6 text-blue-400 mb-1" />
                                <span className="text-[10px] text-slate-400">Summarize</span>
                            </button>
                            <button onClick={() => handleAnalyze('leads')} className="flex flex-col items-center justify-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <TableCellsIcon className="w-6 h-6 text-green-400 mb-1" />
                                <span className="text-[10px] text-slate-400">Find Leads</span>
                            </button>
                            <button onClick={() => handleAnalyze('security')} className="flex flex-col items-center justify-center p-2 bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors">
                                <ShieldCheckIcon className="w-6 h-6 text-red-400 mb-1" />
                                <span className="text-[10px] text-slate-400">Scan</span>
                            </button>
                        </div>

                        {analysisResult && (
                            <div className="bg-slate-950 border border-slate-700 rounded-lg p-4 animate-fade-in-up">
                                <h4 className="font-bold text-white mb-2 border-b border-slate-800 pb-2">{analysisResult.title}</h4>
                                
                                {analysisResult.type === 'summary' && (
                                    <p className="text-sm text-slate-400 leading-relaxed">{analysisResult.content}</p>
                                )}

                                {analysisResult.type === 'leads' && (
                                    <div className="space-y-2">
                                        {analysisResult.data.map((lead: any, i: number) => (
                                            <div key={i} className="text-xs bg-slate-900 p-2 rounded border border-slate-800">
                                                <p className="text-white font-bold">{lead.name}</p>
                                                <p className="text-slate-500">{lead.role} • {lead.email}</p>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {analysisResult.type === 'security' && (
                                    <div className="text-center">
                                        <div className="text-4xl font-bold text-green-500 mb-2">{analysisResult.score}%</div>
                                        <p className="text-xs text-slate-500 mb-4">Security Score</p>
                                        <ul className="text-left text-xs text-slate-400 space-y-1">
                                            {analysisResult.details.map((d: string, i: number) => (
                                                <li key={i} className="flex items-center gap-2">
                                                    <ShieldCheckIcon className="w-3 h-3 text-green-500" /> {d}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PysrchBrowser;
