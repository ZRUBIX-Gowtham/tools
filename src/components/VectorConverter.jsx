"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, File, CheckCircle2, AlertCircle, Download, ArrowRight, X, Layers, Settings, RefreshCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import RelatedTools from './RelatedTools';
import confetti from 'canvas-confetti';

// Import imagetracerjs
// Note: imagetracerjs might behave differently in strict mode or modules. 
// We might need to dynamically import or require it if it doesn't support ES6 imports cleanly.
import ImageTracer from 'imagetracerjs';

export default function VectorConverter() {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [convertedFiles, setConvertedFiles] = useState([]);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const [options, setOptions] = useState('default'); // default, detailed, smoothed, sharp... - mapped to presets
    const [resizeMode, setResizeMode] = useState('original'); // original, 400, 500, 1024
    const fileInputRef = useRef(null);
    const pathname = usePathname();

    // Presets for ImageTracer
    const presets = {
        default: {},
        detailed: { numberofcolors: 64, pathomit: 0 },
        smoothed: { blurradius: 5, blurdelta: 20 },
        sharp: { blurradius: 0, scale: 1 },
        grayscale: { colorsampling: 0, numberofcolors: 4 },
        posterized: { numberofcolors: 8, blurradius: 2 }
    };

    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files || []);
        const validFiles = selectedFiles.filter(f => f.type.startsWith('image/'));

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setStatus('idle');
            setConvertedFiles([]);
        } else if (selectedFiles.length > 0) {
            setError("Please upload valid image files (PNG, JPG, etc).");
            setStatus('error');
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length <= 1) setStatus('idle');
    };

    const processFiles = async () => {
        if (files.length === 0) return;
        setStatus('processing');
        setProgress(0);
        setConvertedFiles([]);

        try {
            const results = [];
            let processed = 0;

            for (const file of files) {
                const url = URL.createObjectURL(file);

                // Convert to SVG
                let svgString = await new Promise((resolve, reject) => {
                    // ImageTracer.imageToSVG( source_url, callback, options )
                    try {
                        ImageTracer.imageToSVG(url, (svgstr) => {
                            resolve(svgstr);
                        }, presets[options] || {});
                    } catch (e) {
                        reject(e);
                    }
                });

                // Handle resizing if requested
                // Normalizing SVG logic
                let width = 1000, height = 1000;
                const wMatch = svgString.match(/width="([\d\.]+)"/i);
                const hMatch = svgString.match(/height="([\d\.]+)"/i);
                const vbMatch = svgString.match(/viewBox="([^"]*)"/i);

                if (wMatch) width = parseFloat(wMatch[1]);
                if (hMatch) height = parseFloat(hMatch[1]);
                let viewBox = vbMatch ? vbMatch[1] : `0 0 ${width} ${height}`;

                const createSvgWithAttrs = (w, h) => {
                    return svgString.replace(
                        /<svg[^>]*>/i,
                        `<svg width="${w}" height="${h}" viewBox="${viewBox}" version="1.1" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">`
                    );
                };

                let previewSvg = createSvgWithAttrs("100%", "100%");
                let finalSvg = svgString;

                if (resizeMode !== 'original') {
                    const size = parseInt(resizeMode);
                    if (!isNaN(size)) finalSvg = createSvgWithAttrs(size, size);
                } else if (!vbMatch) {
                    finalSvg = createSvgWithAttrs(width, height);
                }
                // (Logic handled above)

                // Create blob for download from finalSvg
                const blob = new Blob([finalSvg], { type: 'image/svg+xml' });
                const blobUrl = URL.createObjectURL(blob);

                results.push({
                    originalName: file.name,
                    url: blobUrl,
                    content: previewSvg // Use the 100% width/height version for preview
                });

                processed++;
                setProgress((processed / files.length) * 100);
            }

            setConvertedFiles(results);
            setStatus('success');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (err) {
            console.error(err);
            setError("Failed to vectorize image. Please try a simpler image or different options.");
            setStatus('error');
        }
    };

    const reset = () => {
        setFiles([]);
        setStatus('idle');
        setConvertedFiles([]);
        setProgress(0);
        setError(null);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    Image to Vector SVG
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Convert raster images (PNG, JPG) to scalable SVG vectors with paths.
                </motion.p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <AnimatePresence mode="wait">
                    {status === 'idle' && files.length === 0 && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="text-center space-y-6"
                        >
                            <div className="w-20 h-20 bg-purple-500/20 rounded-full mx-auto flex items-center justify-center animate-float">
                                <Layers size={32} className="text-purple-500" />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-600/20 cursor-pointer"
                                >
                                    Select Images to Vectorize
                                </button>
                                <p className="text-zinc-500 mt-4 text-sm">Best for logos, icons, and high-contrast images</p>
                            </div>
                        </motion.div>
                    )}

                    {files.length > 0 && (
                        <motion.div
                            key="selected"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            {/* File List */}
                            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                        <div className="flex items-center gap-4">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img src={URL.createObjectURL(file)} alt="preview" className="w-10 h-10 rounded-lg object-cover bg-white/10" />
                                            <div className="text-left">
                                                <p className="font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFile(idx)} className="text-slate-500 hover:text-rose-500 p-2 cursor-pointer">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Options - Only show here if NOT success (moved to success view for that state) */}
                            {status !== 'success' && (
                                <div className="flex flex-wrap items-center gap-4 justify-center w-full max-w-3xl mx-auto bg-white/5 p-4 rounded-xl border border-white/10">
                                    <div className="flex items-center gap-2">
                                        <Settings size={18} className="text-zinc-400" />
                                        <span className="text-zinc-300 font-bold text-sm">Tracing:</span>
                                        <select
                                            value={options}
                                            onChange={(e) => setOptions(e.target.value)}
                                            className="bg-zinc-800 text-white rounded-lg px-3 py-1.5 border border-white/10 outline-none cursor-pointer text-sm"
                                        >
                                            <option value="default">Default</option>
                                            <option value="detailed">Detailed (More Colors)</option>
                                            <option value="smoothed">Smoothed (Less Noise)</option>
                                            <option value="sharp">Sharp (Corners)</option>
                                            <option value="grayscale">Grayscale</option>
                                            <option value="posterized">Posterized</option>
                                        </select>
                                    </div>

                                    <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-zinc-300 font-bold text-sm">Output Size:</span>
                                        <select
                                            value={resizeMode}
                                            onChange={(e) => setResizeMode(e.target.value)}
                                            className="bg-zinc-800 text-white rounded-lg px-3 py-1.5 border border-white/10 outline-none cursor-pointer text-sm"
                                        >
                                            <option value="original">Match Original</option>
                                            <option value="400">Fixed 400x400</option>
                                            <option value="500">Fixed 500x500</option>
                                            <option value="1024">Fixed 1024x1024</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* Process Button */}
                            {status === 'processing' ? (
                                <div className="space-y-4 max-w-sm mx-auto text-center">
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-purple-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="font-medium text-purple-400 animate-pulse text-sm uppercase tracking-widest">Tracing Paths...</p>
                                </div>
                            ) : status === 'success' ? (
                                <div className="space-y-8">
                                    <div className="flex flex-col items-center gap-6 mb-8">
                                        <div className="flex flex-wrap items-center gap-4 justify-center w-full max-w-3xl mx-auto bg-white/5 p-4 rounded-xl border border-white/10">
                                            <div className="flex items-center gap-2">
                                                <Settings size={18} className="text-zinc-400" />
                                                <span className="text-zinc-300 font-bold text-sm">Tracing:</span>
                                                <select
                                                    value={options}
                                                    onChange={(e) => setOptions(e.target.value)}
                                                    className="bg-zinc-800 text-white rounded-lg px-3 py-1.5 border border-white/10 outline-none cursor-pointer text-sm"
                                                >
                                                    <option value="default">Default</option>
                                                    <option value="detailed">Detailed (More Colors)</option>
                                                    <option value="smoothed">Smoothed (Less Noise)</option>
                                                    <option value="sharp">Sharp (Corners)</option>
                                                    <option value="grayscale">Grayscale</option>
                                                    <option value="posterized">Posterized</option>
                                                </select>
                                            </div>

                                            <div className="w-px h-6 bg-white/10 hidden sm:block"></div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-zinc-300 font-bold text-sm">Output Size:</span>
                                                <select
                                                    value={resizeMode}
                                                    onChange={(e) => setResizeMode(e.target.value)}
                                                    className="bg-zinc-800 text-white rounded-lg px-3 py-1.5 border border-white/10 outline-none cursor-pointer text-sm"
                                                >
                                                    <option value="original">Match Original</option>
                                                    <option value="400">Fixed 400x400</option>
                                                    <option value="500">Fixed 500x500</option>
                                                    <option value="1024">Fixed 1024x1024</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={processFiles}
                                                className="bg-purple-600 text-white px-6 py-4 rounded-2xl font-bold hover:bg-purple-500 transition-all cursor-pointer shadow-lg hover:shadow-purple-600/20 flex items-center gap-2"
                                            >
                                                <RefreshCcw size={18} /> Convert Again
                                            </button>
                                            <button
                                                onClick={reset}
                                                className="bg-zinc-800 text-zinc-300 px-6 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                                            >
                                                Reset
                                            </button>
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="bg-zinc-800 text-zinc-300 px-6 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                                            >
                                                + Add More
                                            </button>
                                        </div>
                                    </div>

                                    {/* Results Area */}
                                    <div className="text-center">
                                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-emerald-500/10 rounded-full text-emerald-500 text-sm font-bold border border-emerald-500/20">
                                            <CheckCircle2 size={16} /> Vectorization Complete
                                        </div>

                                        <div className="flex flex-wrap justify-center gap-8">
                                            {convertedFiles.map((item, idx) => (
                                                <div key={idx} className="flex flex-col items-center gap-4">
                                                    <div
                                                        className="bg-zinc-900/50 rounded-xl flex items-center justify-center p-4 overflow-hidden relative border border-white/5 shadow-2xl transition-all duration-300"
                                                        style={{
                                                            width: resizeMode !== 'original' ? `${resizeMode}px` : '500px',
                                                            height: resizeMode !== 'original' ? `${resizeMode}px` : '500px',
                                                            maxWidth: '100%'
                                                        }}
                                                    >
                                                        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#333 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                                                        {/* Preview SVG */}
                                                        <div dangerouslySetInnerHTML={{ __html: item.content }} className="w-full h-full [&>svg]:w-full [&>svg]:h-full flex items-center justify-center" />
                                                    </div>

                                                    <p className="text-xs text-zinc-500">
                                                        {resizeMode !== 'original' ? `Fixed Size: ${resizeMode}x${resizeMode}px` : 'Original Aspect Ratio'}
                                                    </p>

                                                    <div className="flex items-center gap-4 w-full justify-between px-2" style={{ maxWidth: resizeMode !== 'original' ? `${resizeMode}px` : '500px' }}>
                                                        <span className="text-sm font-bold text-zinc-400 truncate max-w-[200px]">{item.originalName}</span>
                                                        <a
                                                            href={item.url}
                                                            download={item.originalName.replace(/\.[^/.]+$/, "") + ".svg"}
                                                            className="bg-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-purple-500 flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-purple-600/20 transition-all"
                                                        >
                                                            <Download size={18} /> Save SVG
                                                        </a>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => fileInputRef.current?.click()}
                                        className="bg-zinc-800 text-zinc-300 px-6 py-4 rounded-2xl font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                                    >
                                        + Add More
                                    </button>
                                    <button
                                        onClick={processFiles}
                                        className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-lg active:scale-95 flex items-center gap-3 cursor-pointer"
                                    >
                                        Convert to Vector <ArrowRight size={20} />
                                    </button>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {status === 'success' && null /* Handled above */}

                    {status === 'error' && (
                        <div className="text-center space-y-4">
                            <div className="w-16 h-16 bg-rose-500/20 rounded-full mx-auto flex items-center justify-center text-rose-500">
                                <AlertCircle size={32} />
                            </div>
                            <p className="text-rose-400 font-bold">{error}</p>
                            <button
                                onClick={reset}
                                className="bg-zinc-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-zinc-700 cursor-pointer"
                            >
                                Try Again
                            </button>
                        </div>
                    )}
                </AnimatePresence>

                <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept="image/*" multiple />
            </div>

            <RelatedTools currentPath={pathname} />
        </div>
    );
}
