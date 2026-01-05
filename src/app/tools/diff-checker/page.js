"use client";

import React, { useState, useEffect, useRef } from 'react';
import { diffWords, diffLines, diffChars } from 'diff';
import { Copy, Trash2, ArrowRightLeft, FileText, Type, AlignJustify, Check, Upload } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

const DiffChecker = () => {
    const [originalText, setOriginalText] = useState('');
    const [modifiedText, setModifiedText] = useState('');
    const [diffResult, setDiffResult] = useState([]);
    const [diffMode, setDiffMode] = useState('words'); // words, chars, lines
    const [copied, setCopied] = useState(false);

    const originalFileRef = useRef(null);
    const modifiedFileRef = useRef(null);

    useEffect(() => {
        handleCompare();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [originalText, modifiedText, diffMode]);

    const handleCompare = () => {
        let diff;
        if (diffMode === 'chars') {
            diff = diffChars(originalText, modifiedText);
        } else if (diffMode === 'lines') {
            diff = diffLines(originalText, modifiedText);
        } else {
            diff = diffWords(originalText, modifiedText);
        }
        setDiffResult(diff);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(modifiedText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const clearAll = () => {
        setOriginalText('');
        setModifiedText('');
        if (originalFileRef.current) originalFileRef.current.value = '';
        if (modifiedFileRef.current) modifiedFileRef.current.value = '';
    };

    const loadSample = () => {
        setOriginalText('The quick brown fox jumps over the lazy dog.\nThis is a simple text comparison tool.');
        setModifiedText('The quick red fox jumped over the lazy dog.\nThis is a advanced text comparison tool.');
    };

    const handleFileUpload = (e, target) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            if (target === 'original') {
                setOriginalText(e.target.result);
            } else {
                setModifiedText(e.target.result);
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-[#050505] text-gray-300 font-sans selection:bg-blue-500/30">

            {/* Header Section */}
            <div className="bg-[#0a0a0a] border-b border-white/5 pt-24 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                </div>

                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6 tracking-tight">
                        Online Diff Checker
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8 leading-relaxed">
                        Compare two text files or strings side-by-side to instantly visualize differences.
                        Efficient, secure, and entirely browser-based.
                    </p>

                    {/* Controls */}
                    <div className="flex flex-wrap justify-center gap-4 animate-fade-in-up">
                        <div className="flex items-center bg-[#151515] p-1.5 rounded-lg border border-white/10 shadow-xl">
                            <button
                                onClick={() => setDiffMode('chars')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${diffMode === 'chars' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Type size={16} />
                                Chars
                            </button>
                            <button
                                onClick={() => setDiffMode('words')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${diffMode === 'words' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <FileText size={16} />
                                Words
                            </button>
                            <button
                                onClick={() => setDiffMode('lines')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 flex items-center gap-2 ${diffMode === 'lines' ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <AlignJustify size={16} />
                                Lines
                            </button>
                        </div>

                        <div className="flex items-center gap-3">
                            <button
                                onClick={loadSample}
                                className="px-5 py-2.5 rounded-lg bg-[#151515] hover:bg-[#202020] border border-white/10 text-gray-300 font-medium text-sm transition-all hover:border-white/20 flex items-center gap-2"
                            >
                                <ArrowRightLeft size={16} />
                                Load Sample
                            </button>
                            <button
                                onClick={clearAll}
                                className="px-5 py-2.5 rounded-lg bg-[#151515] hover:bg-red-900/20 border border-white/10 hover:border-red-500/30 text-gray-300 hover:text-red-400 font-medium text-sm transition-all flex items-center gap-2 group"
                            >
                                <Trash2 size={16} className="group-hover:animate-bounce-short" />
                                Clear
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">

                    {/* Original Text Input */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Original Text</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => originalFileRef.current?.click()}
                                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                                >
                                    <Upload size={12} /> Upload File
                                </button>
                                <input
                                    type="file"
                                    ref={originalFileRef}
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'original')}
                                    accept=".txt,.js,.css,.html,.json,.md"
                                />
                                <span className="text-xs text-gray-600 font-mono">{originalText.length} chars</span>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <textarea
                                value={originalText}
                                onChange={(e) => setOriginalText(e.target.value)}
                                placeholder="Paste original text here..."
                                className="relative w-full h-80 bg-[#121212] border border-white/10 text-gray-300 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none font-mono text-sm leading-relaxed transition-all shadow-inner placeholder:text-gray-700"
                            />
                        </div>
                    </div>

                    {/* New Text Input */}
                    <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Modified Text</label>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => modifiedFileRef.current?.click()}
                                    className="text-xs flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all border border-white/5"
                                >
                                    <Upload size={12} /> Upload File
                                </button>
                                <input
                                    type="file"
                                    ref={modifiedFileRef}
                                    className="hidden"
                                    onChange={(e) => handleFileUpload(e, 'modified')}
                                    accept=".txt,.js,.css,.html,.json,.md"
                                />
                                <span className="text-xs text-gray-600 font-mono">{modifiedText.length} chars</span>
                            </div>
                        </div>
                        <div className="group relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                            <textarea
                                value={modifiedText}
                                onChange={(e) => setModifiedText(e.target.value)}
                                placeholder="Paste modified text here..."
                                className="relative w-full h-80 bg-[#121212] border border-white/10 text-gray-300 rounded-xl p-5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent resize-none font-mono text-sm leading-relaxed transition-all shadow-inner placeholder:text-gray-700"
                            />
                        </div>
                    </div>
                </div>

                {/* Diff Output */}
                {(originalText || modifiedText) && (
                    <div className="animate-fade-in">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <h2 className="text-xl font-bold text-white flex items-center gap-2">
                                <span className="w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full block"></span>
                                Comparison Result
                            </h2>
                            <button
                                onClick={handleCopy}
                                className="text-xs font-medium text-gray-500 hover:text-white flex items-center gap-1.5 transition-colors"
                            >
                                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                                {copied ? 'Copied Modified Text' : 'Copy Modified Text'}
                            </button>
                        </div>

                        <div className="relative rounded-xl overflow-hidden border border-white/10 bg-[#0f0f0f] shadow-2xl">
                            <div className="absolute top-0 left-0 w-full h-8 bg-[#1a1a1a] border-b border-white/5 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
                            </div>

                            <div className="p-6 pt-12 overflow-x-auto">
                                <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words">
                                    {diffResult.map((part, index) => {
                                        const color = part.added
                                            ? 'bg-green-500/20 text-green-300 border-b-2 border-green-500/30'
                                            : part.removed
                                                ? 'bg-red-500/20 text-red-300 border-b-2 border-red-500/30 decoration-slice line-through decoration-red-500/50'
                                                : 'text-gray-400';

                                        return (
                                            <span key={index} className={`${color} px-0.5 rounded-sm transition-colors duration-300`}>
                                                {part.value}
                                            </span>
                                        );
                                    })}
                                </pre>
                            </div>

                            <div className="bg-[#1a1a1a] border-t border-white/5 px-6 py-3 flex items-center gap-6 text-xs font-mono text-gray-500">
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-red-500/20 border border-red-500/30 rounded-sm"></span>
                                    Removed
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="w-3 h-3 bg-green-500/20 border border-green-500/30 rounded-sm"></span>
                                    Added
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <RelatedTools />

            <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.5s ease-out forwards;
        }
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
        </div>
    );
};

export default DiffChecker;
