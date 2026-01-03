"use client";
import { useState, useRef, useEffect, useCallback } from 'react';
import { Video, Download, X, Loader2, AlertCircle, Sparkles, Upload, CheckCircle2, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoEnhancer() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [enhancedUrl, setEnhancedUrl] = useState(null);
    const [originalPreview, setOriginalPreview] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [resolution, setResolution] = useState(1080);
    const [enhanceFilter, setEnhanceFilter] = useState('none');
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);

    const enhanceFilters = [
        { id: 'none', name: 'No Filter', css: '', preview: 'Original quality enhancement' },
        { id: 'vivid', name: 'Vivid', css: 'saturate(1.3) contrast(1.1)', preview: 'Boosted colors and contrast' },
        { id: 'warm', name: 'Warm', css: 'sepia(0.2) saturate(1.2) brightness(1.05)', preview: 'Warm, golden tones' },
        { id: 'cool', name: 'Cool', css: 'saturate(0.9) hue-rotate(10deg) brightness(1.05)', preview: 'Cool, blue undertones' },
        { id: 'cinematic', name: 'Cinematic', css: 'contrast(1.15) saturate(1.1) brightness(0.95)', preview: 'Movie-like appearance' },
        { id: 'vintage', name: 'Vintage', css: 'sepia(0.4) contrast(1.1) brightness(0.95)', preview: 'Retro, aged look' },
        { id: 'dramatic', name: 'Dramatic', css: 'contrast(1.3) saturate(0.9)', preview: 'Bold, intense contrast' },
        { id: 'sharp', name: 'Sharp & Clear', css: 'contrast(1.1) brightness(1.02)', preview: 'Crisp, clear visuals' },
    ];

    const enhanceResolutions = [
        { value: 2160, label: '4K Ultra HD', desc: '3840×2160', icon: '4K' },
        { value: 1440, label: '2K QHD', desc: '2560×1440', icon: '2K' },
        { value: 1080, label: 'Full HD', desc: '1920×1080', icon: 'FHD' },
        { value: 720, label: 'HD', desc: '1280×720', icon: 'HD' },
    ];

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setOriginalPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setError(null);
            setEnhancedUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setOriginalPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
            setError(null);
            setEnhancedUrl(null);
        }
    };

    const enhance = async () => {
        if (!file) return;
        setStatus('processing');
        setProgress(0);
        setError(null);

        try {
            const video = document.createElement('video');
            video.src = URL.createObjectURL(file);
            video.muted = true;

            await new Promise((resolve, reject) => {
                video.onloadedmetadata = resolve;
                video.onerror = reject;
            });

            // Calculate new dimensions for upscaling
            const aspectRatio = video.videoWidth / video.videoHeight;
            let newWidth, newHeight;

            if (resolution > video.videoHeight) {
                // Upscale
                newHeight = resolution;
                newWidth = Math.floor(resolution * aspectRatio);
            } else {
                newWidth = video.videoWidth;
                newHeight = video.videoHeight;
            }

            // Create canvas for processing
            const canvas = document.createElement('canvas');
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');

            // Apply filter for enhancement
            if (enhanceFilter !== 'none') {
                const filter = enhanceFilters.find(f => f.id === enhanceFilter);
                if (filter) {
                    ctx.filter = filter.css;
                }
            }

            // Use MediaRecorder with higher bitrate for enhancement
            const stream = canvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8',
                videoBitsPerSecond: Math.floor(file.size * 2 * 8 / video.duration) // Higher bitrate for quality
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setEnhancedUrl(URL.createObjectURL(blob));
                setStatus('success');
            };

            mediaRecorder.onerror = () => {
                setError('Failed to enhance video');
                setStatus('error');
            };

            mediaRecorder.start();

            video.currentTime = 0;
            video.play();

            const drawFrame = () => {
                if (video.ended || video.paused) {
                    mediaRecorder.stop();
                    return;
                }

                ctx.drawImage(video, 0, 0, newWidth, newHeight);
                const progressPercent = (video.currentTime / video.duration) * 100;
                setProgress(progressPercent);
                requestAnimationFrame(drawFrame);
            };

            video.onplay = drawFrame;
            video.onended = () => {
                if (mediaRecorder.state !== 'inactive') {
                    mediaRecorder.stop();
                }
            };

        } catch (err) {
            console.error(err);
            setError('Failed to enhance video. Please try a different file.');
            setStatus('error');
        }
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

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setEnhancedUrl(null);
        setOriginalPreview(null);
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
                    Video Enhancer
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Upscale videos up to 4K and apply stunning filters. Browser-based enhancement.
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${status === 'error' ? 'border-rose-500/50 bg-rose-500/5' :
                    file ? 'border-purple-500/50 bg-purple-500/5' : 'border-slate-800 bg-white/5 hover:border-purple-400 hover:bg-white/10'
                    } p-12 text-center backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {status === 'idle' && !file && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-purple-500/20 text-purple-400 rounded-3xl mx-auto flex items-center justify-center animate-float">
                                <Sparkles size={32} />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-lg hover:shadow-purple-600/20 active:scale-95 mb-4"
                                >
                                    Choose Video to Enhance
                                </button>
                                <p className="text-slate-500 text-sm">or drag and drop your video here</p>
                                <p className="text-slate-600 text-xs mt-2">Supports MP4, WebM, MOV and more</p>
                            </div>
                        </motion.div>
                    )}

                    {file && status !== 'success' && (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            {/* File Info */}
                            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center text-purple-400">
                                        <Video size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-200 truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={reset} className="text-slate-500 hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-lg">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Resolution Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                    <Sparkles size={14} /> Target Resolution
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {enhanceResolutions.map(r => (
                                        <button
                                            key={r.value}
                                            onClick={() => setResolution(r.value)}
                                            className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${resolution === r.value
                                                ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                                                : 'border-white/10 hover:border-purple-400/50 text-slate-300 bg-white/5'
                                                }`}
                                        >
                                            <div className="text-2xl font-black mb-1">{r.icon}</div>
                                            <div className="font-bold text-sm">{r.label}</div>
                                            <div className="text-xs text-slate-500 mt-1">{r.desc}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filter Selection */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                    <Sparkles size={14} /> Enhancement Filter
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {enhanceFilters.map(filter => (
                                        <button
                                            key={filter.id}
                                            onClick={() => setEnhanceFilter(filter.id)}
                                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer ${enhanceFilter === filter.id
                                                ? 'border-purple-500 bg-purple-500/20'
                                                : 'border-white/10 hover:border-purple-400/50 bg-white/5'
                                                }`}
                                        >
                                            <div
                                                className="w-full h-10 rounded-lg bg-gradient-to-r from-purple-400 to-pink-400 mb-2"
                                                style={{ filter: filter.css || 'none' }}
                                            />
                                            <div className="text-xs font-bold text-slate-200">{filter.name}</div>
                                            <div className="text-[10px] text-slate-500 mt-1">{filter.preview}</div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {status === 'error' && (
                                <div className="flex items-center gap-3 p-4 bg-rose-500/10 rounded-xl text-rose-400">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {status === 'processing' ? (
                                <div className="space-y-4 max-w-sm mx-auto">
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-purple-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="font-medium text-purple-400 animate-pulse text-sm uppercase tracking-widest">Enhancing to {resolution}p... {Math.round(progress)}%</p>
                                </div>
                            ) : (
                                <button
                                    onClick={enhance}
                                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-50 hover:text-purple-600 transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto"
                                >
                                    <Sparkles size={20} /> Enhance to {resolution}p
                                </button>
                            )}
                        </motion.div>
                    )}

                    {status === 'success' && (
                        <motion.div
                            key="success"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full mx-auto flex items-center justify-center border border-emerald-500/20">
                                <CheckCircle2 size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Enhancement Complete!</h2>
                                <p className="text-purple-400 font-bold text-lg">Enhanced to {resolution}p</p>
                                {enhanceFilter !== 'none' && (
                                    <p className="text-slate-400 text-sm mt-1">
                                        {enhanceFilters.find(f => f.id === enhanceFilter)?.name} filter applied
                                    </p>
                                )}
                            </div>

                            {/* Before/After Comparison */}
                            <div className="space-y-3">
                                <div className="flex items-center justify-between text-sm text-slate-400">
                                    <span className="flex items-center gap-1"><ChevronLeft size={14} /> Original</span>
                                    <span className="flex items-center gap-1">Enhanced <ChevronRight size={14} /></span>
                                </div>
                                <div
                                    ref={containerRef}
                                    className="relative w-full h-[350px] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-white/10"
                                    onMouseDown={handleMouseDown}
                                    onTouchMove={handleTouchMove}
                                >
                                    {/* Original Video */}
                                    <div className="absolute inset-0 bg-slate-900">
                                        <video
                                            src={originalPreview}
                                            className="w-full h-full object-contain"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    </div>

                                    {/* Enhanced Video - Clipped */}
                                    <div
                                        className="absolute inset-0 bg-slate-900"
                                        style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                                    >
                                        <video
                                            src={enhancedUrl}
                                            className="w-full h-full object-contain"
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                        />
                                    </div>

                                    {/* Slider Handle */}
                                    <div
                                        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg cursor-ew-resize z-10"
                                        style={{ left: `${sliderPosition}%`, transform: 'translateX(-50%)' }}
                                    >
                                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-xl flex items-center justify-center border-2 border-purple-500">
                                            <div className="flex gap-0.5">
                                                <ChevronLeft size={12} className="text-purple-500" />
                                                <ChevronRight size={12} className="text-purple-500" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Labels */}
                                    <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold">ORIGINAL</div>
                                    <div className="absolute bottom-3 right-3 bg-purple-600/90 backdrop-blur px-2 py-1 rounded text-white text-xs font-bold">ENHANCED</div>
                                </div>
                                <p className="text-center text-slate-500 text-xs">Drag slider to compare</p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href={enhancedUrl}
                                    download={`enhanced-${resolution}p-${file.name.replace(/\.[^/.]+$/, '')}.webm`}
                                    className="bg-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-lg flex items-center gap-2"
                                >
                                    <Download size={20} /> Download Enhanced
                                </a>
                                <button
                                    onClick={reset}
                                    className="bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:text-white transition-all border border-white/5"
                                >
                                    Enhance Another
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFile}
                    className="hidden"
                    accept="video/*"
                />
            </div>

            {/* Trust Badges */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm">
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Up to 4K</div>
                    <p className="text-slate-500 leading-relaxed font-light">Upscale your videos to stunning 4K Ultra HD resolution for maximum quality.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">8 Filters</div>
                    <p className="text-slate-500 leading-relaxed font-light">Apply professional filters like Cinematic, Vintage, Vivid and more.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Private</div>
                    <p className="text-slate-500 leading-relaxed font-light">All processing happens locally. Your videos never leave your device.</p>
                </div>
            </div>
        </div>
    );
}
