"use client";
import { useState, useRef } from 'react';
import { FileImage, Download, X, Loader2, Upload, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageCompressor() {
    const [file, setFile] = useState(null);
    const [quality, setQuality] = useState(80);
    const [status, setStatus] = useState('idle');
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFile = e.dataTransfer.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
        }
    };

    const compress = () => {
        if (!file) return;
        setStatus('processing');

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
                setCompressedUrl(dataUrl);

                // Estimate compressed size
                const base64Length = dataUrl.length - 'data:image/jpeg;base64,'.length;
                setCompressedSize(Math.round(base64Length * 0.75));

                setStatus('success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    Image Compressor
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Reduce image file size while maintaining quality. Local browser-based compression.
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${file ? 'border-orange-500/50 bg-orange-500/5' : 'border-slate-800 bg-white/5 hover:border-orange-400 hover:bg-white/10'
                    } p-12 text-center backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-orange-500/20 text-orange-400 rounded-3xl mx-auto flex items-center justify-center animate-float">
                                <Upload size={32} />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-orange-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-orange-500 transition-all shadow-lg hover:shadow-orange-600/20 active:scale-95 mb-4"
                                >
                                    Select Image
                                </button>
                                <p className="text-slate-500 text-sm">or drag and drop your image here</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-500/20 rounded-lg flex items-center justify-center text-orange-400">
                                        <FileImage size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-slate-500">Original: {(originalSize / 1024).toFixed(1)} KB</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-slate-500 hover:text-orange-500 transition-colors bg-white/5 p-2 rounded-lg">
                                    <X size={16} />
                                </button>
                            </div>

                            <div className="p-6 bg-white/5 rounded-xl border border-white/10 space-y-4">
                                <div className="flex justify-between items-center text-sm font-bold text-slate-300">
                                    <span>Compression Quality</span>
                                    <span>{quality}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="100"
                                    value={quality}
                                    onChange={(e) => setQuality(parseInt(e.target.value))}
                                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-orange-500"
                                />
                                <div className="flex justify-between text-xs text-slate-500">
                                    <span>Smaller file</span>
                                    <span>Higher quality</span>
                                </div>
                            </div>

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
                                >
                                    <p className="text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
                                        <CheckCircle2 size={20} />
                                        Compressed: {(compressedSize / 1024).toFixed(1)} KB
                                    </p>
                                    <p className="text-emerald-500/80 text-sm mt-1">
                                        Reduced by {Math.round((1 - compressedSize / originalSize) * 100)}%
                                    </p>
                                </motion.div>
                            )}

                            <div className="flex justify-center gap-4">
                                {status === 'success' ? (
                                    <>
                                        <a href={compressedUrl} download="compressed-image.jpg" className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2">
                                            <Download size={20} /> Download
                                        </a>
                                        <button onClick={() => setStatus('idle')} className="bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5">Adjust</button>
                                    </>
                                ) : status === 'processing' ? (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Loader2 size={24} className="animate-spin text-orange-500" />
                                        <span className="font-bold">Compressing...</span>
                                    </div>
                                ) : (
                                    <button onClick={compress} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-50 hover:text-orange-600 transition-all shadow-xl active:scale-95">
                                        Compress Image
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
