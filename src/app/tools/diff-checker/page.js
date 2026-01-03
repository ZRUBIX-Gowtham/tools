"use client";
import { useState } from 'react';
import * as Diff from 'diff';
import { Copy, RotateCcw, ArrowRightLeft, Check, Split, FileDiff, Settings, ShieldCheck, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function DiffChecker() {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diffResult, setDiffResult] = useState([]);
    const [showDiff, setShowDiff] = useState(false);
    const [diffMode, setDiffMode] = useState('chars'); // 'chars' or 'lines' or 'words'

    // UI States
    const [copied, setCopied] = useState(false);

    const compareText = () => {
        if (!original && !modified) return;

        let diff;
        if (diffMode === 'lines') {
            diff = Diff.diffLines(original, modified);
        } else if (diffMode === 'words') {
            diff = Diff.diffWords(original, modified);
        } else {
            diff = Diff.diffChars(original, modified);
        }

        setDiffResult(diff);
        setShowDiff(true);
    };

    const clearAll = () => {
        setOriginal('');
        setModified('');
        setDiffResult([]);
        setShowDiff(false);
    };

    const copyResult = () => {
        const text = diffResult.map(part => part.value).join('');
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-20 relative z-10">
            {/* Header */}
            <div className="text-center mb-12">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center justify-center p-3 mb-6 rounded-2xl bg-violet-500/10 text-violet-400 border border-violet-500/20"
                >
                    <FileDiff size={40} />
                </motion.div>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    Diff <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Checker</span>
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-slate-400 text-lg font-light max-w-2xl mx-auto"
                >
                    Compare two text files or code snippets to find the differences.
                    Highlight changes, additions, and deletions instantly.
                </motion.p>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0a0a0a] rounded-[2rem] border border-white/10 shadow-2xl overflow-hidden"
            >
                {/* Controls */}
                <div className="p-6 border-b border-white/10 bg-white/5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                        {['chars', 'words', 'lines'].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => setDiffMode(mode)}
                                className={`px-4 py-2 rounded-lg text-sm font-bold transition-all capitalize ${diffMode === mode
                                        ? 'bg-violet-600 text-white shadow-lg shadow-violet-900/20'
                                        : 'text-slate-500 hover:text-slate-300'
                                    }`}
                            >
                                {mode}
                            </button>
                        ))}
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={clearAll}
                            className="flex items-center gap-2 px-4 py-2 text-slate-500 hover:text-rose-500 font-bold transition-colors"
                        >
                            <RotateCcw size={18} />
                            Clear
                        </button>
                        <button
                            onClick={compareText}
                            className="flex items-center gap-2 bg-white text-black hover:bg-violet-50 px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-violet-500/10"
                        >
                            <ArrowRightLeft size={18} />
                            Compare Now
                        </button>
                    </div>
                </div>

                {/* Input Area */}
                {!showDiff && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/10">
                        <div className="p-6 md:p-8">
                            <label className="block text-sm font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">Original Text</label>
                            <textarea
                                value={original}
                                onChange={(e) => setOriginal(e.target.value)}
                                placeholder="Paste original text here..."
                                className="w-full h-96 p-4 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 outline-none resize-none transition-all font-mono text-sm leading-relaxed text-slate-300 placeholder:text-slate-600"
                            />
                        </div>
                        <div className="p-6 md:p-8">
                            <label className="block text-sm font-bold text-slate-400 mb-3 ml-1 uppercase tracking-wider">Modified Text</label>
                            <textarea
                                value={modified}
                                onChange={(e) => setModified(e.target.value)}
                                placeholder="Paste modified text here..."
                                className="w-full h-96 p-4 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500/50 focus:bg-white/10 outline-none resize-none transition-all font-mono text-sm leading-relaxed text-slate-300 placeholder:text-slate-600"
                            />
                        </div>
                    </div>
                )}

                {/* Diff Result */}
                {showDiff && (
                    <div className="p-6 md:p-8">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-slate-200 text-lg">Comparison Result</h3>
                            <button
                                onClick={() => setShowDiff(false)}
                                className="text-sm font-bold text-violet-400 hover:text-violet-300 underline underline-offset-4"
                            >
                                Edit Inputs
                            </button>
                        </div>

                        <div className="w-full bg-black rounded-xl overflow-hidden border border-white/10">
                            {/* Toolbar */}
                            <div className="bg-white/5 px-4 py-2 border-b border-white/10 flex items-center justify-between">
                                <div className="flex items-center gap-4 text-xs font-mono">
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-3 h-3 rounded-full bg-rose-500/20 border border-rose-500/50"></span>
                                        Removed
                                    </span>
                                    <span className="flex items-center gap-1.5 text-slate-400">
                                        <span className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50"></span>
                                        Added
                                    </span>
                                </div>
                                <button
                                    onClick={copyResult}
                                    className="text-xs text-slate-500 hover:text-violet-400 flex items-center gap-1 transition-colors"
                                >
                                    {copied ? <Check size={12} /> : <Copy size={12} />}
                                    {copied ? 'Copied' : 'Copy Text'}
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 overflow-auto font-mono text-sm leading-relaxed max-h-[600px] whitespace-pre-wrap text-slate-300">
                                {diffResult.map((part, index) => {
                                    const color = part.added ? 'bg-emerald-500/20 text-emerald-200 border-b border-emerald-500/30' :
                                        part.removed ? 'bg-rose-500/20 text-rose-200 border-b border-rose-500/30' :
                                            'text-slate-400';
                                    return (
                                        <span key={index} className={`${color} px-0.5 rounded-[1px]`}>
                                            {part.value}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </motion.div>

            {/* Trust Badges */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm">
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        <ShieldCheck size={14} className="text-emerald-500" /> Secure
                    </div>
                    <p className="text-slate-500 leading-relaxed font-light">Your text/code is processed locally in your browser. We never see your data.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        <Settings size={14} className="text-blue-500" /> Customizable
                    </div>
                    <p className="text-slate-500 leading-relaxed font-light">Compare by characters, words, or lines to get the exact view you need.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-2">
                        <Zap size={14} className="text-amber-500" /> Instant
                    </div>
                    <p className="text-slate-500 leading-relaxed font-light">Zero latency. Paste and compare immediately without server uploads.</p>
                </div>
            </div>
        </div>
    );
}
