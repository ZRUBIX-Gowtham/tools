"use client";

import { useState, useRef, useCallback } from 'react';
import { QrCode, Download, Copy, Check, Palette, Layout, Upload, X, Image as ImageIcon, Link2 } from 'lucide-react';
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

export default function GeneratorMode({ initialFgColor = '#000000', initialBgColor = '#ffffff' }) {
    const [text, setText] = useState('https://toolshub.onslate.com');
    const [size, setSize] = useState(256);
    const [copied, setCopied] = useState(false);
    const [urlCopied, setUrlCopied] = useState(false);
    const [fgColor, setFgColor] = useState(initialFgColor);
    const [bgColor, setBgColor] = useState(initialBgColor);
    const [activeTab, setActiveTab] = useState('custom');
    const [logo, setLogo] = useState(null);
    const [logoSize, setLogoSize] = useState(50);
    const [showUrlPopup, setShowUrlPopup] = useState(false);
    const [includeColor, setIncludeColor] = useState(true);
    const [includeBgColor, setIncludeBgColor] = useState(true);
    const [includeLogo, setIncludeLogo] = useState(true);
    const [logoUrl, setLogoUrl] = useState('');
    const qrRef = useRef(null);
    const logoInputRef = useRef(null);

    // Generate shareable URL with current settings
    const getShareableUrl = useCallback(() => {
        if (typeof window === 'undefined') return '';

        // Ensure we construct the URL correctly
        const baseUrl = window.location.origin + window.location.pathname;
        const params = new URLSearchParams();

        if (text) {
            params.set('name', text);
        }

        // Remove # from color codes for URL
        if (includeColor) {
            params.set('color', fgColor.replace('#', ''));
        }

        if (includeBgColor) {
            params.set('bgcolor', bgColor.replace('#', ''));
        }

        // Only include logo if enabled and it's NOT a base64 data URL (uploads are too big)
        if (includeLogo && logo && !logo.startsWith('data:')) {
            params.set('logo', logo);
        }

        return `${baseUrl}?${params.toString()}`;
    }, [text, fgColor, bgColor, includeColor, includeBgColor, includeLogo, logo]);

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
                setLogoUrl(''); // Clear URL input if file is uploaded
            };
            reader.readAsDataURL(file);
        }
    };

    const handleLogoUrlChange = (e) => {
        const url = e.target.value;
        setLogoUrl(url);
        setLogo(url || null); // Set logo immediately to the URL, clear if empty
    };

    const downloadQR = () => {
        try {
            const canvas = qrRef.current.querySelector('canvas');
            if (!canvas) return;

            const url = canvas.toDataURL('image/png');
            const link = document.createElement('a');
            link.href = url;
            link.download = 'qrcode.png';
            link.click();
        } catch (err) {
            console.error('Download failed:', err);
            alert("Failed to download QR Code. If you are using an external image URL for the logo, the browser may be blocking it for security reasons (CORS). Please try uploading the image file instead.");
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

                                    {/* Logo URL Input */}
                                    <div className="space-y-2">
                                        <input
                                            type="text"
                                            value={logoUrl}
                                            onChange={handleLogoUrlChange}
                                            placeholder="Paste image URL here..."
                                            className="w-full px-4 py-3 rounded-xl bg-zinc-800 border border-white/5 focus:border-amber-500 outline-none text-sm text-white placeholder-zinc-500"
                                        />
                                        <div className="flex items-center gap-2">
                                            <div className="h-px flex-1 bg-white/10"></div>
                                            <span className="text-xs text-zinc-500 uppercase font-bold">OR</span>
                                            <div className="h-px flex-1 bg-white/10"></div>
                                        </div>
                                    </div>

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
                                                onClick={() => {
                                                    setLogo(null);
                                                    setLogoUrl('');
                                                }}
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
                            <label className="text-sm font-bold text-zinc-300">Resolution : {size}px</label>
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
                            <button
                                onClick={() => setShowUrlPopup(true)}
                                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-5 rounded-2xl font-bold hover:from-blue-600 hover:to-blue-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg active:scale-95"
                            >
                                <Link2 size={20} /> Get URL
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
                                    <p className="text-sm text-zinc-400">Share this link to generate the same QR code</p>
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
                                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-green-400 font-mono text-sm font-bold">color</span>
                                            {includeColor ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-md border border-white/10" style={{ backgroundColor: fgColor }} />
                                                    <span className="text-zinc-300 text-sm font-mono">{fgColor.replace('#', '')}</span>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-500 text-sm italic">Excluded</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setIncludeColor(!includeColor)}
                                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${includeColor ? 'bg-green-500' : 'bg-zinc-700'}`}
                                            title="Toggle Parameter"
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${includeColor ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between p-3 bg-zinc-900/50 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <span className="text-purple-400 font-mono text-sm font-bold">bgcolor</span>
                                            {includeBgColor ? (
                                                <div className="flex items-center gap-2">
                                                    <div className="w-5 h-5 rounded-md border border-white/10" style={{ backgroundColor: bgColor }} />
                                                    <span className="text-zinc-300 text-sm font-mono">{bgColor.replace('#', '')}</span>
                                                </div>
                                            ) : (
                                                <span className="text-zinc-500 text-sm italic">Excluded</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => setIncludeBgColor(!includeBgColor)}
                                            className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${includeBgColor ? 'bg-purple-500' : 'bg-zinc-700'}`}
                                            title="Toggle Parameter"
                                        >
                                            <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${includeBgColor ? 'translate-x-6' : 'translate-x-0'}`} />
                                        </button>
                                    </div>

                                    {/* Logo Parameter Toggle */}
                                    {logo && (
                                        <>
                                            {!logo.startsWith('data:') ? (
                                                <div className="flex flex-col gap-2 p-3 bg-zinc-900/50 rounded-xl animate-in slide-in-from-top-2">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <span className="text-amber-400 font-mono text-sm font-bold">logo</span>
                                                            <button
                                                                onClick={() => setIncludeLogo(!includeLogo)}
                                                                className={`relative w-12 h-6 rounded-full transition-colors cursor-pointer ${includeLogo ? 'bg-amber-500' : 'bg-zinc-700'}`}
                                                                title="Toggle Parameter"
                                                            >
                                                                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${includeLogo ? 'translate-x-6' : 'translate-x-0'}`} />
                                                            </button>
                                                        </div>
                                                        {includeLogo ? (
                                                            <span className="text-zinc-500 text-xs italic">Included</span>
                                                        ) : (
                                                            <span className="text-zinc-500 text-xs italic">Excluded</span>
                                                        )}
                                                    </div>

                                                    {includeLogo && (
                                                        <div className="text-xs text-zinc-400 font-mono break-all bg-black/20 p-2 rounded-lg border border-white/5">
                                                            {logo}
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex gap-3 items-start animate-in slide-in-from-top-2">
                                                    <div className="p-1 bg-amber-500/20 rounded-lg mt-0.5">
                                                        <ImageIcon size={14} className="text-amber-500" />
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-amber-200 mb-0.5">Logo Not Included</p>
                                                        <p className="text-[10px] leading-relaxed text-amber-500/80">
                                                            Uploaded images cannot be part of the shareable URL. To include a logo in the link, please use the <b>Paste Image URL</b> option in the Logo tab instead.
                                                        </p>
                                                    </div>
                                                </div>
                                            )}
                                        </>
                                    )}
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
