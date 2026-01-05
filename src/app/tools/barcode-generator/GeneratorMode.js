"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Download, Copy, Check, Upload, Link2, X } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import Barcode from 'react-barcode';

// Helper to download SVG as PNG
const downloadSvgAsPng = (svgElement, filename) => {
    if (!svgElement) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svgElement);

    // Create an image to render the SVG
    const img = new Image();
    // Add extra size for better resolution
    const scale = 2;

    img.onload = () => {
        canvas.width = (svgElement.viewBox.baseVal.width || svgElement.width.baseVal.value) * scale;
        canvas.height = (svgElement.viewBox.baseVal.height || svgElement.height.baseVal.value) * scale;

        // Draw white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
    };

    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
};

export default function GeneratorMode({ initialText = '123456789012', initialType = 'CODE128' }) {
    const [text, setText] = useState(initialText);
    const [type, setType] = useState(initialType);
    const [copied, setCopied] = useState(false);
    const [urlCopied, setUrlCopied] = useState(false);
    const [showUrlPopup, setShowUrlPopup] = useState(false);

    // Toggle states for URL generation
    const [includeType, setIncludeType] = useState(true);

    const fileInputRef = useRef(null);

    const barcodeTypes = [
        { value: 'CODE128', label: 'Code 128' },
        { value: 'CODE39', label: 'Code 39' },
        { value: 'EAN13', label: 'EAN-13' },
        { value: 'EAN8', label: 'EAN-8' },
        { value: 'UPC', label: 'UPC-A' },
        { value: 'QR', label: 'QR Code' },
    ];

    const getShareableUrl = useCallback(() => {
        if (typeof window === 'undefined') return '';

        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();

        if (text) {
            params.set('name', text);
        }

        if (includeType) {
            params.set('type', type);
        }

        return `${baseUrl}?${params.toString()}`;
    }, [text, type, includeType]);

    const copyShareableUrl = async () => {
        try {
            const url = getShareableUrl();
            await navigator.clipboard.writeText(url);
            setUrlCopied(true);
            setTimeout(() => setUrlCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const downloadBarcode = () => {
        // Find SVG inside the preview div
        const svg = document.getElementById('barcode-preview')?.querySelector('svg');
        if (svg) {
            downloadSvgAsPng(svg, `barcode-${text}.png`);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setText(e.target.result.trim());
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Barcode Generator</h1>
                <p className="text-zinc-400 text-lg">Generate various types of shareable barcodes.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300">Barcode Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-4 rounded-xl bg-zinc-800 border border-white/10 focus:border-amber-500 outline-none font-bold text-white cursor-pointer"
                            >
                                {barcodeTypes.map((t) => (
                                    <option key={t.value} value={t.value} className="bg-zinc-900">{t.label}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-zinc-300">Content</label>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <Upload size={12} /> Import from File
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".txt,.csv,.json"
                                />
                            </div>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter barcode content..."
                                className="w-full p-4 rounded-xl bg-zinc-800 border border-white/10 focus:border-amber-500 outline-none font-mono text-white placeholder-zinc-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div id="barcode-preview" className="bg-white p-6 rounded-2xl shadow-lg border border-white/10 w-full min-h-[200px] flex items-center justify-center overflow-auto">
                            {text ? (
                                <Barcode
                                    value={text}
                                    format={type === 'UPC' ? 'UPC' : type}
                                    width={2}
                                    height={100}
                                    displayValue={true}
                                />
                            ) : (
                                <p className="text-slate-400 text-sm">Preview area</p>
                            )}
                        </div>
                        <div className="flex gap-4 flex-wrap justify-center w-full">
                            <button
                                onClick={downloadBarcode}
                                className="flex-1 min-w-[160px] bg-amber-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/20"
                            >
                                <Download size={18} /> Download
                            </button>
                            <button
                                onClick={() => setShowUrlPopup(true)}
                                className="flex-1 min-w-[160px] bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg hover:shadow-blue-500/20"
                            >
                                <Link2 size={18} /> Get URL
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* URL Popup Modal */}
            {showUrlPopup && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowUrlPopup(false)}>
                    <div
                        className="bg-zinc-900 border border-white/10 rounded-3xl p-8 max-w-2xl w-full shadow-2xl animate-in zoom-in-95 duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                                    <Link2 size={24} className="text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-white">Shareable URL</h3>
                                    <p className="text-sm text-zinc-400">Share this link to generate the same barcode</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setShowUrlPopup(false)}
                                className="p-2 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer"
                            >
                                <X size={24} className="text-zinc-400 hover:text-white" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* URL Display */}
                            <div className="bg-zinc-800 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wide mb-2">Full URL</p>
                                <div className="break-all text-sm font-mono text-amber-400 bg-zinc-900/50 p-4 rounded-xl border border-white/5">
                                    {getShareableUrl()}
                                </div>
                            </div>

                            {/* Parameters Breakdown */}
                            <div className="bg-zinc-800 rounded-2xl p-4 border border-white/5">
                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wide mb-3">Parameters</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3 p-3 bg-zinc-900/50 rounded-xl">
                                        <span className="text-blue-400 font-mono text-sm font-bold">name</span>
                                        <span className="text-zinc-300 text-sm break-all flex-1">{text || '(empty)'}</span>
                                    </div>

                                    {/* Type Toggle */}
                                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-400 font-mono text-sm font-bold">type</span>
                                            {includeType ? (
                                                <span className="text-zinc-300 text-sm font-mono">{type}</span>
                                            ) : (
                                                <span className="text-zinc-500 text-sm italic">Excluded</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setIncludeType(!includeType)}
                                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${includeType ? 'bg-green-500' : 'bg-zinc-700'}`}
                                            title="Toggle Parameter"
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${includeType ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Copy Button */}
                            <button
                                onClick={copyShareableUrl}
                                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-4 rounded-2xl font-black text-lg hover:from-emerald-600 hover:to-emerald-700 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl active:scale-[0.98]"
                            >
                                {urlCopied ? (
                                    <>
                                        <Check size={22} /> Copied to Clipboard!
                                    </>
                                ) : (
                                    <>
                                        <Copy size={22} /> Copy URL
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <RelatedTools />
        </div>
    );
}
