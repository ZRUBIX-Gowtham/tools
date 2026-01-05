"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { QrCode, Download, Copy, Check, Palette, Layout, Upload, X, Image as ImageIcon } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import RelatedTools from '@/components/RelatedTools';

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
    const [copied, setCopied] = useState(false);
    const [fgColor, setFgColor] = useState('#000000');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [activeTab, setActiveTab] = useState('custom');
    const [logo, setLogo] = useState(null);
    const [logoSize, setLogoSize] = useState(50);
    const qrRef = useRef(null);
    const logoInputRef = useRef(null);

    const applyTemplate = (template) => {
        setFgColor(template.fg);
        setBgColor(template.bg);
    };

    const handleLogoUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setLogo(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const downloadQR = () => {
        const canvas = qrRef.current.querySelector('canvas');
        if (!canvas) return;

        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = 'qrcode.png';
        link.click();
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
                <p className="text-zinc-400 text-lg">Create beautiful QR codes with custom colors, templates, and logos.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
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

                        {/* Tab Navigation */}
                        <div className="grid grid-cols-3 gap-2 p-1 bg-zinc-800 rounded-xl border border-white/5">
                            <button
                                onClick={() => setActiveTab('templates')}
                                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'templates' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Layout size={16} /> <span className="hidden sm:inline">Templates</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('custom')}
                                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'custom' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <Palette size={16} /> <span className="hidden sm:inline">Colors</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('logo')}
                                className={`flex items-center justify-center gap-2 px-3 py-3 rounded-lg font-bold text-sm transition-all cursor-pointer ${activeTab === 'logo' ? 'bg-zinc-700 text-white shadow-md' : 'text-zinc-500 hover:text-white'
                                    }`}
                            >
                                <ImageIcon size={16} /> <span className="hidden sm:inline">Logo</span>
                            </button>
                        </div>

                        {/* Templates Tab */}
                        {activeTab === 'templates' && (
                            <div className="space-y-3">
                                <p className="text-xs text-zinc-500 uppercase font-bold tracking-wide">Select a Template</p>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[350px] overflow-y-auto pr-2">
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
                            <div className="space-y-6">
                                {/* QR Color */}
                                <div className="space-y-3">
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
                                <div className="space-y-3">
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

                        {/* Logo Tab */}
                        {activeTab === 'logo' && (
                            <div className="space-y-6 animate-in slide-in-from-bottom-2 duration-300">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-zinc-300">Center Logo</label>
                                    {!logo ? (
                                        <div
                                            onClick={() => logoInputRef.current?.click()}
                                            className="group py-10 border-2 border-dashed border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 hover:border-amber-500/50 transition-all cursor-pointer text-center"
                                        >
                                            <Upload className="mx-auto text-zinc-500 mb-3 group-hover:text-amber-500 group-hover:scale-110 transition-all" size={32} />
                                            <p className="text-sm font-bold text-zinc-400 group-hover:text-zinc-200">Upload Logo Image</p>
                                            <p className="text-xs text-zinc-600 mt-1">PNG or JPG, square recommended</p>
                                        </div>
                                    ) : (
                                        <div className="relative p-4 bg-zinc-800 rounded-2xl border border-white/10 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-16 h-16 bg-white rounded-lg p-1 overflow-hidden shadow-xl">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img src={logo} alt="Logo preview" className="w-full h-full object-contain" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-white uppercase tracking-wider">Logo Uploaded</span>
                                                    <span className="text-xs text-zinc-500">Center position</span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setLogo(null)}
                                                className="p-2 bg-rose-500/20 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                            >
                                                <X size={20} />
                                            </button>
                                        </div>
                                    )}
                                    <input
                                        type="file"
                                        ref={logoInputRef}
                                        onChange={handleLogoUpload}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>

                                {logo && (
                                    <div className="space-y-3">
                                        <div className="flex justify-between">
                                            <label className="text-sm font-bold text-zinc-300">Logo Size</label>
                                            <span className="text-xs font-mono text-amber-500">{logoSize}px</span>
                                        </div>
                                        <input
                                            type="range"
                                            min="20"
                                            max="100"
                                            value={logoSize}
                                            onChange={(e) => setLogoSize(parseInt(e.target.value))}
                                            className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-amber-600"
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300">Resolution: {size}px</label>
                            <input
                                type="range"
                                min="128"
                                max="1024"
                                step="64"
                                value={size}
                                onChange={(e) => setSize(parseInt(e.target.value))}
                                className="w-full h-2 bg-zinc-700 rounded-lg cursor-pointer accent-amber-600"
                            />
                        </div>
                    </div>

                    {/* Preview Section */}
                    <div className="flex flex-col items-center justify-center space-y-8">
                        <div
                            ref={qrRef}
                            className="p-8 rounded-[2.5rem] shadow-2xl border border-white/10 transition-all bg-white relative overflow-hidden group"
                            style={{ backgroundColor: bgColor }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
                            {text ? (
                                <QRCodeCanvas
                                    value={text}
                                    size={Math.min(size, 400)}
                                    fgColor={fgColor}
                                    bgColor={bgColor}
                                    level="H"
                                    imageSettings={logo ? {
                                        src: logo,
                                        height: logoSize,
                                        width: logoSize,
                                        excavate: true,
                                    } : undefined}
                                    className="relative z-10 mx-auto"
                                    style={{ width: '100%', height: 'auto', maxWidth: '300px' }}
                                />
                            ) : (
                                <div className="w-[300px] h-[300px] flex items-center justify-center text-zinc-400 italic">
                                    Enter content to generate...
                                </div>
                            )}
                        </div>

                        {/* Current Colors Display */}
                        <div className="flex items-center gap-6 p-4 bg-zinc-800/40 backdrop-blur-md rounded-2xl border border-white/5">
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md border border-white/10 shadow-lg" style={{ backgroundColor: fgColor }} />
                                <span className="text-xs font-mono font-bold text-zinc-300">{fgColor.toUpperCase()}</span>
                            </div>
                            <div className="w-px h-4 bg-white/10" />
                            <div className="flex items-center gap-2">
                                <div className="w-5 h-5 rounded-md border border-white/10 shadow-lg" style={{ backgroundColor: bgColor }} />
                                <span className="text-xs font-mono font-bold text-zinc-300">{bgColor.toUpperCase()}</span>
                            </div>
                        </div>

                        <div className="flex gap-4 flex-wrap justify-center w-full">
                            <button
                                onClick={downloadQR}
                                disabled={!text}
                                className="flex-1 min-w-[180px] bg-gradient-to-r from-amber-500 to-amber-600 text-white px-8 py-5 rounded-2xl font-black text-lg hover:from-amber-600 hover:to-amber-700 transition-all flex items-center justify-center gap-3 cursor-pointer shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                            >
                                <Download size={22} className="group-hover:translate-y-1 transition-transform" /> Download PNG
                            </button>
                            <button
                                onClick={copyToClipboard}
                                className="bg-zinc-800 text-zinc-300 px-8 py-5 rounded-2xl font-bold hover:bg-zinc-700 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/5 active:scale-95"
                            >
                                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} />}
                                {copied ? 'Copied!' : 'Copy Text'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <RelatedTools />
        </div>
    );
}
