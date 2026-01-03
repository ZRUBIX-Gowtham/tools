"use client";
import { useState, useRef } from 'react';
import { Code, Copy, Check, Minimize2, Upload } from 'lucide-react';

export default function HTMLMinifier() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [copied, setCopied] = useState(false);
    const [savings, setSavings] = useState(0);
    const fileInputRef = useRef(null);

    const minify = () => {
        const minified = input
            .replace(/\s+/g, ' ')
            .replace(/>\s+</g, '><')
            .replace(/<!--[\s\S]*?-->/g, '')
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

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setInput(e.target.result);
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">HTML Minifier</h1>
                <p className="text-zinc-400 text-lg">Minify your HTML code to reduce file size.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-zinc-300">Input HTML</label>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-xs text-orange-400 hover:text-orange-300 flex items-center gap-1 cursor-pointer"
                            >
                                <Upload size={12} /> Upload HTML File
                            </button>
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileUpload}
                                className="hidden"
                                accept=".html,.htm"
                            />
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="<html>...</html>"
                            className="w-full h-80 p-4 rounded-xl bg-white/5 text-orange-400 font-mono text-sm border border-white/10 focus:border-violet-500 outline-none resize-none transition-all"
                        />
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-bold text-zinc-300">Minified Output</label>
                            {output && (
                                <button onClick={copyOutput} className="text-sm text-zinc-500 hover:text-orange-400 flex items-center gap-1">
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            )}
                        </div>
                        <textarea
                            value={output}
                            readOnly
                            placeholder="Minified HTML will appear here..."
                            className="w-full h-80 p-4 rounded-xl bg-black/40 text-emerald-400 font-mono text-sm border border-white/10 outline-none resize-none"
                        />
                    </div>
                </div>

                {savings > 0 && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm mb-6 text-center">
                        Reduced by <strong>{savings}%</strong> ({input.length} → {output.length} characters)
                    </div>
                )}

                <div className="flex justify-center">
                    <button
                        onClick={minify}
                        className="bg-orange-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center gap-2 shadow-lg hover:shadow-orange-500/20"
                    >
                        <Minimize2 size={18} /> Minify HTML
                    </button>
                </div>
            </div>
        </div>
    );
}
