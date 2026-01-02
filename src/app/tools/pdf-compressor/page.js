"use client";
import { useState, useRef } from 'react';
import { FileText, Download, X, Loader2, AlertCircle } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

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

    const compress = async () => {
        if (!file) return;
        setStatus('processing');
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFDocument.load(arrayBuffer, { ignoreEncryption: true });

            // Get all pages and optimize
            const pages = pdfDoc.getPages();

            // Remove unused objects and compress
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
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">PDF Compressor</h1>
                <p className="text-slate-500 text-lg">Reduce PDF file size while maintaining quality.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                        <div className="w-20 h-20 bg-red-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FileText size={32} className="text-red-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-700 transition-all shadow-xl cursor-pointer"
                        >
                            Select PDF File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept=".pdf" />
                        <p className="text-slate-400 mt-4 text-sm">Upload a PDF file to compress</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-16 h-16 bg-red-100 rounded-xl flex items-center justify-center">
                                <FileText size={24} className="text-red-600" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                            <button onClick={() => { setFile(null); setStatus('idle'); setError(null); }} className="text-slate-400 hover:text-rose-500 cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 bg-rose-50 rounded-xl text-rose-600">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                <p className="text-emerald-700 font-bold text-lg">
                                    Compressed by {compressionPercent}%
                                </p>
                                <p className="text-emerald-600 text-sm">
                                    {(originalSize / 1024 / 1024).toFixed(2)} MB → {(compressedSize / 1024 / 1024).toFixed(2)} MB
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center">
                            {status === 'success' ? (
                                <div className="flex gap-4">
                                    <a href={compressedUrl} download={`compressed-${file.name}`} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3 cursor-pointer">
                                        <Download size={20} /> Download Compressed
                                    </a>
                                    <button onClick={() => setStatus('idle')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold cursor-pointer">Compress Again</button>
                                </div>
                            ) : status === 'processing' ? (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="font-bold">Compressing...</span>
                                </div>
                            ) : (
                                <button onClick={compress} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-red-600 transition-all shadow-xl cursor-pointer">
                                    Compress PDF
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
