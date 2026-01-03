"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { QrCode, Download, Copy, Check, Palette, Layout } from 'lucide-react';

const QR_TEMPLATES = [
    { name: 'Classic', fg: '#000000', bg: '#ffffff', style: 'default' },
    { name: 'Ocean Blue', fg: '#0369a1', bg: '#f0f9ff', style: 'blue' },
    { name: 'Forest Green', fg: '#166534', bg: '#f0fdf4', style: 'green' },
    { name: 'Sunset Orange', fg: '#c2410c', bg: '#fff7ed', style: 'orange' },
    { name: 'Royal Purple', fg: '#7c3aed', bg: '#faf5ff', style: 'purple' },
    { name: 'Rose Pink', fg: '#be185d', bg: '#fdf2f8', style: 'pink' },
    { name: 'Dark Mode', fg: '#ffffff', bg: '#18181b', style: 'dark' },
    { name: 'Neon Cyber', fg: '#22d3ee', bg: '#0f172a', style: 'neon' },
    { name: 'Gold Luxury', fg: '#b45309', bg: '#fef3c7', style: 'gold' },
    { name: 'Slate Modern', fg: '#334155', bg: '#f1f5f9', style: 'slate' },
    { name: 'Ruby Red', fg: '#dc2626', bg: '#fef2f2', style: 'red' },
    { name: 'Emerald', fg: '#059669', bg: '#ecfdf5', style: 'emerald' },
];

const PRESET_COLORS = [
    '#000000', '#ffffff', '#ef4444', '#f97316', '#eab308', '#22c55e',
    '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#6b7280', '#1e293b'
];

export default function QRGenerator() {
    const [text, setText] = useState('https://toolshub.onslate.com');
    const [size, setSize] = useState(256);
    const [qrUrl, setQrUrl] = useState('');
    const [copied, setCopied] = useState(false);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [activeTab, setActiveTab] = useState('custom');

    const generateQR = useCallback(() => {
        if (!text.trim()) return;
        // Using QR Server API with color support
        const fg = fgColor.replace('#', '');
        const bg = bgColor.replace('#', '');
        const url = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${fg}&bgcolor=${bg}`;
        setQrUrl(url);
    }, [text, fgColor, bgColor, size]);

    useEffect(() => {
        generateQR();
    }, [generateQR]);

    const applyTemplate = (template) => {
        setFgColor(template.fg);
        setBgColor(template.bg);
    };

    const downloadQR = async () => {
        try {
            const response = await fetch(qrUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png';
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">QR Code Generator</h1>
                <p className="text-zinc-400 text-lg">Create beautiful QR codes with custom colors and templates.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Input Section */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300">Content</label>
                            <textarea
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter URL or text..."
                                className="w-full h-32 p-4 rounded-xl bg-zinc-800 border-2 border-transparent focus:border-amber-500 outline-none resize-none text-white placeholder-zinc-500"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300">Size: {size}px</label>
                            <input
                                type="range"
                                min="128"
                                max="512"
                                step="64"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-amber-600"
                            />
                        </div>

                        {/* Tab Navigation */}
                        <div className="flex gap-2 p-1 bg-zinc-800 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'templates' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Layout size={16} /> Templates
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'custom' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Palette size={16} /> Custom Colors
                            </button>
                        </div>

                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <div className="space-y-3">
                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wide">Select a Template</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[280px] overflow-y-auto pr-2">
                                    {QR_TEMPLATES.map((template) => (
                                        <button
                                            key={template.name}
                                            onClick={() => applyTemplate(template)}
                                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer hover:border-amber-500/50 hover:bg-white/5 ${fgColor === template.fg && bgColor === template.bg
                                                ? 'border-amber-500 ring-2 ring-amber-500/20'
                                                : 'border-white/5'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-12 rounded-lg mb-2 flex items-center justify-center"
                                                style={{ backgroundColor: template.bg }}
                                            >
                                                <QrCode size={24} style={{ color: template.fg }} />
                                            </div>
                                            <p className="text-xs font-bold text-zinc-300 truncate">{template.name}</p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Custom Colors Tab */}
                        {activeTab === 'custom' && (
                            <div className="space-y-4">
                                {/* QR Color */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-300">QR Code Color</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="w-14 h-12 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={fgColor}
                                            onChange={(e) => setFgColor(e.target.value)}
                                            className="flex-grow px-4 py-3 rounded-xl bg-zinc-800 font-mono text-sm text-white uppercase border border-white/5"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={`fg-${color}`}
                                                onClick={() => setFgColor(color)}
                                                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 cursor-pointer ${fgColor === color ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/10'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Background Color */}
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-300">Background Color</label>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="color"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="w-14 h-12 rounded-lg cursor-pointer border-2 border-white/10 bg-transparent"
                                        />
                                        <input
                                            type="text"
                                            value={bgColor}
                                            onChange={(e) => setBgColor(e.target.value)}
                                            className="flex-grow px-4 py-3 rounded-xl bg-zinc-800 font-mono text-sm text-white uppercase border border-white/5"
                                        />
                                    </div>
                                    <div className="flex gap-2 flex-wrap">
                                        {PRESET_COLORS.map((color) => (
                                            <button
                                                key={`bg-${color}`}
                                                onClick={() => setBgColor(color)}
                                                className={`w-8 h-8 rounded-lg border-2 transition-all hover:scale-110 cursor-pointer ${bgColor === color ? 'border-amber-500 ring-2 ring-amber-500/20' : 'border-white/10'
                                                    }`}
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div
                            className="p-6 rounded-2xl shadow-lg border border-white/10 transition-all"
                            style={{ backgroundColor: bgColor }}
                        >
                            {qrUrl && (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={qrUrl}
                                        alt="QR Code"
                                        className="mx-auto"
                                        style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
                                    />
                                </>
                            )}
                        </div>

                        {/* Current Colors Display */}
                        <div className="flex items-center gap-4 p-3 bg-zinc-800/50 rounded-xl border border-white/10">
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: fgColor }} />
                                <span className="text-xs font-mono text-white">{fgColor.toUpperCase()}</span>
                            </div>
                            <span className="text-zinc-500">→</span>
                            <div className="flex items-center gap-2">
                                <div className="w-6 h-6 rounded-md border border-white/10" style={{ backgroundColor: bgColor }} />
                                <span className="text-xs font-mono text-white">{bgColor.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex gap-3 flex-wrap justify-center">
                            <button
                                onClick={downloadQR}
                                className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                            >
                                <Download size={18} /> Download
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="bg-zinc-800 text-zinc-300 px-6 py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all flex items-center gap-2 cursor-pointer"
                            >
                                {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                                {copied ? 'Copied!' : 'Copy URL'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
