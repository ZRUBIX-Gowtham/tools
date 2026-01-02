"use client";
import { useState } from 'react';
import { Code, Copy, Check, FileJson } from 'lucide-react';

export default function JSONFormatter() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    const format = () => {
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

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">JSON Formatter</h1>
                <p className="text-slate-500 text-lg">Format and validate your JSON data.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Input JSON</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder='{"key": "value"}'
                            className="w-full h-64 p-4 rounded-xl bg-slate-900 text-emerald-400 font-mono text-sm border-2 border-transparent focus:border-violet-500 outline-none resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700">Output</label>
                            {output && (
                                <button onClick={copyOutput} className="text-sm text-slate-500 hover:text-violet-600 flex items-center gap-1">
                                    {copied ? <Check size={14} /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Formatted JSON will appear here..."
                            className="w-full h-64 p-4 rounded-xl bg-slate-50 text-slate-700 font-mono text-sm border-2 border-slate-200 outline-none resize-none"
                        />
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm mb-6">
                        {error}
                    </div>
                )}

                <div className="flex justify-center gap-4">
                    <button
                        onClick={format}
                        className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-violet-600 transition-all"
                    >
                        Format JSON
                    </button>
                    <button
                        onClick={minify}
                        className="bg-slate-100 text-slate-700 px-8 py-4 rounded-xl font-bold hover:bg-slate-200 transition-all"
                    >
                        Minify
                    </button>
                </div>
            </div>
        </div>
    );
}
