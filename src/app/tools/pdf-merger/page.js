"use client";
import { useState, useRef } from 'react';
import { FileText, Download, X, Loader2, Plus, AlertCircle, GripVertical } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

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
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">PDF Merger</h1>
                <p className="text-slate-500 text-lg">Combine multiple PDF files into one document.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                {files.length === 0 ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FileText size={32} className="text-red-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl cursor-pointer"
                        >
                            Select PDF Files
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept=".pdf" multiple />
                        <p className="text-slate-400 mt-4 text-sm">Select multiple PDF files to merge</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <p className="text-sm text-slate-500 text-center">Drag to reorder files</p>
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                            {files.map((file, idx) => (
                                <div
                                    key={idx}
                                    draggable
                                    onDragStart={() => handleDragStart(idx)}
                                    onDragOver={(e) => handleDragOver(e, idx)}
                                    onDragEnd={handleDragEnd}
                                    className={`flex items-center gap-4 p-4 bg-slate-50 rounded-xl cursor-move transition-all ${draggedIndex === idx ? 'opacity-50 scale-95' : ''}`}
                                >
                                    <GripVertical size={18} className="text-slate-400" />
                                    <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                                        <FileText size={20} className="text-red-600" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-bold text-slate-900 truncate">{file.name}</p>
                                        <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                                    </div>
                                    <span className="text-xs font-bold text-slate-400 bg-slate-200 px-2 py-1 rounded">#{idx + 1}</span>
                                    <button onClick={() => removeFile(idx)} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                                        <X size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-500 hover:border-red-500 hover:text-red-500 transition-all flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Plus size={20} /> Add More PDFs
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFiles} className="hidden" accept=".pdf" multiple />

                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl text-rose-600">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="space-y-2">
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-slate-500 text-center">Merging {files.length} PDFs...</p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            {status === 'success' ? (
                                <div className="flex gap-4">
                                    <a href={mergedUrl} download="merged.pdf" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer">
                                        <Download size={20} /> Download Merged PDF
                                    </a>
                                    <button onClick={() => { setStatus('idle'); setFiles([]); }} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold cursor-pointer">Start Over</button>
                                </div>
                            ) : status === 'processing' ? (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="font-bold">Merging PDFs...</span>
                                </div>
                            ) : (
                                <button
                                    onClick={merge}
                                    disabled={files.length < 2}
                                    className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-red-600 transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                >
                                    Merge {files.length} PDFs
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
