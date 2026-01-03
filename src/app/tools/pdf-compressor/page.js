"use client";
import { useState, useRef } from 'react';
import { FileText, Download, X, Loader2, AlertCircle, Upload, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFCompressor() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'application/pdf') {
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
        if (selectedFile && selectedFile.type === 'application/pdf') {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
            setError(null);
            setCompressedUrl(null);
        }
    };

    const compress = async () => {
        if (!file) return;
        setStatus('processing');
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

            // Get all pages and optimize
            pdfDoc.getPages();

            // Simple compression by rewriting
            const compressedPdfBytes = await pdfDoc.save({
                useObjectStreams: true,
                addDefaultPage: false,
                objectsPerTick: 50,
            });

            const blob = new Blob([compressedPdfBytes], { type: 'application/pdf' });
            setCompressedSize(blob.size);
            setCompressedUrl(URL.createObjectURL(blob));
            setStatus('success');
        } catch (err) {
            console.error(err);
            setError('Failed to compress PDF. The file may be corrupted or encrypted.');
            setStatus('error');
        }
    };

    const compressionPercent = originalSize > 0 ? Math.round((1 - compressedSize / originalSize) * 100) : 0;

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    PDF Compressor
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Reduce PDF file size while maintaining quality. Secure local processing.
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${file ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 bg-white/5 hover:border-red-500 hover:bg-white/10'
                    } p-12 text-center backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {!file ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl mx-auto flex items-center justify-center animate-float">
                                <Upload size={32} />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-all shadow-lg hover:shadow-red-600/20 active:scale-95 mb-4"
                                >
                                    Select PDF File
                                </button>
                                <p className="text-slate-500 text-sm">or drag and drop your PDF here</p>
                            </div>
                            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept=".pdf" />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
                                        <FileText size={24} />
                                    </div>
                                    <div className="text-left">
                                        <p className="font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                        <p className="text-xs text-slate-500">{(originalSize / 1024 / 1024).toFixed(2)} MB</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFile(null); setStatus('idle'); setError(null); }} className="text-slate-500 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg">
                                    <X size={16} />
                                </button>
                            </div>

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400"
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </motion.div>
                            )}

                            {status === 'success' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                    className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center"
                                >
                                    <p className="text-emerald-400 font-bold text-lg flex items-center justify-center gap-2">
                                        <CheckCircle2 size={20} />
                                        Compressed successfully
                                    </p>
                                    <p className="text-emerald-500/80 text-sm mt-1">
                                        {(originalSize / 1024 / 1024).toFixed(2)} MB → {(compressedSize / 1024 / 1024).toFixed(2)} MB
                                        <span className="ml-2 font-bold text-emerald-400">({compressionPercent}% smaller)</span>
                                    </p>
                                </motion.div>
                            )}

                            <div className="flex justify-center gap-4">
                                {status === 'success' ? (
                                    <>
                                        <a href={compressedUrl} download={`compressed-${file.name}`} className="bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg flex items-center gap-2">
                                            <Download size={20} /> Download
                                        </a>
                                        <button onClick={() => setStatus('idle')} className="bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5">Compress Another</button>
                                    </>
                                ) : status === 'processing' ? (
                                    <div className="flex items-center gap-3 text-slate-400">
                                        <Loader2 size={24} className="animate-spin text-red-500" />
                                        <span className="font-bold">Compressing...</span>
                                    </div>
                                ) : (
                                    <button onClick={compress} className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-50 hover:text-red-600 transition-all shadow-xl active:scale-95">
                                        Compress PDF
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
