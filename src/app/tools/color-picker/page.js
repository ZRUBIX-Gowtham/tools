"use client";
import { useState, useRef } from 'react';
import { Pipette, Copy, Check } from 'lucide-react';

export default function ColorPicker() {
    const [color, setColor] = useState('#3B82F6');
    const [copied, setCopied] = useState(false);
    const [imageColors, setImageColors] = useState([]);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

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

    const rgb = hexToRgb(color);
    const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const img = new Image();
            img.onload = () => {
                const canvas = canvasRef.current;
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
            };
            img.src = URL.createObjectURL(file);
        }
    };

    const pickColorFromCanvas = (e) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const rect = canvas.getBoundingClientRect();
        const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
        const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));
        const pixel = ctx.getImageData(x, y, 1, 1).data;
        const hex = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('');
        setColor(hex);
        setImageColors(prev => [hex, ...prev.slice(0, 7)]);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Color Picker</h1>
                <p className="text-zinc-400 text-lg">Pick colors from images or choose from the palette.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Color Picker */}
                    <div className="space-y-6">
                        <div
                            className="w-full h-48 rounded-2xl shadow-inner"
                            style={{ backgroundColor: color }}
                        />
                        <input
                            type="color"
                            value={color}
                            onChange={(e) => setColor(e.target.value)}
                            className="w-full h-12 rounded-xl cursor-pointer"
                        />
                    </div>

                    {/* Color Values */}
                    <div className="space-y-4">
                        <div className="p-4 bg-zinc-800/50 rounded-xl flex items-center justify-between border border-white/10">
                            <div>
                                <p className="text-xs text-zinc-400 uppercase font-bold">HEX</p>
                                <p className="font-mono font-bold text-white">{color.toUpperCase()}</p>
                            </div>
                            <button onClick={() => copyToClipboard(color)} className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
                                {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="text-zinc-400" />}
                            </button>
                        </div>
                        {rgb && (
                            <div className="p-4 bg-zinc-800/50 rounded-xl flex items-center justify-between border border-white/10">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">RGB</p>
                                    <p className="font-mono font-bold text-white">rgb({rgb.r}, {rgb.g}, {rgb.b})</p>
                                </div>
                                <button onClick={() => copyToClipboard(`rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`)} className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
                                    <Copy size={20} className="text-zinc-400" />
                                </button>
                            </div>
                        )}
                        {hsl && (
                            <div className="p-4 bg-zinc-800/50 rounded-xl flex items-center justify-between border border-white/10">
                                <div>
                                    <p className="text-xs text-zinc-400 uppercase font-bold">HSL</p>
                                    <p className="font-mono font-bold text-white">hsl({hsl.h}, {hsl.s}%, {hsl.l}%)</p>
                                </div>
                                <button onClick={() => copyToClipboard(`hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`)} className="p-2 hover:bg-zinc-700/50 rounded-lg transition-colors">
                                    <Copy size={20} className="text-zinc-400" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Image Color Picker */}
                <div className="mt-8 pt-8 border-t border-white/10">
                    <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                        <Pipette size={20} /> Pick from Image
                    </h3>
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-zinc-400 hover:border-pink-500 hover:text-pink-400 transition-all bg-white/5 hover:bg-pink-500/5"
                    >
                        Upload an image to pick colors
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                    <canvas
                        ref={canvasRef}
                        onClick={pickColorFromCanvas}
                        className="mt-4 max-w-full max-h-[300px] rounded-xl cursor-crosshair mx-auto hidden"
                        style={{ display: 'block' }}
                    />

                    {imageColors.length > 0 && (
                        <div className="mt-4">
                            <p className="text-sm text-zinc-400 mb-2">Recently picked:</p>
                            <div className="flex gap-2 flex-wrap">
                                {imageColors.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setColor(c)}
                                        className="w-10 h-10 rounded-lg shadow-md border-2 border-white"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
