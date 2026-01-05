"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, X, Palette, Download, RefreshCcw, Check } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';

export default function SvgColorChanger() {
    const [file, setFile] = useState(null);
    const [originalContent, setOriginalContent] = useState(null);
    const [modifiedContent, setModifiedContent] = useState(null);
    const [colors, setColors] = useState([]);
    const [originalColors, setOriginalColors] = useState({}); // map working color -> original color value found
    const [showStroke, setShowStroke] = useState(true);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'image/svg+xml') {
            setFile(selectedFile);
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                setOriginalContent(content);
                setModifiedContent(content);
                extractColors(content);
                setShowStroke(true); // Reset stroke visibility on new file
            };
            reader.readAsText(selectedFile);
        }
    };

    const extractColors = (svgString) => {
        // Regex to find colors in fill, stroke, or style attributes
        // Matches hex codes, rgb/rgba, and some common names (simplified)
        // Focusing on Hex and RGB for reasonable color picker support
        const colorRegex = /(#[0-9a-fA-F]{3,6}|rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)|rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d\.]+\s*\))/gi;

        const found = svgString.match(colorRegex) || [];
        const uniqueColors = [...new Set(found.map(c => c.toLowerCase()))];

        setColors(uniqueColors.map(c => ({ original: c, current: c })));
    };

    const toggleStroke = () => {
        const newStrokeState = !showStroke;
        setShowStroke(newStrokeState);
        // We need to re-apply color changes AND the new stroke state
        applyChanges(colors, newStrokeState);
    };

    const updateColor = (index, newColor) => {
        const newColors = [...colors];
        newColors[index].current = newColor;
        setColors(newColors);
        applyChanges(newColors, showStroke);
    };

    const applyChanges = (currentColors, isStrokeVisible = true) => {
        let content = originalContent;

        // 1. Apply Color Replacements
        currentColors.forEach(color => {
            if (color.current !== color.original) {
                const regex = new RegExp(escapeRegExp(color.original), 'gi');
                content = content.replace(regex, color.current);
            }
        });

        // 2. Handle Stroke Visibility
        if (!isStrokeVisible) {
            // Replace stroke attributes with none
            content = content.replace(/stroke="[^"]*"/gi, 'stroke="none"');
            // Also try to hit inline styles (simplified)
            content = content.replace(/stroke:[^;"]+/gi, 'stroke:none');
        }

        setModifiedContent(content);
    };

    const escapeRegExp = (string) => {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const downloadSvg = () => {
        if (!modifiedContent || !file) return;
        const blob = new Blob([modifiedContent], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `colored-${file.name}`;
        link.click();
        URL.revokeObjectURL(url);
    };

    const reset = () => {
        setFile(null);
        setOriginalContent(null);
        setModifiedContent(null);
        setColors([]);
    };

    const getPreviewSvg = (svgString) => {
        if (!svgString) return "";
        // Normalize logic from VectorConverter to ensure it fits the 500x500 box
        let width = 1000, height = 1000;
        const wMatch = svgString.match(/width="([\d\.]+)"/i);
        const hMatch = svgString.match(/height="([\d\.]+)"/i);
        const vbMatch = svgString.match(/viewBox="([^"]*)"/i);

        if (wMatch) width = parseFloat(wMatch[1]);
        if (hMatch) height = parseFloat(hMatch[1]);
        let viewBox = vbMatch ? vbMatch[1] : `0 0 ${width} ${height}`;

        // Return new SVG string with forced 100% dimensions and preserveAspectRatio
        return svgString.replace(
            /<svg[^>]*>/i,
            `<svg width="100%" height="100%" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">SVG Color Changer</h1>
                <p className="text-zinc-400 text-lg">Easily recolor vector icons and illustrations.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-6 md:p-8 shadow-xl backdrop-blur-xl min-h-[600px] flex flex-col">
                {!file ? (
                    <div className="flex-1 flex flex-col items-center justify-center py-20 border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-pink-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Palette size={32} className="text-pink-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-pink-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-pink-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select SVG File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/svg+xml" />
                        <p className="text-zinc-500 mt-4 text-sm">Upload .svg to change colors</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
                        {/* Preview Area */}
                        <div className="lg:col-span-2 flex flex-col gap-4">
                            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-xl border border-white/5">
                                <span className="font-bold text-white flex items-center gap-2">
                                    <Check size={18} className="text-green-500" /> Preview
                                </span>
                                <button onClick={reset} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="flex-1 bg-zinc-950/10 rounded-2xl border border-white/5 flex items-center justify-center min-h-[600px] p-8">
                                <div
                                    className="bg-zinc-900/50 rounded-xl flex items-center justify-center p-4 overflow-hidden relative border border-white/10 shadow-2xl"
                                    style={{ width: '500px', height: '500px', maxWidth: '100%', aspectRatio: '1/1' }}
                                >
                                    {/* Checkerboard */}
                                    <div className="absolute inset-0 opacity-20 pointer-events-none"
                                        style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }}
                                    />
                                    <div
                                        className="relative z-10 w-full h-full flex items-center justify-center [&>svg]:w-full [&>svg]:h-full"
                                        dangerouslySetInnerHTML={{ __html: getPreviewSvg(modifiedContent) }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Controls Area */}
                        <div className="bg-zinc-800/30 rounded-2xl border border-white/5 p-6 flex flex-col gap-6">
                            <div>
                                <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2">
                                    <Palette size={20} className="text-pink-500" /> Detected Colors
                                </h3>

                                {/* Stroke Control */}
                                <div className="flex items-center justify-between mb-4 bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                    <span className="text-sm text-zinc-300 font-medium">Stroke / Outlines</span>
                                    <button
                                        onClick={toggleStroke}
                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${showStroke ? 'bg-pink-500/20 text-pink-400' : 'bg-zinc-700 text-zinc-400'
                                            }`}
                                    >
                                        {showStroke ? 'VISIBLE' : 'HIDDEN'}
                                    </button>
                                </div>

                                <p className="text-zinc-400 text-sm mb-4">
                                    Found {colors.length} unique colors. Turn off strokes if you need flat icons.
                                </p>
                            </div>

                            <div className="flex-1 overflow-y-auto max-h-[400px] custom-scrollbar space-y-4 pr-2">
                                {colors.length === 0 ? (
                                    <p className="text-zinc-500 italic text-sm">No standard colors detected. Elements might use classes or &apos;currentColor&apos;.</p>
                                ) : (
                                    colors.map((color, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-zinc-900/50 p-3 rounded-xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-10 h-10 rounded-lg shadow-sm border border-white/10"
                                                    style={{ backgroundColor: color.current }}
                                                />
                                                <span className="text-xs font-mono text-zinc-400 uppercase">{color.current}</span>
                                            </div>
                                            <input
                                                type="color"
                                                value={color.current.startsWith('#') ? color.current : '#000000'} // simple fallback for non-hex
                                                onChange={(e) => updateColor(idx, e.target.value)}
                                                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0 p-0"
                                            />
                                        </div>
                                    ))
                                )}
                            </div>

                            <div className="pt-6 border-t border-white/10 space-y-3">
                                <button
                                    onClick={downloadSvg}
                                    className="w-full bg-pink-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-pink-500 transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                                >
                                    <Download size={20} /> Download Result
                                </button>
                                <button
                                    onClick={() => applyChanges(colors.map(c => ({ ...c, current: c.original })))}
                                    className="w-full bg-zinc-800 text-zinc-400 px-6 py-3 rounded-xl font-bold hover:bg-zinc-700 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2"
                                >
                                    <RefreshCcw size={16} /> Reset Colors
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <RelatedTools />
        </div>
    );
}
