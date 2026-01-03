"use client";
import { useState } from 'react';
import { Type, Copy, Check, ArrowDown } from 'lucide-react';

export default function CaseConverter() {
    const [text, setText] = useState('');
    const [copied, setCopied] = useState(false);

    const conversions = [
        { label: 'lowercase', fn: (t) => t.toLowerCase() },
        { label: 'UPPERCASE', fn: (t) => t.toUpperCase() },
        { label: 'Title Case', fn: (t) => t.toLowerCase().replace(/\b\w/g, c => c.toUpperCase()) },
        { label: 'Sentence case', fn: (t) => t.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase()) },
        { label: 'aLtErNaTiNg', fn: (t) => t.split('').map((c, i) => i % 2 ? c.toUpperCase() : c.toLowerCase()).join('') },
        { label: 'InVeRsE', fn: (t) => t.split('').map(c => c === c.toUpperCase() ? c.toLowerCase() : c.toUpperCase()).join('') },
    ];

    const applyConversion = (fn) => {
        setText(fn(text));
    };

    const copyText = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Case Converter</h1>
                <p className="text-zinc-400 text-lg">Convert text between different case styles.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Enter your text here..."
                    className="w-full h-48 p-6 rounded-xl bg-white/5 border border-white/10 focus:border-indigo-500 outline-none resize-none text-white placeholder:text-zinc-600 mb-6 transition-all text-lg"
                />

                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                    {conversions.map((conv) => (
                        <button
                            key={conv.label}
                            onClick={() => applyConversion(conv.fn)}
                            className="py-3 px-4 bg-white/5 hover:bg-indigo-500/20 hover:border-indigo-500/50 border border-white/5 rounded-xl font-bold text-sm transition-all text-zinc-300 hover:text-white cursor-pointer"
                        >
                            {conv.label}
                        </button>
                    ))}
                </div>

                <div className="flex justify-between items-center">
                    <button
                        onClick={() => setText('')}
                        className="text-zinc-500 hover:text-rose-500 font-bold text-sm transition-colors cursor-pointer"
                    >
                        Clear Text
                    </button>
                    {text && (
                        <button
                            onClick={copyText}
                            className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-indigo-500/20"
                        >
                            {copied ? <Check size={18} className="text-emerald-300" /> : <Copy size={18} />}
                            {copied ? 'Copied!' : 'Copy'}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
