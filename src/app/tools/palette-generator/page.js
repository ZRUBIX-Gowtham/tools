"use client";
import { useState } from 'react';
import { Palette, RefreshCw, Copy, Check, Lock, Unlock } from 'lucide-react';

export default function PaletteGenerator() {
    const [colors, setColors] = useState([
        { hex: '#3B82F6', locked: false },
        { hex: '#10B981', locked: false },
        { hex: '#F59E0B', locked: false },
        { hex: '#EF4444', locked: false },
        { hex: '#8B5CF6', locked: false },
    ]);
    const [copied, setCopied] = useState(null);

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

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Palette Generator</h1>
                <p className="text-slate-500 text-lg">Generate beautiful color palettes instantly.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-6 shadow-xl">
                <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
                    {colors.map((color, index) => (
                        <div key={index} className="space-y-3">
                            <div
                                className="aspect-[3/4] rounded-2xl shadow-lg relative group cursor-pointer transition-transform hover:scale-105"
                                style={{ backgroundColor: color.hex }}
                            >
                                <div className="absolute inset-x-0 bottom-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-t from-black/50 to-transparent rounded-b-2xl">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => toggleLock(index)}
                                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                        >
                                            {color.locked ? <Lock size={16} className="text-slate-700" /> : <Unlock size={16} className="text-slate-400" />}
                                        </button>
                                        <button
                                            onClick={() => copyColor(color.hex, index)}
                                            className="p-2 bg-white/90 rounded-lg hover:bg-white transition-colors"
                                        >
                                            {copied === index ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} className="text-slate-400" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <p className="font-mono text-xs font-bold text-center text-slate-600 uppercase">{color.hex}</p>
                        </div>
                    ))}
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={generatePalette}
                        className="bg-slate-900 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all shadow-xl flex items-center gap-3"
                    >
                        <RefreshCw size={20} /> Generate Palette
                    </button>
                </div>

                <p className="text-center text-slate-400 text-sm mt-4">Press spacebar or click the button to generate. Lock colors to keep them.</p>
            </div>
        </div>
    );
}
