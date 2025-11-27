
import React, { useState } from 'react';
import { AdjustmentsHorizontalIcon, QuestionMarkCircleIcon, CloudArrowUpIcon, CheckCircleIcon } from '../Icons.tsx';

const AgentSettings: React.FC = () => {
    const [temperature, setTemperature] = useState(0.7);
    const [topP, setTopP] = useState(0.95);
    const [topK, setTopK] = useState(40);
    const [maxTokens, setMaxTokens] = useState(2048);
    const [model, setModel] = useState('Gemini 2.5 Pro');
    const [isSaving, setIsSaving] = useState(false);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call to PyCom Cloud
        setTimeout(() => {
            setIsSaving(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000);
        }, 1500);
    };

    const Tooltip: React.FC<{ text: string }> = ({ text }) => (
        <div className="group relative inline-block ml-2">
            <QuestionMarkCircleIcon className="w-4 h-4 text-slate-500 hover:text-slate-300 cursor-help" />
            <div className="pointer-events-none absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 rounded bg-gray-800 p-2 text-xs text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 border border-slate-600 z-10">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-800"></div>
            </div>
        </div>
    );

    return (
        <div className="h-full bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col">
            <div className="bg-slate-900 p-6 border-b border-slate-800 shrink-0">
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                    <AdjustmentsHorizontalIcon className="w-7 h-7 text-gray-400" />
                    Advanced Agent Configuration
                </h2>
            </div>
            
            <div className="p-8 max-w-4xl overflow-y-auto flex-grow">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left Column */}
                    <div className="space-y-8">
                        <div>
                            <label className="block text-slate-300 font-bold mb-2">Primary Model</label>
                            <select 
                                value={model}
                                onChange={(e) => setModel(e.target.value)}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none"
                            >
                                <option>Gemini 2.5 Pro (Reasoning)</option>
                                <option>Gemini 2.5 Flash (Speed)</option>
                                <option>Gemini 1.5 Pro (Legacy)</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-2">Select the underlying LLM powering this agent's decision making.</p>
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Temperature: {temperature}</label>
                                <Tooltip text="Controls randomness. Higher values (e.g., 0.8) make output more random, while lower values (e.g., 0.2) make it more focused and deterministic." />
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.1" 
                                value={temperature}
                                onChange={(e) => setTemperature(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>Precise (0.0)</span>
                                <span>Creative (1.0)</span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Max Output Tokens: {maxTokens}</label>
                                <Tooltip text="The maximum number of tokens to generate in the response. Controls the length of the output." />
                            </div>
                            <input 
                                type="range" 
                                min="128" 
                                max="8192" 
                                step="128" 
                                value={maxTokens}
                                onChange={(e) => setMaxTokens(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                            <div className="flex justify-between text-xs text-slate-500 mt-2">
                                <span>Short (128)</span>
                                <span>Long (8192)</span>
                            </div>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">
                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Top P (Nucleus Sampling): {topP}</label>
                                <Tooltip text="Change how the model selects tokens. Top-P selects from the top P% probability mass. 0.95 is standard." />
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="1" 
                                step="0.05" 
                                value={topP}
                                onChange={(e) => setTopP(parseFloat(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                            />
                        </div>

                        <div>
                            <div className="flex items-center mb-2">
                                <label className="block text-slate-300 font-bold">Top K: {topK}</label>
                                <Tooltip text="Limits the next token selection to the K most likely tokens. Lower values reduce weird outputs." />
                            </div>
                            <input 
                                type="range" 
                                min="1" 
                                max="100" 
                                step="1" 
                                value={topK}
                                onChange={(e) => setTopK(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-orange-500"
                            />
                        </div>

                        <div>
                            <label className="block text-slate-300 font-bold mb-2">System Prompt Override</label>
                            <textarea 
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:border-purple-500 focus:outline-none h-40 font-mono text-sm"
                                placeholder="You are a helpful AI assistant..."
                                defaultValue="You are an autonomous agent capable of using tools to achieve business objectives. Always prioritize accuracy and efficiency. When interacting with MCP tools, ensure parameters are validated."
                            ></textarea>
                        </div>
                    </div>
                </div>

                <div className="pt-8 mt-8 border-t border-slate-800 flex justify-end">
                    <button 
                        onClick={handleSave}
                        disabled={isSaving || saved}
                        className={`px-8 py-3 rounded-lg font-bold transition-all shadow-lg flex items-center gap-2 ${
                            saved ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-purple-600 hover:bg-purple-700 text-white'
                        }`}
                    >
                        {isSaving ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                Syncing to PyCom Cloud...
                            </>
                        ) : saved ? (
                            <>
                                <CheckCircleIcon className="w-5 h-5" />
                                Saved Successfully
                            </>
                        ) : (
                            <>
                                <CloudArrowUpIcon className="w-5 h-5" />
                                Save Configuration
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentSettings;
