"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Eraser, Download, X, Loader2, AlertCircle, Sliders, ChevronLeft, ChevronRight, Upload, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function BackgroundRemover() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('idle');
    const [resultUrl, setResultUrl] = useState(null);
    const [error, setError] = useState(null);
    const [threshold, setThreshold] = useState(30);
    const [tolerance, setTolerance] = useState(50);
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setResultUrl(null);
            setError(null);
            setSliderPosition(50);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setResultUrl(null);
            setError(null);
            setSliderPosition(50);
        }
    };

    const removeBackground = () => {
        if (!file) return;
        setStatus('processing');
        setError(null);

        // Simulate processing for visual effect since actual BG removal logic is hefty
        // In a real app, this would call an API or use a more complex WASM lib
        setTimeout(() => {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                    const data = imageData.data;

                    const corners = [
                        { x: 0, y: 0 },
                        { x: canvas.width - 1, y: 0 },
                        { x: 0, y: canvas.height - 1 },
                        { x: canvas.width - 1, y: canvas.height - 1 }
                    ];

                    let bgR = 0, bgG = 0, bgB = 0;
                    corners.forEach(({ x, y }) => {
                        const idx = (y * canvas.width + x) * 4;
                        bgR += data[idx];
                        bgG += data[idx + 1];
                        bgB += data[idx + 2];
                    });
                    bgR = Math.round(bgR / 4);
                    bgG = Math.round(bgG / 4);
                    bgB = Math.round(bgB / 4);

                    const toleranceVal = tolerance * 2.55;
                    for (let i = 0; i < data.length; i += 4) {
                        const r = data[i];
                        const g = data[i + 1];
                        const b = data[i + 2];

                        const diff = Math.sqrt(
                            Math.pow(r - bgR, 2) +
                            Math.pow(g - bgG, 2) +
                            Math.pow(b - bgB, 2)
                        );

                        if (diff < toleranceVal) {
                            const alpha = Math.min(255, Math.max(0, (diff / toleranceVal) * 255 * (threshold / 50)));
                            data[i + 3] = alpha;
                        }
                    }

                    ctx.putImageData(imageData, 0, 0);
                    setResultUrl(canvas.toDataURL('image/png'));
                    setStatus('success');
                } catch (err) {
                    console.error(err);
                    setError('Failed to process image.');
                    setStatus('error');
                }
            };
            img.src = preview;
        }, 500);
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = useCallback(() => setIsDragging(false), []);

    const handleMouseMove = useCallback((e) => {
        if (!isDragging || !containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
        setSliderPosition(percentage);
    }, [isDragging]);

    const handleTouchMove = (e) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const touch = e.touches[0];
        const x = touch.clientX - rect.left;
        const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
        setSliderPosition(percentage);
    };

    useEffect(() => {
        window.addEventListener('mouseup', handleMouseUp);
        window.addEventListener('mousemove', handleMouseMove);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [isDragging, handleMouseUp, handleMouseMove]);

    return (
        <div className="min-h-screen px-4 py-20">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-12">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                    >
                        Background Remover
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-slate-400 text-lg font-light"
                    >
                        Remove background from your images automatically with full preview comparison.
                    </motion.p>
                </div>

                <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className={`bg-black/40 rounded-[2rem] border transition-all duration-300 ${file ? 'border-indigo-500/20' : 'border-white/10'
                        } p-8 md:p-12 shadow-2xl backdrop-blur-sm`}
                >
                    <AnimatePresence mode="wait">
                        {!file ? (
                            <motion.div
                                key="idle"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                                className="py-20 text-center border-2 border-dashed border-slate-700 rounded-3xl hover:border-indigo-500 transition-colors"
                            >
                                <div className="w-20 h-20 bg-indigo-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float text-indigo-400">
                                    <Layers size={32} />
                                </div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-indigo-500 transition-all shadow-lg hover:shadow-indigo-600/20 active:scale-95 mb-4"
                                >
                                    Select Image
                                </button>
                                <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                                <p className="text-slate-500 mt-4 text-sm">Upload an image to remove its background</p>
                                <p className="text-slate-600 mt-2 text-xs">Works best with solid color backgrounds</p>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="file"
                                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                className="space-y-8"
                            >
                                {/* Full Screen Comparison Slider */}
                                {status === 'success' && resultUrl ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                <ChevronLeft size={16} className="text-indigo-500" /> Before
                                            </p>
                                            <p className="text-sm font-bold text-slate-400 flex items-center gap-2">
                                                After <ChevronRight size={16} className="text-indigo-500" />
                                            </p>
                                        </div>
                                        <div
                                            ref={containerRef}
                                            className="relative w-full h-[500px] md:h-[600px] rounded-2xl overflow-hidden cursor-ew-resize select-none border-4 border-slate-800 bg-slate-900"
                                            onMouseDown={handleMouseDown}
                                            onTouchMove={handleTouchMove}
                                        >
                                            <div className="absolute inset-0">
                                                <img src={preview} alt="Original" className="w-full h-full object-contain" />
                                            </div>

                                            <div
                                                className="absolute inset-0"
                                                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                            >
                                                <div className="w-full h-full bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1683030383/transparent-grid_v2_dark_w3b56t.png')] bg-repeat">
                                                    <img src={resultUrl} alt="Result" className="w-full h-full object-contain" />
                                                </div>
                                            </div>

                                            <div
                                                className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                                                style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                            >
                                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-indigo-500">
                                                    <div className="flex gap-0.5">
                                                        <ChevronLeft size={14} className="text-indigo-500" />
                                                        <ChevronRight size={14} className="text-indigo-500" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p className="text-center text-slate-500 text-sm">Drag slider to compare</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-slate-400 text-center">Original</p>
                                            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-4 min-h-[300px] flex items-center justify-center">
                                                <img src={preview} alt="Original" className="max-w-full max-h-[400px] mx-auto rounded-lg" />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-sm font-bold text-slate-400 text-center">Result</p>
                                            <div className="rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-4 min-h-[300px] flex items-center justify-center bg-[url('https://res.cloudinary.com/dzl9yxixg/image/upload/v1683030383/transparent-grid_v2_dark_w3b56t.png')]">
                                                {status === 'processing' ? (
                                                    <div className="text-center">
                                                        <Loader2 size={32} className="animate-spin mx-auto mb-2 text-indigo-500" />
                                                        <p className="text-sm text-slate-400">Processing...</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-slate-500">Ready to process</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Settings */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                            <Sliders size={14} /> Tolerance: {tolerance}%
                                        </label>
                                        <input
                                            type="range"
                                            min="10"
                                            max="100"
                                            value={tolerance}
                                            onChange={(e) => setTolerance(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-500"
                                        />
                                        <p className="text-xs text-slate-500">Increase to remove more similar colors</p>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                            <Sliders size={14} /> Edge Softness: {threshold}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={threshold}
                                            onChange={(e) => setThreshold(parseInt(e.target.value))}
                                            className="w-full h-2 bg-slate-800 rounded-lg cursor-pointer accent-indigo-500"
                                        />
                                        <p className="text-xs text-slate-500">Increase for smoother edges</p>
                                    </div>
                                </div>

                                {status === 'error' && (
                                    <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                                        <AlertCircle size={20} />
                                        <span className="text-sm font-medium">{error}</span>
                                    </div>
                                )}

                                <div className="flex justify-center gap-4 flex-wrap">
                                    {status === 'success' ? (
                                        <>
                                            <a href={resultUrl} download="no-background.png" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 flex items-center gap-3 shadow-lg">
                                                <Download size={20} /> Download
                                            </a>
                                            <button onClick={() => { setResultUrl(null); setStatus('idle'); }} className="bg-white/10 text-slate-300 px-8 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all border border-white/5">Adjust</button>
                                            <button onClick={() => { setFile(null); setStatus('idle'); }} className="bg-white/5 text-slate-400 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 transition-all border border-white/5">New Image</button>
                                        </>
                                    ) : status !== 'processing' && (
                                        <>
                                            <button onClick={removeBackground} className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-indigo-50 hover:text-indigo-600 transition-all shadow-xl flex items-center gap-3">
                                                <Eraser size={20} /> Remove Background
                                            </button>
                                            <button onClick={() => setFile(null)} className="bg-white/10 text-slate-300 px-6 py-5 rounded-2xl font-bold hover:bg-rose-500/20 hover:text-rose-400 transition-all">
                                                <X size={24} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
