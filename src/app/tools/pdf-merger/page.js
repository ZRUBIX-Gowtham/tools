"use client";
import { useState, useRef } from 'react';
import { Download, Upload, FileText, Plus, X, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

export default function PdfMerger() {
    const [files, setFiles] = useState([]);
    const [status, setStatus] = useState('idle');
    const [mergedPdfUrl, setMergedPdfUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFiles = (e) => {
        const selectedFiles = Array.from(e.target.files);
        const validFiles = selectedFiles.filter(f => f.type === 'application/pdf');

        if (validFiles.length > 0) {
            setFiles(prev => [...prev, ...validFiles]);
            setStatus('idle');
            setMergedPdfUrl(null);
        }
    };

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const mergePdfs = async () => {
        if (files.length < 2) return;
        setStatus('processing');

        try {
            const mergedPdf = await PDFDocument.create();

            for (const file of files) {
                const arrayBuffer = await file.arrayBuffer();
                const pdf = await PDFDocument.load(arrayBuffer);
                const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
                copiedPages.forEach((page) => mergedPdf.addPage(page));
            }

            const pdfBytes = await mergedPdf.save();
            const blob = new Blob([pdfBytes], { type: 'application/pdf' });
            setMergedPdfUrl(URL.createObjectURL(blob));
            setStatus('success');

        } catch (error) {
            console.error(error);
            setStatus('error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">PDF Merger</h1>
                <p className="text-zinc-400 text-lg">Combine multiple PDF files into one document.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {files.length === 0 ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FileText size={32} className="text-red-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select PDF Files
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept="application/pdf" multiple />
                        <p className="text-zinc-500 mt-4 text-sm">Upload multiple PDFs to merge</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* File List */}
                        <div className="space-y-3">
                            <h3 className="text-zinc-400 font-bold uppercase text-xs tracking-wider">Files to Merge ({files.length})</h3>
                            <div className="bg-zinc-800/50 rounded-2xl border border-white/10 overflow-hidden">
                                {files.map((file, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="text-zinc-500 text-xs font-mono">{idx + 1}</div>
                                            <FileText size={20} className="text-red-400" />
                                            <span className="text-white font-medium truncate max-w-[200px]">{file.name}</span>
                                        </div>
                                        <button onClick={() => removeFile(idx)} className="text-zinc-500 hover:text-red-400 p-2">
                                            <X size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="flex items-center gap-2 text-sm font-bold text-red-500 hover:text-red-400"
                            >
                                <Plus size={16} /> Add More Files
                            </button>
                        </div>

                        {status === 'success' && (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-white font-bold text-xl mb-2">Merge Complete!</h3>
                                <a
                                    href={mergedPdfUrl}
                                    download="merged.pdf"
                                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all mt-4"
                                >
                                    <Download size={20} /> Download Merged PDF
                                </a>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="flex items-center justify-center gap-3 text-white py-4">
                                <Loader2 size={24} className="animate-spin text-red-500" />
                                <span className="font-bold">Merging PDFs...</span>
                            </div>
                        )}

                        {status === 'idle' && (
                            <button
                                onClick={mergePdfs}
                                disabled={files.length < 2}
                                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${files.length < 2 ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-500 cursor-pointer shadow-red-500/20'
                                    }`}
                            >
                                Merge {files.length} PDF{files.length !== 1 && 's'} <ArrowRight size={20} />
                            </button>
                        )}

                        <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept="application/pdf" multiple />
                    </div>
                )}
            </div>
        </div>
    );
}

import { CheckCircle2 as CheckCircleIcon } from 'lucide-react';
