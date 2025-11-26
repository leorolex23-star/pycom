
import React, { useState } from 'react';
import { 
    TableCellsIcon, ChartPieIcon, CloudArrowUpIcon, 
    MagnifyingGlassIcon, SparklesIcon, PresentationChartLineIcon 
} from '../Icons.tsx';
import type { Dataset, BigDataQuery } from '../../types.ts';

const BigDataTool: React.FC = () => {
    const [datasets, setDatasets] = useState<Dataset[]>([
        { id: '1', name: 'Global Sales Q3', source: 'Snowflake', rows: 150420, columns: ['Region', 'Product', 'Revenue', 'Date'] },
        { id: '2', name: 'User Churn Prediction', source: 'CSV Upload', rows: 5400, columns: ['User_ID', 'Last_Login', 'Churn_Prob', 'Plan'] }
    ]);
    const [activeDataset, setActiveDataset] = useState<Dataset | null>(null);
    const [prompt, setPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [queryResult, setQueryResult] = useState<BigDataQuery | null>(null);

    const handleUpload = () => {
        // Simulate file upload
        setTimeout(() => {
            const newDs: Dataset = {
                id: Date.now().toString(),
                name: 'Marketing_Campaign_ROI.csv',
                source: 'Local Upload',
                rows: 12500,
                columns: ['Campaign', 'Spend', 'Conversions', 'Platform']
            };
            setDatasets([...datasets, newDs]);
        }, 1000);
    };

    const handleQuery = (e: React.FormEvent) => {
        e.preventDefault();
        if (!prompt.trim() || !activeDataset) return;

        setIsLoading(true);
        setQueryResult(null);

        // Simulate AI Processing (NL -> SQL -> Execution)
        setTimeout(() => {
            setQueryResult({
                id: Date.now().toString(),
                prompt,
                sql: `SELECT ${activeDataset.columns[0]}, SUM(${activeDataset.columns[2]}) FROM ${activeDataset.name} GROUP BY ${activeDataset.columns[0]} LIMIT 5;`,
                result: [
                    { [activeDataset.columns[0]]: 'North America', [activeDataset.columns[2]]: 45000 },
                    { [activeDataset.columns[0]]: 'Europe', [activeDataset.columns[2]]: 32000 },
                    { [activeDataset.columns[0]]: 'Asia Pacific', [activeDataset.columns[2]]: 28000 },
                    { [activeDataset.columns[0]]: 'Latin America', [activeDataset.columns[2]]: 15000 },
                    { [activeDataset.columns[0]]: 'Middle East', [activeDataset.columns[2]]: 12000 },
                ],
                chartType: 'bar'
            });
            setIsLoading(false);
        }, 2000);
    };

    return (
        <div className="h-full flex flex-col bg-slate-950 rounded-xl overflow-hidden border border-slate-800">
            <div className="bg-slate-900 p-6 border-b border-slate-800 flex justify-between items-center shrink-0">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                        <TableCellsIcon className="w-8 h-8 text-purple-500" />
                        Big Data Studio
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">AI-Powered Analytics & Visualization</p>
                </div>
                <button 
                    onClick={handleUpload}
                    className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors border border-slate-700"
                >
                    <CloudArrowUpIcon className="w-4 h-4" />
                    Import Data
                </button>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar: Datasets */}
                <div className="w-64 bg-slate-900/50 border-r border-slate-800 p-4 flex flex-col">
                    <h3 className="text-xs font-bold text-slate-500 uppercase mb-4 tracking-widest">Active Datasets</h3>
                    <div className="space-y-2">
                        {datasets.map(ds => (
                            <button
                                key={ds.id}
                                onClick={() => setActiveDataset(ds)}
                                className={`w-full text-left p-3 rounded-lg border transition-all ${
                                    activeDataset?.id === ds.id 
                                    ? 'bg-purple-900/20 border-purple-500 text-white' 
                                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-600'
                                }`}
                            >
                                <div className="font-bold text-sm truncate">{ds.name}</div>
                                <div className="flex justify-between text-[10px] mt-1 opacity-70">
                                    <span>{ds.source}</span>
                                    <span>{(ds.rows / 1000).toFixed(1)}k rows</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Area */}
                <div className="flex-grow p-6 overflow-y-auto">
                    {!activeDataset ? (
                        <div className="h-full flex flex-col items-center justify-center text-slate-500">
                            <TableCellsIcon className="w-16 h-16 mb-4 opacity-20" />
                            <p>Select a dataset to begin analysis</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* Query Input */}
                            <form onSubmit={handleQuery} className="relative">
                                <input 
                                    type="text" 
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder={`Ask a question about ${activeDataset.name}... (e.g., "Show distribution of ${activeDataset.columns[0]}")`}
                                    className="w-full bg-slate-900 border border-slate-700 rounded-xl py-4 pl-12 pr-32 text-white focus:outline-none focus:border-purple-500 shadow-lg"
                                />
                                <MagnifyingGlassIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-500" />
                                <button 
                                    type="submit" 
                                    disabled={isLoading || !prompt}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-colors disabled:opacity-50"
                                >
                                    <SparklesIcon className="w-4 h-4" />
                                    Analyze
                                </button>
                            </form>

                            {/* Loading State */}
                            {isLoading && (
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-8 text-center animate-pulse">
                                    <div className="h-4 bg-slate-800 rounded w-3/4 mx-auto mb-4"></div>
                                    <div className="h-40 bg-slate-800 rounded w-full mx-auto"></div>
                                    <p className="text-purple-400 text-sm mt-4">Generating SQL query & visualizing data...</p>
                                </div>
                            )}

                            {/* Results */}
                            {queryResult && !isLoading && (
                                <div className="space-y-6 animate-fade-in-up">
                                    {/* SQL Preview */}
                                    <div className="bg-black/30 border border-slate-800 rounded-lg p-3">
                                        <div className="text-xs text-slate-500 font-mono mb-1 uppercase">Generated Query</div>
                                        <code className="text-green-400 font-mono text-sm">{queryResult.sql}</code>
                                    </div>

                                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                        {/* Visualization */}
                                        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-80">
                                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                                <PresentationChartLineIcon className="w-5 h-5 text-blue-400" />
                                                Visualization
                                            </h4>
                                            <div className="flex-grow flex items-end justify-around gap-2 px-4 pb-4 relative border-b border-l border-slate-700">
                                                {queryResult.result.map((row, idx) => (
                                                    <div key={idx} className="flex flex-col items-center gap-2 group w-full">
                                                        <div 
                                                            className="w-full bg-purple-600/80 rounded-t hover:bg-purple-500 transition-all relative"
                                                            style={{ height: `${(Object.values(row)[1] as number) / 500}%` }} // Simple scaling
                                                        >
                                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {Object.values(row)[1]}
                                                            </div>
                                                        </div>
                                                        <span className="text-[10px] text-slate-400 truncate w-full text-center">{Object.values(row)[0]}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Data Table */}
                                        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col h-80">
                                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                                <TableCellsIcon className="w-5 h-5 text-green-400" />
                                                Raw Data
                                            </h4>
                                            <div className="overflow-y-auto flex-grow">
                                                <table className="w-full text-sm text-left text-slate-300">
                                                    <thead className="text-xs text-slate-500 uppercase bg-slate-800 sticky top-0">
                                                        <tr>
                                                            {Object.keys(queryResult.result[0]).map(key => (
                                                                <th key={key} className="px-2 py-2">{key}</th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-slate-800">
                                                        {queryResult.result.map((row, idx) => (
                                                            <tr key={idx}>
                                                                {Object.values(row).map((val: any, vIdx) => (
                                                                    <td key={vIdx} className="px-2 py-2 truncate max-w-[100px]">{val}</td>
                                                                ))}
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BigDataTool;
