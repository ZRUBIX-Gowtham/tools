"use client";
import { useState, useRef, useEffect } from 'react';
import { Upload, File, CheckCircle2, AlertCircle, Download, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import RelatedTools from './RelatedTools';
import confetti from 'canvas-confetti';

import jsPDF from 'jspdf';
import JSZip from 'jszip';
// Dynamic import for pdfjs-dist to avoid SSR issues


// Helper to load PDF.js dynamically
const loadPdfJs = async () => {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined') {
        // Force local worker to avoid CDN fetch issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
    return pdfjsLib;
};

export default function ImageConverter({ fromFormat, toFormat, title, description }) {
    const [files, setFiles] = useState([]); // Changed to array
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const [convertedFiles, setConvertedFiles] = useState([]); // Array of { originalName, url, format }
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const pathname = usePathname();

    const allowedTypes = {
        'PNG': ['image/png'],
        'JPG': ['image/jpeg', 'image/jpg'],
        'JPEG': ['image/jpeg', 'image/jpg'],
        'WEBP': ['image/webp'],
        'SVG': ['image/svg+xml'],
        'GIF': ['image/gif'],
        'PDF': ['application/pdf']
    };

    const handleFiles = (selectedFiles) => {
        if (!selectedFiles || selectedFiles.length === 0) return;

        const newFiles = Array.from(selectedFiles);

        // Validation loop
        if (fromFormat !== 'ANY') {
            const allowed = allowedTypes[fromFormat.toUpperCase()];
            const invalidFiles = newFiles.filter(f => allowed && !allowed.includes(f.type));

            if (invalidFiles.length > 0) {
                setError(`Please upload only ${fromFormat} files. Invalid files were skipped.`);
                // Filter valid only
                const validFiles = newFiles.filter(f => allowed && allowed.includes(f.type));
                if (validFiles.length === 0) {
                    setStatus('error');
                    return;
                }
                setFiles(prev => [...prev, ...validFiles]);
            } else {
                setFiles(prev => [...prev, ...newFiles]);
            }
        } else {
            setFiles(prev => [...prev, ...newFiles]);
        }

        setStatus('idle');
        setError(null);
    };

    const onFileChange = (e) => handleFiles(e.target.files);

    const onDrop = (e) => {
        e.preventDefault();
        handleFiles(e.dataTransfer.files);
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
        if (files.length <= 1) setStatus('idle'); // Reset if cleared
    };

    // Convert PDF to images
    const convertPdfToImages = async (file, targetFormat) => {
        const arrayBuffer = await file.arrayBuffer();
        const pdfLib = await loadPdfJs();
        const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
        const results = [];

        for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const scale = 2; // Higher quality
            const viewport = page.getViewport({ scale });

            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.height = viewport.height;
            canvas.width = viewport.width;

            await page.render({ canvasContext: context, viewport }).promise;

            let url;
            if (targetFormat.toLowerCase() === 'png') {
                url = canvas.toDataURL('image/png');
            } else {
                url = canvas.toDataURL('image/jpeg', 0.92);
            }

            results.push({
                originalName: `${file.name}-page-${pageNum}`,
                url: url,
                format: targetFormat.toLowerCase()
            });
        }

        return results;
    };

    const convertImages = async () => {
        if (files.length === 0) return;
        setStatus('processing');
        setProgress(0);
        setConvertedFiles([]);

        try {
            const totalFiles = files.length;
            let processedCount = 0;
            const newConvertedFiles = [];

            for (const file of files) {
                // Check if it's a PDF conversion
                if (fromFormat.toUpperCase() === 'PDF') {
                    const pdfResults = await convertPdfToImages(file, toFormat);
                    newConvertedFiles.push(...pdfResults);
                } else {
                    // Regular image conversion
                    const resultUrl = await processFile(file, toFormat);
                    newConvertedFiles.push({
                        originalName: file.name,
                        url: resultUrl,
                        format: toFormat.toLowerCase()
                    });
                }

                processedCount++;
                setProgress((processedCount / totalFiles) * 100);
            }

            setConvertedFiles(newConvertedFiles);
            setStatus('success');
            confetti({
                particleCount: 100,
                spread: 70,
                origin: { y: 0.6 }
            });

        } catch (err) {
            console.error(err);
            setError("An error occurred during conversion. Please make sure you've uploaded valid files.");
            setStatus('error');
        }
    };

    // Helper to process single file
    const processFile = (file, targetFormat) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            const reader = new FileReader();

            reader.onload = (e) => {
                img.onload = () => {
                    try {
                        let url = '';
                        if (targetFormat.toLowerCase() === 'pdf') {
                            const pdf = new jsPDF({
                                orientation: img.width > img.height ? 'landscape' : 'portrait',
                                unit: 'px',
                                format: [img.width, img.height]
                            });
                            pdf.addImage(img, 'JPEG', 0, 0, img.width, img.height);
                            url = pdf.output('bloburl');
                        } else if (targetFormat.toLowerCase() === 'svg') {
                            const svgContent = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
    <svg width="${img.width}" height="${img.height}" viewBox="0 0 ${img.width} ${img.height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <image width="${img.width}" height="${img.height}" xlink:href="${img.src}" />
    </svg>`;
                            const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
                            url = URL.createObjectURL(blob);
                        } else {
                            const canvas = document.createElement('canvas');
                            canvas.width = img.width;
                            canvas.height = img.height;
                            const ctx = canvas.getContext('2d');
                            ctx.drawImage(img, 0, 0);

                            let resultType = `image/${targetFormat.toLowerCase()}`;
                            if (targetFormat.toLowerCase() === 'jpg') resultType = 'image/jpeg';

                            url = canvas.toDataURL(resultType);
                        }
                        resolve(url);
                    } catch (err) {
                        reject(err);
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    };

    const downloadAllAsZip = async () => {
        const zip = new JSZip();
        for (let i = 0; i < convertedFiles.length; i++) {
            const file = convertedFiles[i];
            const response = await fetch(file.url);
            const blob = await response.blob();
            const fileName = `${file.originalName.split('.')[0]}.${file.format}`;
            zip.file(fileName, blob);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        const zipUrl = URL.createObjectURL(content);
        const link = document.createElement('a');
        link.href = zipUrl;
        link.download = `converted_images.zip`;
        link.click();
        URL.revokeObjectURL(zipUrl);
    };

    const reset = () => {
        setFiles([]);
        setStatus('idle');
        setConvertedFiles([]);
        setProgress(0);
        setError(null);
    };

    // Get accepted file types for input
    const getAcceptedTypes = () => {
        if (fromFormat === 'ANY') return 'image/*';
        if (fromFormat.toUpperCase() === 'PDF') return '.pdf,application/pdf';
        return allowedTypes[fromFormat.toUpperCase()]?.join(',') || 'image/*';
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20 relative z-10">
            <div className="text-center mb-12">
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight"
                >
                    {title || `${fromFormat} to ${toFormat} Converter`}
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-slate-400 text-lg font-light"
                >
                    {description || `Easily convert your ${fromFormat} images to ${toFormat} format in seconds. Batch processing supported.`}
                </motion.p>
            </div>

            <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className={`relative group rounded-[2rem] border-2 border-dashed transition-all duration-300 ${status === 'error' ? 'border-rose-500/50 bg-rose-500/5' :
                    files.length > 0 ? 'border-blue-500/50 bg-blue-500/5' : 'border-slate-800 bg-white/5 hover:border-blue-400 hover:bg-white/10'
                    } p-12 text-center backdrop-blur-sm`}
            >
                <AnimatePresence mode="wait">
                    {status === 'idle' && files.length === 0 && (
                        <motion.div
                            key="idle"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-3xl mx-auto flex items-center justify-center animate-float">
                                <Upload size={32} />
                            </div>
                            <div>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 mb-4 cursor-pointer"
                                >
                                    Choose {fromFormat === 'ANY' ? 'Files' : fromFormat} Files
                                </button>
                                <p className="text-slate-500 text-sm">or drag and drop multiple files here</p>
                                {fromFormat.toUpperCase() === 'PDF' && (
                                    <p className="text-amber-400 text-xs mt-2">Only PDF files are accepted</p>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {files.length > 0 && status !== 'success' && (
                        <motion.div
                            key="file-selected"
                            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                            className="space-y-8"
                        >
                            <div className="flex flex-col gap-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between gap-4 bg-white/5 p-4 rounded-xl border border-white/10 relative group-hover:border-white/20 transition-all">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center text-slate-300">
                                                <File size={20} />
                                            </div>
                                            <div className="text-left overflow-hidden">
                                                <p className="font-bold text-slate-200 truncate max-w-[200px]">{file.name}</p>
                                                <p className="text-xs text-slate-500">{(file.size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                        <button onClick={() => removeFile(idx)} className="text-slate-500 hover:text-rose-500 transition-colors bg-white/5 p-2 rounded-lg cursor-pointer">
                                            <X size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            {/* Add More Button */}
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="text-sm font-bold text-blue-400 hover:text-blue-300 cursor-pointer"
                            >
                                + Add More Files
                            </button>

                            {status === 'processing' ? (
                                <div className="space-y-4 max-w-sm mx-auto">
                                    <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-blue-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                    <p className="font-medium text-blue-400 animate-pulse text-sm uppercase tracking-widest">Converting {files.length} files...</p>
                                </div>
                            ) : (
                                <button
                                    onClick={convertImages}
                                    className="bg-white text-slate-900 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:text-blue-600 transition-all shadow-xl active:scale-95 flex items-center gap-3 mx-auto cursor-pointer"
                                >
                                    Convert All to {toFormat} <ArrowRight size={20} />
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
                                <h2 className="text-2xl font-bold text-white mb-2">Conversion Complete</h2>
                                <p className="text-slate-400 text-sm">Successfully converted {convertedFiles.length} files.</p>
                            </div>

                            <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                {convertedFiles.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                                        <span className="text-sm font-medium text-emerald-200 truncate max-w-[200px]">{file.originalName}</span>
                                        <a
                                            href={file.url}
                                            download={`converted-${idx}.${file.format}`}
                                            className="text-xs bg-emerald-500 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-400 transition-colors flex items-center gap-1 cursor-pointer"
                                        >
                                            <Download size={12} /> Save
                                        </a>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap justify-center gap-4">
                                {convertedFiles.length > 2 && (
                                    <button
                                        onClick={downloadAllAsZip}
                                        className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-lg hover:shadow-blue-600/20 active:scale-95 flex items-center gap-2 cursor-pointer"
                                    >
                                        <Download size={20} /> Download All (ZIP)
                                    </button>
                                )}
                                <button
                                    onClick={reset}
                                    className="bg-white/5 text-slate-300 px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 hover:text-white transition-all border border-white/5 cursor-pointer"
                                >
                                    Convert More
                                </button>
                            </div>
                        </motion.div>
                    )}

                    {status === 'error' && (
                        <motion.div
                            key="error"
                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-20 h-20 bg-rose-500/20 text-rose-500 rounded-full mx-auto flex items-center justify-center">
                                <AlertCircle size={40} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-white mb-2">Conversion Failed</h2>
                                <p className="text-rose-400 font-medium">{error}</p>
                            </div>
                            <button
                                onClick={reset}
                                className="bg-white/10 text-white px-8 py-3 rounded-xl font-bold hover:bg-white/20 transition-all cursor-pointer"
                            >
                                Try Again
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={onFileChange}
                    className="hidden"
                    multiple // Enable multiple selection
                    accept={getAcceptedTypes()}
                />
            </div>

            {/* Trust Badges / Info */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-sm">
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Secure</div>
                    <p className="text-slate-500 leading-relaxed font-light">Your files are processed locally in your browser. We never see your data.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">High Quality</div>
                    <p className="text-slate-500 leading-relaxed font-light">Professional algorithms ensure the best visual quality for every conversion.</p>
                </div>
                <div className="space-y-3">
                    <div className="text-slate-200 font-bold uppercase tracking-widest text-xs">Fast</div>
                    <p className="text-slate-500 leading-relaxed font-light">Harness your computer's power for near-instant processing without server lag.</p>
                </div>
            </div>

            <RelatedTools currentPath={pathname} />
        </div>
    );
}
