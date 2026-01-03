"use client";
import { useState, useRef, useEffect } from 'react';
import { Download, Upload, X, CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
    const [aspectRatio, setAspectRatio] = useState(true);
    const [status, setStatus] = useState('idle');
    const [resizedUrl, setResizedUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);

            const img = new Image();
            img.onload = () => {
                setOriginalSize({ width: img.width, height: img.height });
                setWidth(img.width);
                setHeight(img.height);
            };
            img.src = url;

            setStatus('idle');
            setResizedUrl(null);
        }
    };

    const handleWidthChange = (e) => {
        const newWidth = parseInt(e.target.value) || 0;
        setWidth(newWidth);
        if (aspectRatio && originalSize.width > 0) {
            setHeight(Math.round((newWidth / originalSize.width) * originalSize.height));
        }
    };

    const handleHeightChange = (e) => {
        const newHeight = parseInt(e.target.value) || 0;
        setHeight(newHeight);
        if (aspectRatio && originalSize.height > 0) {
            setWidth(Math.round((newHeight / originalSize.height) * originalSize.width));
        }
    };

    const resizeImage = () => {
        if (!file || !preview) return;
        setStatus('processing');

        const img = new Image();
        img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            setResizedUrl(canvas.toDataURL(file.type));
            setStatus('success');
        };
        img.src = preview;
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResizedUrl(null);
        setStatus('idle');
        setWidth(0);
        setHeight(0);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Image Resizer</h1>
                <p className="text-zinc-400 text-lg">Resize your images to any dimension easily.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-blue-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Upload size={32} className="text-blue-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Upload JPG, PNG, WEBP</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Preview */}
                            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[300px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={status === 'success' ? resizedUrl : preview} alt="Preview" className="max-w-full max-h-[400px] rounded-lg" />
                            </div>

                            {/* Controls */}
                            <div className="space-y-6">
                                <div className="space-y-4 bg-zinc-800/50 p-6 rounded-xl border border-white/10">
                                    <h3 className="text-white font-bold text-lg">Resize Options</h3>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2 block">Width (px)</label>
                                            <input
                                                type="number"
                                                value={width}
                                                onChange={handleWidthChange}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs text-zinc-400 font-bold uppercase tracking-wider mb-2 block">Height (px)</label>
                                            <input
                                                type="number"
                                                value={height}
                                                onChange={handleHeightChange}
                                                className="w-full bg-zinc-900 border border-white/10 rounded-lg px-4 py-3 text-white font-mono focus:border-blue-500 outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            id="aspectRatio"
                                            checked={aspectRatio}
                                            onChange={(e) => setAspectRatio(e.target.checked)}
                                            className="w-5 h-5 rounded border-white/20 bg-zinc-900 text-blue-600 focus:ring-blue-500"
                                        />
                                        <label htmlFor="aspectRatio" className="text-zinc-300 font-medium cursor-pointer">Maintain aspect ratio</label>
                                    </div>

                                    <div className="pt-4 border-t border-white/10 text-sm text-zinc-500">
                                        Original size: {originalSize.width} x {originalSize.height} px
                                    </div>
                                </div>

                                <div className="flex flex-col gap-4">
                                    {status === 'success' ? (
                                        <>
                                            <a
                                                href={resizedUrl}
                                                download={`resized-${file.name}`}
                                                className="bg-emerald-500 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-emerald-400 flex items-center justify-center gap-2 cursor-pointer transition-all"
                                            >
                                                <Download size={20} /> Download Resized Image
                                            </a>
                                            <button
                                                onClick={() => setStatus('idle')}
                                                className="bg-zinc-800 text-white w-full py-4 rounded-xl font-bold hover:bg-zinc-700 cursor-pointer transition-all"
                                            >
                                                Resize Again
                                            </button>
                                        </>
                                    ) : (
                                        <button
                                            onClick={resizeImage}
                                            className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-blue-500 cursor-pointer transition-all shadow-lg hover:shadow-blue-500/20"
                                        >
                                            {status === 'processing' ? 'Processing...' : 'Resize Image'}
                                        </button>
                                    )}

                                    <button
                                        onClick={reset}
                                        className="text-zinc-500 hover:text-white transition-colors text-sm font-medium py-2"
                                    >
                                        Start Over
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
