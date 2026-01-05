"use client";
import { useState, useRef } from 'react';
import { Video, Download, X, Loader2, AlertCircle, Settings, Upload, CheckCircle2 } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import { motion, AnimatePresence } from 'framer-motion';

export default function VideoCompressor() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const [quality, setQuality] = useState(0.6);
    const [resolution, setResolution] = useState(720);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
            setError(null);
            setCompressedUrl(null);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type.startsWith('video/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
            setError(null);
            setCompressedUrl(null);
        }
    };

    const compressResolutions = [
        { value: 1080, label: '1080p (Full HD)' },
        { value: 720, label: '720p (HD)' },
        { value: 480, label: '480p (SD)' },
        { value: 360, label: '360p (Low)' },
    ];

    const compress = async () => {
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

            // Calculate new dimensions
            const aspectRatio = video.videoWidth / video.videoHeight;
            let newWidth, newHeight;

            if (video.videoHeight > resolution) {
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

            // Use MediaRecorder for compression
            const stream = canvas.captureStream(30);
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'video/webm;codecs=vp8',
                videoBitsPerSecond: Math.floor(file.size * quality * 8 / video.duration)
            });

            const chunks = [];
            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunks.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunks, { type: 'video/webm' });
                setCompressedSize(blob.size);
                setCompressedUrl(URL.createObjectURL(blob));
                setStatus('success');
            };

            mediaRecorder.onerror = () => {
                setError('Failed to compress video');
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
            setError('Failed to compress video. Please try a different file.');
            setStatus('error');
        }
    };

    const compressionPercent = originalSize > 0 && compressedSize > 0
        ? Math.round((1 - compressedSize / originalSize) * 100)
        : 0;

    const reset = () => {
        setFile(null);
        setStatus('idle');
        setCompressedUrl(null);
        setProgress(0);
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    Video Compressor
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Reduce video file size while maintaining quality. Fast browser-based compression.
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${status === 'error' ? 'border-rose-500/50 bg-rose-500/5' :
                    file ? 'border-rose-500/50 bg-rose-500/5' : 'border-slate-800 bg-white/5 hover:border-rose-400 hover:bg-white/10'
                    } p-12 text-center backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {status === 'idle' && !file && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-rose-500/20 text-rose-400 rounded-3xl mx-auto flex items-center justify-center animate-float">
                                <Upload size={32} />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-rose-500 transition-all shadow-lg hover:shadow-rose-600/20 active:scale-95 mb-4 cursor-pointer"
                                >
                                    Choose Video File
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
                                    <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center text-rose-400">
                                        <Video size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-200 truncate max-w-[250px]">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={reset} className="text-slate-500 hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-lg cursor-pointer">
                                    <X size={16} />
                                </button>
                            </div>

                            {/* Compression Settings */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Settings size={14} /> Quality: {Math.round(quality * 100)}%
                                    </label>
                                    <input
                                        type="range"
                                        min="0.2"
                                        max="0.9"
                                        step="0.1"
                                        value={quality}
                                        onChange={(e) => setQuality(parseFloat(e.target.value))}
                                        className="w-full h-2 bg-slate-700 rounded-lg cursor-pointer accent-rose-600"
                                    />
                                    <p className="text-xs text-slate-500">Lower = smaller file, more compression</p>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-slate-300">Max Resolution</label>
                                    <select
                                        value={resolution}
                                        onChange={(e) => setResolution(parseInt(e.target.value))}
                                        className="w-full p-3 rounded-xl bg-slate-800 border border-white/10 text-slate-200 cursor-pointer"
                                    >
                                        {compressResolutions.map(r => (
                                            <option key={r.value} value={r.value}>{r.label}</option>
                                        ))}
                                    </select>
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
                                            className="h-full bg-rose-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="font-medium text-rose-400 animate-pulse text-sm uppercase tracking-widest">Compressing... {Math.round(progress)}%</p>
                                </div>
                            ) : (
                                <button
                                    onClick={compress}
                                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-rose-50 hover:text-rose-600 transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
                                >
                                    Compress Video
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
                                <h2 className="text-2xl font-bold text-white mb-2">Compression Complete!</h2>
                                <p className="text-emerald-400 font-bold text-lg">Reduced by {compressionPercent}%</p>
                                <p className="text-slate-400 text-sm mt-2">
                                    {(originalSize / 1024 / 1024).toFixed(2)} MB → {(compressedSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                <a
                                    href={compressedUrl}
                                    download={`compressed-${file.name.replace(/\.[^/.]+$/, '')}.webm`}
                                    className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2 cursor-pointer"
                                >
                                    <Download size={20} /> Download
                                </a>
                                <button
                                    onClick={reset}
                                    className="bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:text-white transition-all border border-white/5 cursor-pointer"
                                >
                                    Compress Another
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
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Secure</div>
                    <p className="text-slate-500 leading-relaxed font-light">Your videos are processed locally in your browser. We never see your data.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">High Quality</div>
                    <p className="text-slate-500 leading-relaxed font-light">Advanced compression algorithms maintain visual quality while reducing file size.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Fast</div>
                    <p className="text-slate-500 leading-relaxed font-light">Harness your computer&apos;s power for quick processing without server uploads.</p>
                </div>
            </div>
            <RelatedTools />
        </div>
    );
}
