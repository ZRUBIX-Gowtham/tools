"use client";
import { useState, useRef } from 'react';
import { Settings, Maximize, Download, ArrowRight, X, Image as ImageIcon, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [aspectRatio, setAspectRatio] = useState(true);
    const [status, setStatus] = useState('idle');
    const [resizedUrl, setResizedUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const img = new Image();
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
            };
            img.src = URL.createObjectURL(selectedFile);
        }
    };

    const handleWidthChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setWidth(val);
        // Aspect ratio logic placeholder for future
        if (aspectRatio && file) {
            // calculated height based on ratio would go here
        }
    };

    const resize = async () => {
        setStatus('processing');
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                setResizedUrl(canvas.toDataURL(file.type));
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
                    Image Resizer
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Change dimensions quickly. High-quality client-side resizing.
                </motion.p>
            </div>

            <div className="bg-black/40 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-sm">
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="py-20 text-center border-2 border-dashed border-slate-700 rounded-3xl hover:border-blue-500 transition-colors"
                        >
                            <div className="w-20 h-20 bg-blue-500/20 rounded-3xl mx-auto mb-6 flex items-center justify-center animate-float text-blue-400">
                                <ImageIcon size={32} />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 mb-4"
                            >
                                Select Image
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                            <p className="text-slate-500 mt-4 text-sm">Upload an image to resize</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <div className="w-16 h-16 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                                    <ImageIcon size={24} className="text-blue-400" />
                                </div>
                                <div className="flex-grow">
                                    <p className="font-bold text-slate-200">{file.name}</p>
                                    <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                </div>
                                <button onClick={() => setFile(null)} className="text-slate-500 hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-lg">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-400 block text-center md:text-left">Target Width (px)</label>
                                    <input
                                        type="number"
                                        value={width}
                                        onChange={handleWidthChange}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all font-bold text-lg text-white text-center"
                                    />
                                </div>
                                <div className="space-y-3">
                                    <label className="text-sm font-bold text-slate-400 block text-center md:text-left">Target Height (px)</label>
                                    <input
                                        type="number"
                                        value={height}
                                        onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                        className="w-full px-6 py-4 rounded-2xl bg-white/5 border border-white/10 focus:border-blue-500 outline-none transition-all font-bold text-lg text-white text-center"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-center pt-4">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                        className="flex gap-4 w-full justify-center"
                                    >
                                        <a href={resizedUrl} download="resized-image" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all flex items-center gap-3 shadow-lg">
                                            <Download size={20} /> Download Resized
                                        </a>
                                        <button onClick={() => setStatus('idle')} className="bg-white/10 text-slate-300 px-10 py-4 rounded-2xl font-bold hover:bg-white/20 transition-all">Adjust Again</button>
                                    </motion.div>
                                ) : (
                                    <button
                                        onClick={resize}
                                        className="bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-50 hover:text-blue-600 transition-all shadow-xl flex items-center gap-3 active:scale-95"
                                    >
                                        Resize Image <Maximize size={20} />
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
