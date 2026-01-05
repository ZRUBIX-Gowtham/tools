"use client";
import { useState, useEffect } from 'react';
import { Download, Settings, Copy, Sparkles } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function TextToSvg() {
    const [text, setText] = useState('Hello');
    const [fontFamily, setFontFamily] = useState('sans-serif');
    const [fontSize, setFontSize] = useState(100);
    const [letterSpacing, setLetterSpacing] = useState(0);
    const [universalColor, setUniversalColor] = useState(true);
    const [singleColor, setSingleColor] = useState('#ffffff');
    const [charColors, setCharColors] = useState(['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']);
    const [previewContent, setPreviewContent] = useState('');

    const fonts = [
        { name: 'Sans Serif', value: 'sans-serif' },
        { name: 'Serif', value: 'serif' },
        { name: 'Monospace', value: 'monospace' },
        { name: 'Cursive', value: 'cursive' },
        { name: 'Fantasy', value: 'fantasy' },
        { name: 'System UI', value: 'system-ui' },
        { name: 'Arial', value: 'Arial, sans-serif' },
        { name: 'Times New Roman', value: '"Times New Roman", serif' },
        { name: 'Courier New', value: '"Courier New", monospace' },
        { name: 'Georgia', value: 'Georgia, serif' },
        { name: 'Verdana', value: 'Verdana, sans-serif' },
        { name: 'Trebuchet MS', value: '"Trebuchet MS", sans-serif' },
        { name: 'Impact', value: 'Impact, sans-serif' }
    ];

    // Update charColors array when text length changes
    useEffect(() => {
        setCharColors(prev => {
            const newColors = [...prev];
            if (text.length > prev.length) {
                // Add new colors (inherit last or default white)
                for (let i = prev.length; i < text.length; i++) {
                    newColors.push('#ffffff');
                }
            } else if (text.length < prev.length) {
                // Trim
                newColors.length = text.length;
            }
            return newColors;
        });
    }, [text]);

    // Generate SVG Content
    useEffect(() => {
        generateSvg();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [text, fontFamily, fontSize, letterSpacing, universalColor, singleColor, charColors]);

    const generateSvg = () => {
        const width = 500;
        const height = 500;

        let textContent = '';

        if (universalColor) {
            textContent = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="${singleColor}" font-family='${fontFamily}' font-size="${fontSize}" letter-spacing="${letterSpacing}">${text}</text>`;
        } else {
            const spans = text.split('').map((char, index) => {
                return `<tspan fill="${charColors[index] || '#ffffff'}">${char}</tspan>`;
            }).join('');
            textContent = `<text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-family='${fontFamily}' font-size="${fontSize}" letter-spacing="${letterSpacing}">${spans}</text>`;
        }

        const svg = `<svg width="100%" height="100%" viewBox="0 0 ${width} ${height}" version="1.1" xmlns="http://www.w3.org/2000/svg">
    ${textContent}
</svg>`;

        setPreviewContent(svg);
    };

    const updateCharColor = (index, color) => {
        const newColors = [...charColors];
        newColors[index] = color;
        setCharColors(newColors);
    };

    const randomizeColors = () => {
        const randomHex = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        if (universalColor) {
            setSingleColor(randomHex());
        } else {
            const newColors = charColors.map(() => randomHex());
            setCharColors(newColors);
        }
    };

    const downloadSvg = () => {
        const blob = new Blob([previewContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `text-${Date.now()}.svg`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const copySvg = () => {
        navigator.clipboard.writeText(previewContent);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Text to SVG Generator</h1>
                <p className="text-zinc-400 text-lg">Create customizable SVG text with gradients and colors.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Preview Area */}
                <div className="lg:col-span-2 order-2 lg:order-1">
                    <div className="bg-zinc-950/10 rounded-2xl border border-white/5 flex items-center justify-center min-h-[600px] p-8">
                        <div
                            className="bg-zinc-900/50 rounded-xl flex items-center justify-center p-4 overflow-hidden relative border border-white/10 shadow-2xl"
                            style={{ width: '500px', height: '500px', maxWidth: '100%', aspectRatio: '1/1' }}
                        >
                            {/* Checkerboard */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none"
                                style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                            />

                            <div
                                className="relative z-10 w-full h-full flex items-center justify-center"
                                dangerouslySetInnerHTML={{ __html: previewContent }}
                            />
                        </div>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="lg:col-span-1 order-1 lg:order-2 bg-zinc-800/30 rounded-2xl border border-white/5 p-6 flex flex-col gap-6 h-fit">
                    <div>
                        <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                            <Settings size={20} className="text-blue-500" /> Settings
                        </h3>

                        {/* Text Input */}
                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2">Text Content</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                className="w-full bg-zinc-900 text-white px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500 outline-none"
                                placeholder="Type something..."
                            />
                        </div>

                        {/* Font Settings */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2">Font Family</label>
                                <select
                                    value={fontFamily}
                                    onChange={(e) => setFontFamily(e.target.value)}
                                    className="w-full bg-zinc-900 text-white px-3 py-3 rounded-xl border border-white/10 outline-none cursor-pointer text-sm"
                                >
                                    {fonts.map(f => (
                                        <option key={f.value} value={f.value}>{f.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-zinc-400 text-sm mb-2">Size</label>
                                <input
                                    type="number"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(parseInt(e.target.value) || 0)}
                                    className="w-full bg-zinc-900 text-white px-3 py-3 rounded-xl border border-white/10 focus:border-blue-500 outline-none text-sm"
                                />
                            </div>
                        </div>

                        {/* Letter Spacing */}
                        <div className="mb-4">
                            <label className="block text-zinc-400 text-sm mb-2 justify-between flex">
                                <span>Letter Spacing</span>
                                <span className="text-zinc-500">{letterSpacing}px</span>
                            </label>
                            <input
                                type="range"
                                min="-20"
                                max="100"
                                value={letterSpacing}
                                onChange={(e) => setLetterSpacing(Number(e.target.value))}
                                className="w-full h-2 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-blue-500"
                            />
                        </div>

                        {/* Color Mode Toggle & Randomizer */}
                        <div className="flex items-center justify-between mb-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                            <span className="text-sm text-zinc-300 font-medium">Universal Color</span>
                            <div className="flex gap-2 items-center">
                                <button
                                    onClick={randomizeColors}
                                    className="p-2 rounded-lg bg-zinc-700 hover:bg-pink-600 hover:text-white text-zinc-400 transition-colors shadow-lg cursor-pointer"
                                    title="Randomize Colors"
                                >
                                    <Sparkles size={16} />
                                </button>
                                <button
                                    onClick={() => setUniversalColor(!universalColor)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${universalColor ? 'bg-blue-500/20 text-blue-400' : 'bg-zinc-700 text-zinc-400'}`}
                                >
                                    {universalColor ? 'ON' : 'OFF'}
                                </button>
                            </div>
                        </div>

                        {/* Color Pickers */}
                        <div className="max-h-[300px] overflow-y-auto custom-scrollbar pr-2 mb-4">
                            {universalColor ? (
                                <div className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                    <span className="text-sm text-zinc-400">Text Color</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-mono text-zinc-500 uppercase">{singleColor}</span>
                                        <input
                                            type="color"
                                            value={singleColor}
                                            onChange={(e) => setSingleColor(e.target.value)}
                                            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                        />
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    {text.split('').map((char, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-zinc-900/50 p-2 rounded-lg border border-white/5">
                                            <span className="font-bold text-white w-6 text-center">{char}</span>
                                            <input
                                                type="color"
                                                value={charColors[idx] || '#ffffff'}
                                                onChange={(e) => updateCharColor(idx, e.target.value)}
                                                className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                            />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-3">
                            <button
                                onClick={downloadSvg}
                                className="w-full bg-blue-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-blue-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                            >
                                <Download size={20} /> Download SVG
                            </button>
                            <button
                                onClick={copySvg}
                                className="w-full bg-zinc-800 text-zinc-300 px-6 py-3 rounded-xl font-bold hover:bg-zinc-700 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                            >
                                <Copy size={18} /> Copy Code
                            </button>
                        </div>

                    </div>
                </div>
            </div>

            <RelatedTools />
        </div>
    );
}
