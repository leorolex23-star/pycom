
import React, { useState } from 'react';
import { KNOWLEDGE_DOCS } from '../../constants.ts';
import { DatabaseIcon, DocumentTextIcon, CloudArrowDownIcon, PlusIcon, CheckCircleIcon, ArrowPathIcon, ClockIcon, DownloadIcon, UploadIcon } from '../Icons.tsx';

const KnowledgeBase: React.FC = () => {
    const [docs, setDocs] = useState(KNOWLEDGE_DOCS);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const handleDownload = (docName: string) => {
        // Simulate download
        const dummyContent = `This is the simulated content for ${docName}.\n\nIn a real application, this would be the actual file content retrieved from the vector database or cloud storage.`;
        const blob = new Blob([dummyContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = docName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    const handleUpload = () => {
        setIsUploading(true);
        setUploadProgress(0);
        
        const interval = setInterval(() => {
            setUploadProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsUploading(false);
                        const newDoc = {
                            id: Date.now().toString(),
                            name: `Uploaded_Doc_${Math.floor(Math.random() * 1000)}.pdf`,
                            type: 'pdf' as const,
                            size: '1.2 MB',
                            status: 'indexed' as const
                        };
                        setDocs([newDoc, ...docs]);
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 200);
    };

    const getStatusBadge = (status: string) => {
        switch(status) {
            case 'indexed': return <span className="flex items-center gap-1 text-green-400 text-xs font-bold bg-green-900/30 px-2 py-1 rounded border border-green-500/20"><CheckCircleIcon className="w-3 h-3" /> Indexed</span>;
            case 'processing': return <span className="flex items-center gap-1 text-yellow-400 text-xs font-bold bg-yellow-900/30 px-2 py-1 rounded border border-yellow-500/20"><ArrowPathIcon className="w-3 h-3 animate-spin" /> Processing</span>;
            default: return <span className="flex items-center gap-1 text-slate-400 text-xs font-bold bg-slate-800 px-2 py-1 rounded border border-slate-700"><ClockIcon className="w-3 h-3" /> Pending</span>;
        }
    };

    return (
        <div className="h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <DatabaseIcon className="w-7 h-7 text-purple-500" />
                        Knowledge Base
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">RAG (Retrieval-Augmented Generation) Context Store</p>
                </div>
                <button 
                    onClick={handleUpload}
                    disabled={isUploading}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isUploading ? <ArrowPathIcon className="w-5 h-5 animate-spin" /> : <PlusIcon className="w-5 h-5" />}
                    {isUploading ? 'Uploading...' : 'Upload Document'}
                </button>
            </div>

            <div className="flex-grow p-6 overflow-y-auto relative">
                {isUploading && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
                        <div 
                            className="h-full bg-purple-500 transition-all duration-200 ease-linear" 
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                )}
                
                <div className="grid grid-cols-1 gap-4">
                    {docs.map(doc => (
                        <div key={doc.id} className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between hover:border-purple-500/50 transition-colors group">
                            <div className="flex items-center gap-4">
                                <div className="bg-slate-800 p-3 rounded-lg">
                                    <DocumentTextIcon className="w-6 h-6 text-blue-400" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-200 group-hover:text-white transition-colors">{doc.name}</h4>
                                    <p className="text-xs text-slate-500 uppercase font-mono mt-1">{doc.type} • {doc.size}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-6">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-widest">Vector Status</p>
                                    {getStatusBadge(doc.status)}
                                </div>
                                <button 
                                    onClick={() => handleDownload(doc.name)}
                                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-colors group-hover:bg-slate-800"
                                    title="Download"
                                >
                                    <DownloadIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            <div className="bg-slate-900 p-4 border-t border-slate-800 text-center text-xs text-slate-500 shrink-0 flex justify-between px-8">
                <span>Vector Store Usage: 45MB / 1GB</span>
                <span>Last Sync: Just now</span>
            </div>
        </div>
    );
};

export default KnowledgeBase;
