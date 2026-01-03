"use client";
import { useState, useRef } from 'react';
import { Palette, RefreshCw, Copy, Check, Lock, Unlock, Upload, Image as ImageIcon, Loader2 } from 'lucide-react';

export default function PaletteGenerator() {
    const [colors, setColors] = useState([
        { hex: '#3B82F6', locked: false },
        { hex: '#10B981', locked: false },
        { hex: '#F59E0B', locked: false },
        { hex: '#EF4444', locked: false },
        { hex: '#8B5CF6', locked: false },
    ]);
    const [copied, setCopied] = useState(null);
    const [isExtracting, setIsExtracting] = useState(false);
    const fileInputRef = useRef(null);

    const generateColor = () => {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    };

    const generatePalette = () => {
        setColors(colors.map(c => c.locked ? c : { ...c, hex: generateColor() }));
    };

    const toggleLock = (index) => {
        setColors(colors.map((c, i) => i === index ? { ...c, locked: !c.locked } : c));
    };

    const copyColor = (hex, index) => {
        navigator.clipboard.writeText(hex);
        setCopied(index);
        setTimeout(() => setCopied(null), 2000);
    };

    const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');

    const extractPaletteFromImage = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setIsExtracting(true);
        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            // Resize for performance
            const maxDimension = 100;
            const scale = Math.min(1, maxDimension / img.width, maxDimension / img.height);
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
            const colorCounts = {};

            // Simple quantization (step 10)
            for (let i = 0; i < imageData.length; i += 4) {
                if (imageData[i + 3] < 128) continue; // Skip transparent
                const r = Math.round(imageData[i] / 10) * 10;
                const g = Math.round(imageData[i + 1] / 10) * 10;
                const b = Math.round(imageData[i + 2] / 10) * 10;
                const key = `${r},${g},${b}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            // Sort by frequency
            const sortedColors = Object.entries(colorCounts)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([key]) => {
                    const [r, g, b] = key.split(',').map(Number);
                    return { hex: rgbToHex(r, g, b), locked: false };
                });

            // Fill if less than 5
            while (sortedColors.length < 5) {
                sortedColors.push({ hex: generateColor(), locked: false });
            }

            setColors(sortedColors);
            setIsExtracting(false);
        };
        img.src = URL.createObjectURL(file);
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Palette Generator</h1>
                <p className="text-zinc-400 text-lg">Generate beautiful color palettes instantly or extract from images.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 md:gap-4 mb-6">
                    {colors.map((color, index) => (
                        <div key={index} className={`space-y-3 ${index >= 2 ? 'col-span-1' : 'col-span-1'} ${index === 4 ? 'col-span-2 md:col-span-1' : ''}`}>
                            <div
                                className="aspect-[3/4] rounded-2xl shadow-lg relative group cursor-pointer transition-transform hover:scale-105 border border-white/5"
                                style={{ backgroundColor: color.hex }}
                            >
                                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent rounded-b-2xl">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toggleLock(index); }}
                                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
                                        >
                                            {color.locked ? <Lock size={16} className="text-zinc-700" /> : <Unlock size={16} className="text-zinc-400" />}
                                        </button>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); copyColor(color.hex, index); }}
                                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors shadow-sm"
                                        >
                                            {copied === index ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-zinc-400" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="font-mono text-xs font-bold text-center text-zinc-400 uppercase">{color.hex}</p>
                        </div>
                    ))}
                </div>

                <div className="flex flex-col md:flex-row justify-center gap-4 mt-8">
                    <button
                        onClick={generatePalette}
                        className="bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                    >
                        <RefreshCw size={20} /> Generate Random
                    </button>

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isExtracting}
                        className="bg-zinc-800 text-zinc-300 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-zinc-700 hover:text-white transition-all shadow-lg flex items-center justify-center gap-3 cursor-pointer"
                    >
                        {isExtracting ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                        Extract from Image
                    </button>
                    <input type="file" ref={fileInputRef} onChange={extractPaletteFromImage} className="hidden" accept="image/*" />
                </div>

                <p className="text-center text-zinc-500 text-sm mt-6">
                    Click Generate or Upload an image. Lock colors to keep them.
                </p>
            </div>
        </div>
    );
}

