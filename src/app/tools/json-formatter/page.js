"use client";
import { useState, useRef } from 'react';
import { Code, Copy, Check, FileJson, Upload, Trash } from 'lucide-react';

export default function JSONFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    const format = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed, null, 2));
            setError('');
        } catch (e) {
            setError('Invalid JSON: ' + e.message);
            setOutput('');
        }
    };

    const minify = () => {
        if (!input.trim()) return;
        try {
            const parsed = JSON.parse(input);
            setOutput(JSON.stringify(parsed));
            setError('');
        } catch (e) {
            setError('Invalid JSON: ' + e.message);
            setOutput('');
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            setInput(e.target.result);
            setError('');
        };
        reader.readAsText(file);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">JSON Formatter</h1>
                <p className="text-zinc-400 text-lg">Format and validate your JSON data.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-zinc-300">Input JSON</label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setInput('')}
                                    className="p-1.5 text-zinc-500 hover:text-red-400 transition-colors"
                                    title="Clear"
                                >
                                    <Trash size={16} />
                                </button>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs font-bold text-zinc-300 hover:bg-white/10 flex items-center gap-2"
                                >
                                    <Upload size={14} /> Upload File
                                </button>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFileUpload} className="hidden" accept=".json,.txt" />
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='Paste JSON here or upload a file...'
                            className="w-full h-[400px] p-4 rounded-xl bg-zinc-950 text-indigo-400 font-mono text-sm border-2 border-white/5 focus:border-indigo-500 outline-none resize-none custom-scrollbar"
                        />
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-zinc-300">Output</label>
                            {output && (
                                <button onClick={copyOutput} className="text-sm text-zinc-400 hover:text-indigo-400 flex items-center gap-1">
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Formatted JSON will appear here..."
                            className="w-full h-[400px] p-4 rounded-xl bg-zinc-950/50 text-zinc-300 font-mono text-sm border-2 border-white/5 outline-none resize-none custom-scrollbar"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm mb-6 flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                        {error}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={format}
                        className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-indigo-600 transition-all shadow-lg"
                    >
                        Format JSON
                    </button>
                    <button
                        onClick={minify}
                        className="bg-zinc-800 text-zinc-300 px-8 py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all hover:text-white"
                    >
                        Minify
                    </button>
                </div>
            </div>
        </div>
    );
}

