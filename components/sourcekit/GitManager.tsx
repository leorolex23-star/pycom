
import React, { useState, useEffect } from 'react';
import type { GitFile, GitRepo, GitCommit } from '../../types.ts';
import { GitBranchIcon, CloudArrowDownIcon, CheckCircleIcon, ClockIcon, DocumentTextIcon } from '../Icons.tsx';

const GitManager: React.FC = () => {
    const [repoUrl, setRepoUrl] = useState('');
    const [repo, setRepo] = useState<GitRepo | null>(null);
    const [activeFileIndex, setActiveFileIndex] = useState<number | null>(null);
    const [fileContent, setFileContent] = useState('');
    const [commitMessage, setCommitMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Mock files for simulation
    const mockFiles: GitFile[] = [
        { name: 'main.py', content: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()', originalContent: 'def main():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    main()', status: 'unmodified' },
        { name: 'utils.py', content: 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b', originalContent: 'def add(a, b):\n    return a + b\n\ndef subtract(a, b):\n    return a - b', status: 'unmodified' },
        { name: 'README.md', content: '# PyCom Project\nThis is a simulated repository for learning Git.', originalContent: '# PyCom Project\nThis is a simulated repository for learning Git.', status: 'unmodified' }
    ];

    const handleClone = (e: React.FormEvent) => {
        e.preventDefault();
        if (!repoUrl.trim()) return;
        
        setIsLoading(true);
        
        // Simulate network delay
        setTimeout(() => {
            const newRepo: GitRepo = {
                url: repoUrl,
                name: repoUrl.split('/').pop() || 'project',
                files: JSON.parse(JSON.stringify(mockFiles)), // Deep copy
                commits: [],
                branch: 'main'
            };
            setRepo(newRepo);
            setActiveFileIndex(0);
            setFileContent(newRepo.files[0].content);
            setIsLoading(false);
        }, 1500);
    };

    const handleFileSelect = (index: number) => {
        setActiveFileIndex(index);
        if (repo) {
            setFileContent(repo.files[index].content);
        }
    };

    const handleContentChange = (newContent: string) => {
        setFileContent(newContent);
        if (repo && activeFileIndex !== null) {
            const updatedFiles = [...repo.files];
            updatedFiles[activeFileIndex].content = newContent;
            
            // Check status
            if (newContent !== updatedFiles[activeFileIndex].originalContent) {
                updatedFiles[activeFileIndex].status = 'modified';
            } else {
                updatedFiles[activeFileIndex].status = 'unmodified';
            }
            
            setRepo({ ...repo, files: updatedFiles });
        }
    };

    const handleCommit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!repo || !commitMessage.trim()) return;

        const modifiedFiles = repo.files.filter(f => f.status === 'modified');
        if (modifiedFiles.length === 0) {
            alert("No changes to commit!");
            return;
        }

        const newCommit: GitCommit = {
            id: Math.random().toString(36).substring(2, 9), // Mock SHA
            message: commitMessage,
            timestamp: Date.now(),
            author: 'User',
            changes: modifiedFiles.map(f => f.name)
        };

        // Update files: set originalContent to current content, reset status
        const updatedFiles = repo.files.map(f => ({
            ...f,
            originalContent: f.content,
            status: 'unmodified' as const
        }));

        setRepo({
            ...repo,
            files: updatedFiles,
            commits: [newCommit, ...repo.commits]
        });
        setCommitMessage('');
    };

    // Simple syntax highlighting helper (reused concept)
    const highlightCode = (code: string) => {
        // Very basic Python highlighting for display
        let highlighted = code
            .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/(def|class|import|from|return|if|else|print)/g, '<span class="text-purple-400 font-bold">$1</span>')
            .replace(/(".*?"|'.*?')/g, '<span class="text-green-400">$1</span>')
            .replace(/(#.*)/g, '<span class="text-gray-500 italic">$1</span>');
        return { __html: highlighted };
    };

    if (!repo) {
        return (
            <div className="flex items-center justify-center h-96 bg-gray-900/50 rounded-xl border border-purple-500/30">
                <form onSubmit={handleClone} className="w-full max-w-md p-8 bg-gray-800 rounded-xl border border-gray-700 shadow-2xl">
                    <div className="text-center mb-6">
                        <div className="mx-auto bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                            <CloudArrowDownIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Clone Repository</h3>
                        <p className="text-gray-400 text-sm">Enter a URL to simulate cloning a project.</p>
                    </div>
                    <div className="space-y-4">
                        <input 
                            type="text" 
                            value={repoUrl}
                            onChange={(e) => setRepoUrl(e.target.value)}
                            placeholder="https://github.com/username/repo"
                            className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-purple-500 focus:outline-none"
                            required
                        />
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2"
                        >
                            {isLoading ? <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span> : 'Clone'}
                        </button>
                    </div>
                </form>
            </div>
        );
    }

    const modifiedCount = repo.files.filter(f => f.status === 'modified').length;

    return (
        <div className="h-[calc(100vh-200px)] flex flex-col bg-gray-900 rounded-xl border border-gray-700 overflow-hidden">
            {/* Header */}
            <div className="bg-gray-800 p-4 border-b border-gray-700 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <h2 className="font-bold text-white text-lg">{repo.name}</h2>
                    <span className="flex items-center gap-1 text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full font-mono">
                        <GitBranchIcon className="w-3 h-3" /> {repo.branch}
                    </span>
                </div>
                <button onClick={() => setRepo(null)} className="text-red-400 text-sm hover:underline">Close Repo</button>
            </div>

            <div className="flex-grow flex flex-col lg:flex-row overflow-hidden">
                {/* File Explorer */}
                <div className="w-full lg:w-64 bg-gray-800/50 border-r border-gray-700 flex flex-col">
                    <div className="p-3 font-bold text-gray-400 text-xs uppercase tracking-wider">Explorer</div>
                    <div className="flex-grow overflow-y-auto">
                        {repo.files.map((file, index) => (
                            <button
                                key={file.name}
                                onClick={() => handleFileSelect(index)}
                                className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between transition-colors ${activeFileIndex === index ? 'bg-purple-600/20 text-purple-300 border-l-2 border-purple-500' : 'text-gray-300 hover:bg-gray-700'}`}
                            >
                                <div className="flex items-center gap-2">
                                    <DocumentTextIcon className="w-4 h-4" />
                                    {file.name}
                                </div>
                                {file.status === 'modified' && <span className="text-yellow-400 font-bold text-xs">M</span>}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor */}
                <div className="flex-grow flex flex-col bg-gray-900 min-w-0">
                    <div className="bg-gray-800/30 p-2 text-xs text-gray-500 border-b border-gray-700 flex justify-between">
                        <span>{activeFileIndex !== null ? repo.files[activeFileIndex].name : 'No file selected'}</span>
                        <span>Python</span>
                    </div>
                    {activeFileIndex !== null ? (
                        <textarea 
                            value={fileContent}
                            onChange={(e) => handleContentChange(e.target.value)}
                            className="flex-grow bg-gray-900 p-4 font-mono text-sm text-gray-200 focus:outline-none resize-none"
                            spellCheck={false}
                        />
                    ) : (
                        <div className="flex-grow flex items-center justify-center text-gray-600">Select a file to edit</div>
                    )}
                </div>

                {/* Git Controls */}
                <div className="w-full lg:w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
                    
                    {/* Staging Area */}
                    <div className="flex-grow p-4 overflow-y-auto border-b border-gray-700">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <GitBranchIcon className="w-5 h-5 text-yellow-400" />
                            Source Control
                        </h3>
                        
                        {modifiedCount > 0 ? (
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-400 mb-2 uppercase font-bold">Changes ({modifiedCount})</p>
                                    <ul className="space-y-1">
                                        {repo.files.filter(f => f.status === 'modified').map(f => (
                                            <li key={f.name} className="text-sm text-yellow-300 flex items-center gap-2">
                                                <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                                                {f.name}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                                <form onSubmit={handleCommit} className="space-y-2">
                                    <textarea 
                                        placeholder="Message (e.g., Fix bug in main.py)"
                                        value={commitMessage}
                                        onChange={(e) => setCommitMessage(e.target.value)}
                                        className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-sm text-white focus:ring-1 focus:ring-purple-500 focus:outline-none h-20 resize-none"
                                    />
                                    <button className="w-full bg-green-600 hover:bg-green-700 text-white text-sm font-bold py-2 rounded transition-colors flex items-center justify-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4" />
                                        Commit
                                    </button>
                                </form>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 italic text-center mt-10">No changes detected.</p>
                        )}
                    </div>

                    {/* History */}
                    <div className="h-1/3 bg-gray-900 p-4 overflow-y-auto border-t border-gray-700">
                        <h4 className="font-bold text-gray-400 text-xs uppercase mb-3 flex items-center gap-2">
                            <ClockIcon className="w-3 h-3" /> History
                        </h4>
                        <div className="space-y-3">
                            {repo.commits.length === 0 && <p className="text-xs text-gray-600">No commits yet.</p>}
                            {repo.commits.map(commit => (
                                <div key={commit.id} className="border-l-2 border-purple-500 pl-3 py-1">
                                    <p className="text-white text-sm font-semibold truncate">{commit.message}</p>
                                    <div className="flex justify-between text-[10px] text-gray-500 mt-1">
                                        <span>{commit.id}</span>
                                        <span>{new Date(commit.timestamp).toLocaleTimeString()}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GitManager;
