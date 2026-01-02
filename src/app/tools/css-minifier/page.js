"use client";
import { useState } from 'react';
import { Code, Copy, Check, Minimize2 } from 'lucide-react';

export default function CSSMinifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [savings, setSavings] = useState(0);

    const minify = () => {
        const minified = input
            .replace(/\/\*[\s\S]*?\*\//g, '')
            .replace(/\s+/g, ' ')
            .replace(/\s*([{}:;,])\s*/g, '$1')
            .replace(/;}/g, '}')
            .trim();

        setOutput(minified);
        const saved = ((input.length - minified.length) / input.length * 100).toFixed(1);
        setSavings(parseFloat(saved) || 0);
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">CSS Minifier</h1>
                <p className="text-slate-500 text-lg">Minify your CSS code to reduce file size.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Input CSS</label>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder=".class { property: value; }"
                            className="w-full h-64 p-4 rounded-xl bg-slate-900 text-cyan-400 font-mono text-sm border-2 border-transparent focus:border-violet-500 outline-none resize-none"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-slate-700">Minified Output</label>
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
                            placeholder="Minified CSS will appear here..."
                            className="w-full h-64 p-4 rounded-xl bg-slate-50 text-slate-700 font-mono text-sm border-2 border-slate-200 outline-none resize-none"
                        />
                    </div>
                </div>

                {savings > 0 && (
                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-600 text-sm mb-6 text-center">
                        Reduced by <strong>{savings}%</strong> ({input.length} → {output.length} characters)
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={minify}
                        className="bg-slate-900 text-white px-10 py-4 rounded-xl font-bold hover:bg-violet-600 transition-all flex items-center gap-2"
                    >
                        <Minimize2 size={18} /> Minify CSS
                    </button>
                </div>
            </div>
        </div>
    );
}
