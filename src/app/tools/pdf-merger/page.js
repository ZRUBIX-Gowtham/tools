"use client";
import { useState, useRef } from 'react';
import { FileText, Download, X, Loader2, Plus, AlertCircle, GripVertical, Upload, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';
import { motion, AnimatePresence } from 'framer-motion';

export default function PDFMerger() {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [mergedUrl, setMergedUrl] = useState(null);
    const [error, setError] = useState(null);
    const [progress, setProgress] = useState(0);
    const fileInputRef = useRef(null);
    const [draggedIndex, setDraggedIndex] = useState(null);

    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files).filter(f => f.type === 'application/pdf');
        setFiles(prev => [...prev, ...selectedFiles]);
        setError(null);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const selectedFiles = Array.from(e.dataTransfer.files).filter(f => f.type === 'application/pdf');
        setFiles(prev => [...prev, ...selectedFiles]);
        setError(null);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const handleDragStart = (index) => {
        setDraggedIndex(index);
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        if (draggedIndex === null || draggedIndex === index) return;

        const newFiles = [...files];
        const draggedFile = newFiles[draggedIndex];
        newFiles.splice(draggedIndex, 1);
        newFiles.splice(index, 0, draggedFile);
        setFiles(newFiles);
        setDraggedIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedIndex(null);
    };

    const merge = async () => {
        if (files.length < 2) return;
        setStatus('processing');
        setError(null);
        setProgress(0);

        try {
            const mergedPdf = await PDFDocument.create();

            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                const arrayBuffer = await file.arrayBuffer();
                const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });
                const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
                setProgress(((i + 1) / files.length) * 100);
            }

            const mergedPdfBytes = await mergedPdf.save();
            const blob = new Blob([mergedPdfBytes], { type: 'application/pdf' });
            setMergedUrl(URL.createObjectURL(blob));
            setStatus('success');
        } catch (err) {
            console.error(err);
            setError('Failed to merge PDFs. One or more files may be corrupted or encrypted.');
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    PDF Merger
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    Combine multiple PDF files into one document. Drag and drop to reorder.
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${files.length === 0 ? 'border-red-500/50 bg-red-500/5' : 'border-slate-800 bg-white/5'
                    } p-8 md:p-12 shadow-2xl backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {files.length === 0 ? (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="py-12 text-center"
                        >
                            <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-3xl mx-auto flex items-center justify-center animate-float mb-6">
                                <Upload size={32} />
                            </div>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-all shadow-lg hover:shadow-red-600/20 active:scale-95 mb-4"
                            >
                                Select PDF Files
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept=".pdf" multiple />
                            <p className="text-slate-500 text-sm">Select multiple PDF files to merge</p>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="files-selected"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <p className="text-sm text-slate-400 text-center uppercase tracking-wider font-bold">Drag to reorder files</p>
                            <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar pr-2">
                                {files.map((file, idx) => (
                                    <motion.div
                                        key={idx}
                                        layout
                                        draggable
                                        onDragStart={() => handleDragStart(idx)}
                                        onDragOver={(e) => handleDragOver(e, idx)}
                                        onDragEnd={handleDragEnd}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0, scale: draggedIndex === idx ? 0.98 : 1 }}
                                        className={`flex items-center gap-4 p-4 rounded-xl cursor-move transition-all border border-white/5 ${draggedIndex === idx ? 'bg-red-500/10 border-red-500/30' : 'bg-white/5 hover:bg-white/10'}`}
                                    >
                                        <GripVertical size={18} className="text-slate-600" />
                                        <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center text-red-500">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-grow min-w-0">
                                            <p className="font-bold text-slate-200 truncate">{file.name}</p>
                                            <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                        </div>
                                        <span className="text-xs font-bold text-slate-400 bg-white/5 px-2 py-1 rounded border border-white/5">#{idx + 1}</span>
                                        <button onClick={() => removeFile(idx)} className="text-slate-500 hover:text-red-500 transition-colors bg-white/5 p-2 rounded-lg">
                                            <X size={16} />
                                        </button>
                                    </motion.div>
                                ))}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-full py-4 border-2 border-dashed border-white/10 rounded-xl text-slate-400 hover:border-red-500/50 hover:text-red-400 hover:bg-red-500/5 transition-all flex items-center justify-center gap-2 font-bold"
                            >
                                <Plus size={20} /> Add More PDFs
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept=".pdf" multiple />

                            {status === 'error' && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                                    className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400"
                                >
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error}</span>
                                </motion.div>
                            )}

                            {status === 'processing' && (
                                <div className="space-y-3 p-6 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="flex justify-between items-center text-sm font-bold text-slate-300">
                                        <span>Merging Progress</span>
                                        <span>{Math.round(progress)}%</span>
                                    </div>
                                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-red-600 to-rose-600"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                    <p className="text-sm text-slate-500 text-center animate-pulse">Merging {files.length} PDFs...</p>
                                </div>
                            )}

                            <div className="flex justify-center">
                                {status === 'success' ? (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="flex flex-col md:flex-row gap-4 w-full"
                                    >
                                        <a href={mergedUrl} download="merged.pdf" className="flex-1 bg-emerald-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-500 transition-all shadow-lg flex items-center justify-center gap-2">
                                            <Download size={20} /> Download Merged PDF
                                        </a>
                                        <button onClick={() => { setStatus('idle'); setFiles([]); }} className="flex-1 bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold hover:bg-white/10 hover:text-white transition-all border border-white/5">Start Over</button>
                                    </motion.div>
                                ) : status !== 'processing' && (
                                    <button
                                        onClick={merge}
                                        disabled={files.length < 2}
                                        className="w-full bg-white text-slate-900 px-12 py-5 rounded-2xl font-bold text-xl hover:bg-red-50 hover:text-red-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-white disabled:hover:text-slate-900"
                                    >
                                        Merge {files.length} PDFs
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
