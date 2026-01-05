"use client";
import { useState, useRef } from 'react';
import { Upload, X, Code, Eye, Copy, Download, ZoomIn, ZoomOut } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function SvgViewer() {
    const [file, setFile] = useState(null);
    const [svgContent, setSvgContent] = useState(null);
    const [scale, setScale] = useState(1);
    const [activeTab, setActiveTab] = useState('preview'); // preview, code
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'image/svg+xml') {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                setSvgContent(e.target.result);
                setScale(1);
            };
            reader.readAsText(selectedFile);
        }
    };

    const copyCode = () => {
        if (svgContent) {
            navigator.clipboard.writeText(svgContent);
            // Optionally show toast
        }
    };

    const downloadSvg = () => {
        if (!svgContent || !file) return;
        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.name;
        link.click();
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setFile(null);
        setSvgContent(null);
        setScale(1);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">SVG Viewer & Editor</h1>
                <p className="text-zinc-400 text-lg">View, inspect, and extract code from SVG files.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 md:p-8 shadow-xl backdrop-blur-xl min-h-[600px] flex flex-col">
                {!file ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-orange-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Code size={32} className="text-orange-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select SVG File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/svg+xml" />
                        <p className="text-zinc-500 mt-4 text-sm">Upload .svg files to view code</p>
                    </div>
                ) : (
                    <div className="flex flex-col h-full gap-6">
                        {/* Header Controls */}
                        <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-500/10 rounded-lg text-orange-500">
                                    <Code size={20} />
                                </div>
                                <span className="font-bold text-white truncate max-w-[200px]">{file.name}</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setActiveTab('preview')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'preview' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                >
                                    <span className="flex items-center gap-2"><Eye size={16} /> Preview</span>
                                </button>
                                <button
                                    onClick={() => setActiveTab('code')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'code' ? 'bg-orange-600 text-white' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                                >
                                    <span className="flex items-center gap-2"><Code size={16} /> Code</span>
                                </button>
                                <button onClick={reset} className="p-2 text-zinc-500 hover:text-white transition-colors cursor-pointer bg-zinc-800 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        {/* Content Area */}
                        <div className="flex-1 bg-zinc-950 rounded-2xl border border-white/5 overflow-hidden relative min-h-[500px]">
                            {activeTab === 'preview' ? (
                                <div className="absolute inset-0 flex items-center justify-center overflow-auto p-8">
                                    {/* Checkerboard background */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                    />

                                    <div
                                        className="relative transition-transform duration-200 ease-out"
                                        style={{ transform: `scale(${scale})` }}
                                        dangerouslySetInnerHTML={{ __html: svgContent }}
                                    />

                                    {/* Zoom Controls */}
                                    <div className="absolute bottom-6 right-6 flex gap-2">
                                        <button onClick={() => setScale(s => Math.max(0.1, s - 0.1))} className="p-2 bg-zinc-800 text-white rounded-lg shadow-lg hover:bg-zinc-700 cursor-pointer">
                                            <ZoomOut size={20} />
                                        </button>
                                        <span className="bg-zinc-800 text-white px-3 py-2 rounded-lg text-sm font-mono min-w-[60px] text-center shadow-lg">
                                            {Math.round(scale * 100)}%
                                        </span>
                                        <button onClick={() => setScale(s => Math.min(5, s + 0.1))} className="p-2 bg-zinc-800 text-white rounded-lg shadow-lg hover:bg-zinc-700 cursor-pointer">
                                            <ZoomIn size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex flex-col">
                                    <div className="flex justify-between items-center p-3 bg-zinc-900 border-b border-white/5">
                                        <span className="text-xs text-zinc-500 font-mono">XML / SVG Source</span>
                                        <button onClick={copyCode} className="text-xs flex items-center gap-1 text-orange-400 hover:text-orange-300 font-bold cursor-pointer">
                                            <Copy size={14} /> Copy Code
                                        </button>
                                    </div>
                                    <textarea
                                        readOnly
                                        value={svgContent}
                                        className="flex-1 w-full bg-zinc-950 p-6 font-mono text-sm text-zinc-300 resize-none focus:outline-none custom-scrollbar"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Footer Actions */}
                        <div className="flex justify-end gap-3">
                            <button onClick={copyCode} className="px-6 py-3 rounded-xl bg-zinc-800 text-white font-bold hover:bg-zinc-700 transition-colors flex items-center gap-2 cursor-pointer">
                                <Copy size={18} /> Copy Code
                            </button>
                            <button onClick={downloadSvg} className="px-6 py-3 rounded-xl bg-orange-600 text-white font-bold hover:bg-orange-500 transition-colors flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-orange-600/20">
                                <Download size={18} /> Download SVG
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <RelatedTools />
        </div>
    );
}
