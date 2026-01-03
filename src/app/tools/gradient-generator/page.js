"use client";
import { useState } from 'react';
import { Paintbrush, Copy, Check, RefreshCw } from 'lucide-react';

export default function GradientGenerator() {
    const [color1, setColor1] = useState('#3B82F6');
    const [color2, setColor2] = useState('#8B5CF6');
    const [angle, setAngle] = useState(90);
    const [copied, setCopied] = useState(false);

    const gradient = `linear-gradient(${angle}deg, ${color1}, ${color2})`;
    const cssCode = `background: ${gradient};`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(cssCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const randomGradient = () => {
        const randomColor = () => '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
        setColor1(randomColor());
        setColor2(randomColor());
        setAngle(Math.floor(Math.random() * 360));
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Gradient Generator</h1>
                <p className="text-zinc-400 text-lg">Create stunning CSS gradients for your projects.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {/* Preview */}
                <div
                    className="w-full h-64 rounded-2xl shadow-inner mb-8"
                    style={{ background: gradient }}
                />

                {/* Controls */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">Color 1</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color1}
                                onChange={(e) => setColor1(e.target.value)}
                                className="w-16 h-12 rounded-lg cursor-pointer border border-white/10 bg-transparent p-1"
                            />
                            <input
                                type="text"
                                value={color1}
                                onChange={(e) => setColor1(e.target.value)}
                                className="flex-grow px-4 py-2 rounded-xl bg-zinc-800 font-mono text-sm text-white border border-white/5 uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">Color 2</label>
                        <div className="flex gap-2">
                            <input
                                type="color"
                                value={color2}
                                onChange={(e) => setColor2(e.target.value)}
                                className="w-16 h-12 rounded-lg cursor-pointer border border-white/10 bg-transparent p-1"
                            />
                            <input
                                type="text"
                                value={color2}
                                onChange={(e) => setColor2(e.target.value)}
                                className="flex-grow px-4 py-2 rounded-xl bg-zinc-800 font-mono text-sm text-white border border-white/5 uppercase"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-zinc-300">Angle: {angle}°</label>
                        <input
                            type="range"
                            min="0"
                            max="360"
                            value={angle}
                            onChange={(e) => setAngle(parseInt(e.target.value))}
                            className="w-full h-12 rounded-lg cursor-pointer accent-pink-600 bg-zinc-700"
                        />
                    </div>
                </div>

                {/* CSS Code */}
                <div className="bg-zinc-950 rounded-xl p-4 mb-6 border border-white/10">
                    <div className="flex items-center justify-between">
                        <code className="text-emerald-400 font-mono text-sm">{cssCode}</code>
                        <button onClick={copyToClipboard} className="p-2 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer">
                            {copied ? <Check size={20} className="text-emerald-400" /> : <Copy size={20} className="text-slate-400" />}
                        </button>
                    </div>
                </div>

                <div className="flex justify-center">
                    <button
                        onClick={randomGradient}
                        className="bg-zinc-800 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-600 transition-all shadow-lg flex items-center gap-3 cursor-pointer"
                    >
                        <RefreshCw size={20} /> Random Gradient
                    </button>
                </div>
            </div>
        </div>
    );
}
