"use client";
import { useState } from 'react';
import { ArrowRightLeft, Copy, Check } from 'lucide-react';

export default function ColorConverter() {
    const [hex, setHex] = useState('#3B82F6');
    const [copied, setCopied] = useState(null);

    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    const rgbToHsl = (r, g, b) => {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;
        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
                case g: h = ((b - r) / d + 2) / 6; break;
                case b: h = ((r - g) / d + 4) / 6; break;
            }
        }
        return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const rgb = hexToRgb(hex);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

    const copyValue = (value, key) => {
        navigator.clipboard.writeText(value);
        setCopied(key);
        setTimeout(() => setCopied(null), 2000);
    };

    const formats = rgb && hsl ? [
        { label: 'HEX', value: hex.toUpperCase() },
        { label: 'RGB', value: `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` },
        { label: 'RGBA', value: `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` },
        { label: 'HSL', value: `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` },
        { label: 'HSLA', value: `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 1)` },
    ] : [];

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Color Converter</h1>
                <p className="text-black text-lg">Convert between HEX, RGB, HSL and more.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    {/* Color Preview */}
                    <div
                        className="h-48 rounded-2xl shadow-inner"
                        style={{ backgroundColor: hex }}
                    />

                    {/* Input */}
                    <div className="space-y-4">
                        <label className="text-sm font-bold text-black block">Enter a color (HEX)</label>
                        <div className="flex gap-3">
                            <input
                                type="color"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                                className="w-16 h-14 rounded-xl cursor-pointer"
                            />
                            <input
                                type="text"
                                value={hex}
                                onChange={(e) => setHex(e.target.value)}
                                className="flex-grow px-6 py-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-pink-500 outline-none font-mono text-lg uppercase text-black"
                                placeholder="#000000"
                            />
                        </div>
                    </div>
                </div>

                {/* Conversions */}
                <div className="space-y-3">
                    {formats.map((format) => (
                        <div key={format.label} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                            <div>
                                <p className="text-xs text-black uppercase font-bold">{format.label}</p>
                                <p className="font-mono font-bold text-black">{format.value}</p>
                            </div>
                            <button
                                onClick={() => copyValue(format.value, format.label)}
                                className="p-3 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                            >
                                {copied === format.label ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="text-slate-400" />}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
