"use client";
import { useState, useRef } from 'react';
import { Download, Upload, Sliders, ArrowRight } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import { usePathname } from 'next/navigation';

export default function ImageCompressor() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [quality, setQuality] = useState(0.8);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const [status, setStatus] = useState('idle');
    const [compressedUrl, setCompressedUrl] = useState(null);
    const fileInputRef = useRef(null);
    const pathname = usePathname();

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);
            setStatus('idle');
            setCompressedUrl(null);
            setCompressedSize(0);
        }
    };

    const compressImage = () => {
        if (!file || !preview) return;
        setStatus('processing');

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Adjust format based on original file type if possible, or default to jpeg for compression
            const format = file.type === 'image/png' ? 'image/jpeg' : file.type;

            const url = canvas.toDataURL(format, quality);

            // Calculate approximate size
            const head = 'data:' + format + ';base64,';
            const size = Math.round((url.length - head.length) * 3 / 4);

            setCompressedSize(size);
            setCompressedUrl(url);
            setStatus('success');
        };
        img.src = preview;
    };

    const formatSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setCompressedUrl(null);
        setStatus('idle');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Image Compressor</h1>
                <p className="text-zinc-400 text-lg">Reduce image file size while maintaining quality.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Upload size={32} className="text-green-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-green-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-green-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Supports all standard image formats</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Image Preview */}
                        <div className="space-y-4">
                            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[300px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={status === 'success' ? compressedUrl : preview} alt="Preview" className="max-w-full max-h-[400px] rounded-lg" />
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-zinc-400">Original: <span className="text-white">{formatSize(originalSize)}</span></span>
                                {status === 'success' && (
                                    <span className="text-green-400">Compressed: <span className="text-white">{formatSize(compressedSize)}</span> (-{Math.round((1 - compressedSize / originalSize) * 100)}%)</span>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-8 bg-zinc-800/30 p-8 rounded-2xl border border-white/5">
                            <div>
                                <label className="flex items-center justify-between text-zinc-300 font-bold mb-4">
                                    <span className="flex items-center gap-2"><Sliders size={18} /> Compression Level</span>
                                    <span className="text-green-400">{Math.round(quality * 100)}%</span>
                                </label>
                                <input
                                    type="range"
                                    min="0.1"
                                    max="1"
                                    step="0.05"
                                    value={quality}
                                    onChange={(e) => {
                                        setQuality(parseFloat(e.target.value));
                                        if (status === 'success') setStatus('idle'); // Reset if changed
                                    }}
                                    className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-green-500"
                                />
                                <div className="flex justify-between text-xs text-zinc-500 mt-2">
                                    <span>Lower Quality (Smaller)</span>
                                    <span>Higher Quality (Larger)</span>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                {status === 'success' ? (
                                    <>
                                        <a
                                            href={compressedUrl}
                                            download={`compressed-${file.name}`}
                                            className="bg-green-500 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-green-400 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-green-500/20"
                                        >
                                            <Download size={20} /> Download Compressed
                                        </a>
                                        <button
                                            onClick={compressImage}
                                            className="bg-zinc-800 text-white w-full py-4 rounded-xl font-bold hover:bg-zinc-700 cursor-pointer transition-all"
                                        >
                                            Re-Compress
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={compressImage}
                                        className="bg-green-600 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-green-500 cursor-pointer transition-all shadow-lg hover:shadow-green-500/20 flex items-center justify-center gap-2"
                                    >
                                        {status === 'processing' ? 'Compressing...' : 'Compress Image'}
                                        {!status.includes('process') && <ArrowRight size={20} />}
                                    </button>
                                )}

                                <button
                                    onClick={reset}
                                    className="w-full text-zinc-500 hover:text-white transition-colors text-sm font-medium py-2"
                                >
                                    Start Over
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <RelatedTools currentPath={pathname} />
        </div>
    );
}
