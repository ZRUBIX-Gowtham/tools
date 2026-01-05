"use client";
import { useState, useRef } from 'react';
import { Download, Upload, FileText, Settings, ArrowRight, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import jsPDF from 'jspdf';
import { PDFDocument } from 'pdf-lib';

const loadPdfJs = async () => {
    const pdfjsLib = await import('pdfjs-dist');
    if (typeof window !== 'undefined') {
        // Force local worker to avoid CDN fetch issues
        pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';
    }
    return pdfjsLib;
};

export default function PdfCompressor() {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState('idle');
    const [compressionAmount, setCompressionAmount] = useState(0.5); // 0.5 = 50% compression
    const [progress, setProgress] = useState(0);
    const [compressedPdfUrl, setCompressedPdfUrl] = useState(null);
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
            setCompressedPdfUrl(null);
            setCompressedSize(0);
            setProgress(0);
        }
    };

    const compressPdf = async () => {
        if (!file) return;

        setStatus('processing');
        setProgress(0);
        setError(null);

        try {
            const arrayBuffer = await file.arrayBuffer();

            // Phase 1: Try fast optimization with pdf-lib
            const pdfDoc = await PDFDocument.load(arrayBuffer);
            const fastOptimizedBytes = await pdfDoc.save({ useObjectStreams: true });

            // jpegQuality is inverse of compressionAmount
            const jpegQuality = 1 - compressionAmount;

            if (compressionAmount < 0.3 && fastOptimizedBytes.length < originalSize) {
                const pdfBlob = new Blob([fastOptimizedBytes], { type: 'application/pdf' });
                setCompressedSize(pdfBlob.size);
                setCompressedPdfUrl(URL.createObjectURL(pdfBlob));
                setStatus('success');
                return;
            }

            // Phase 2: Visual Compression via Rendering
            const pdfLib = await loadPdfJs();
            const pdf = await pdfLib.getDocument({ data: arrayBuffer }).promise;
            const totalPages = pdf.numPages;

            // Initialize jsPDF with points (pt) to match PDF.js viewport
            const newPdf = new jsPDF({
                orientation: 'p',
                unit: 'pt',
                compress: true
            });

            for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
                const page = await pdf.getPage(pageNum);

                // Smarter scaling: 
                // compression 0%  -> scale 1.0
                // compression 50% -> scale 0.8
                // compression 90% -> scale 0.5
                const scale = compressionAmount > 0.7 ? 0.6 : (compressionAmount > 0.4 ? 0.8 : 1.0);
                const viewport = page.getViewport({ scale });

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d', { alpha: false }); // Opt-out of alpha for speed
                canvas.width = viewport.width;
                canvas.height = viewport.height;

                // Fill white background for JPEGs
                context.fillStyle = '#ffffff';
                context.fillRect(0, 0, canvas.width, canvas.height);

                await page.render({
                    canvasContext: context,
                    viewport,
                    intent: 'print' // Better quality for compression
                }).promise;

                // Compress as JPEG
                const imgData = canvas.toDataURL('image/jpeg', jpegQuality);

                if (pageNum > 1) {
                    newPdf.addPage([viewport.width, viewport.height]);
                } else {
                    // Fix first page size
                    newPdf.deletePage(1);
                    newPdf.addPage([viewport.width, viewport.height]);
                }

                newPdf.setPage(pageNum);
                newPdf.addImage(
                    imgData,
                    'JPEG',
                    0,
                    0,
                    viewport.width,
                    viewport.height,
                    undefined,
                    'FAST' // Use fast compression
                );

                setProgress(Math.round((pageNum / totalPages) * 100));

                // Cleanup canvas to free memory
                canvas.width = 0;
                canvas.height = 0;
            }

            const pdfBlob = newPdf.output('blob');
            const newSize = pdfBlob.size;

            if (newSize >= originalSize) {
                // If rendering made it larger, use the pdf-lib optimized version instead
                if (fastOptimizedBytes.length < originalSize) {
                    const betterBlob = new Blob([fastOptimizedBytes], { type: 'application/pdf' });
                    setCompressedSize(betterBlob.size);
                    setCompressedPdfUrl(URL.createObjectURL(betterBlob));
                    setStatus('success');
                } else {
                    setError(`Already optimized. Original is smaller than compressed version.`);
                    setCompressedSize(newSize);
                    setCompressedPdfUrl(URL.createObjectURL(pdfBlob));
                    setStatus('error');
                }
            } else {
                setCompressedSize(newSize);
                setCompressedPdfUrl(URL.createObjectURL(pdfBlob));
                setStatus('success');
            }

        } catch (error) {
            console.error(error);
            setError("Failed to compress. Some PDFs are encrypted or protected.");
            setStatus('error');
        }
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const alphabet = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + alphabet[i];
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">PDF Compressor</h1>
                <p className="text-zinc-400 text-lg">Reduce PDF file size by optimizing pages.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-red-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FileText size={32} className="text-red-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-red-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select PDF File
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="application/pdf" />
                        <p className="text-zinc-500 mt-4 text-sm">Upload any PDF document</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between p-6 bg-zinc-800/50 rounded-2xl border border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-red-500/10 rounded-xl text-red-500">
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 className="text-white font-bold text-lg truncate max-w-[200px] md:max-w-md">{file.name}</h3>
                                    <p className="text-zinc-400 text-sm">{formatSize(originalSize)}</p>
                                </div>
                            </div>
                            <button onClick={() => setFile(null)} className="text-zinc-500 hover:text-white transition-colors cursor-pointer">
                                Change
                            </button>
                        </div>

                        {/* Compression Controls */}
                        <div className="bg-zinc-800/30 p-6 rounded-2xl border border-white/5 space-y-4">
                            <div className="flex justify-between items-center text-white font-bold">
                                <span className="flex items-center gap-2"><Settings size={18} /> Compression Amount</span>
                                <span className="text-red-400">{Math.round(compressionAmount * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                min="10"
                                max="90"
                                step="10"
                                value={Math.round(compressionAmount * 100)}
                                onChange={(e) => setCompressionAmount(parseFloat(e.target.value) / 100)}
                                disabled={status === 'processing'}
                                className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                            />
                            <div className="flex justify-between text-xs text-zinc-500 font-bold uppercase tracking-wider">
                                <span>Low Compression</span>
                                <span>High Compression</span>
                            </div>
                        </div>

                        {originalSize < 1024 * 1024 * 2 && status === 'idle' && (
                            <div className="flex items-center gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                                <AlertCircle size={20} />
                                <span className="text-xs font-medium">This file is quite small ({formatSize(originalSize)}). Compression is most effective on files larger than 2MB. Results may vary.</span>
                            </div>
                        )}

                        {status === 'processing' && (
                            <div className="space-y-2">
                                <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-red-500 transition-all duration-300"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                                <p className="text-sm text-zinc-300 text-center">Compressing PDF... {progress}%</p>
                            </div>
                        )}

                        {status === 'success' && (
                            <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center">
                                <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-4" />
                                <h3 className="text-white font-bold text-xl mb-2">Compression Complete!</h3>
                                <div className="text-sm font-medium mb-4">
                                    <span className="text-zinc-400 line-through mr-2">{formatSize(originalSize)}</span>
                                    <span className="text-emerald-400">{formatSize(compressedSize)}</span>
                                    <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded ml-2">-{Math.round((1 - compressedSize / originalSize) * 100)}%</span>
                                </div>
                                <a
                                    href={compressedPdfUrl}
                                    download={`compressed-${file.name}`}
                                    className="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-emerald-400 transition-all"
                                >
                                    <Download size={20} /> Download PDF
                                </a>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex flex-col gap-4">
                                <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                                    <AlertCircle size={20} />
                                    <span className="text-sm font-medium">{error || "Failed to compress PDF. Try a different file."}</span>
                                </div>
                                {compressedPdfUrl && (
                                    <div className="text-center">
                                        <p className="text-xs text-zinc-500 mb-2">You can still download the processed version if you wish:</p>
                                        <a
                                            href={compressedPdfUrl}
                                            download={`processed-${file.name}`}
                                            className="text-xs text-zinc-400 underline hover:text-white"
                                        >
                                            Download Processed PDF ({formatSize(compressedSize)})
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        {status !== 'processing' && status !== 'success' && (
                            <button
                                onClick={compressPdf}
                                className="bg-red-600 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-red-500 cursor-pointer transition-all shadow-lg hover:shadow-red-500/20 flex items-center justify-center gap-2"
                            >
                                Compress PDF <ArrowRight size={20} />
                            </button>
                        )}

                    </div>
                )}
            </div>

            <RelatedTools />
        </div >
    );
}


