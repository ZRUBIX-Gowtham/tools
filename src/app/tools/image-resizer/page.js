"use client";
import { useState, useRef } from 'react';
import { Download, Upload, Sliders, ArrowRight, X, Maximize, Crop } from 'lucide-react';
import RelatedTools from '@/components/RelatedTools';
import { usePathname } from 'next/navigation';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);

    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [aspectRatio, setAspectRatio] = useState(true);
    const [originalDimensions, setOriginalDimensions] = useState({ w: 0, h: 0 });
    const [status, setStatus] = useState('idle');
    const [resizedUrl, setResizedUrl] = useState(null);
    const fileInputRef = useRef(null);
    const pathname = usePathname();

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            const url = URL.createObjectURL(selectedFile);
            setPreview(url);

            // Get dimensions
            const img = new Image();
            img.onload = () => {
                setOriginalDimensions({ w: img.width, h: img.height });
                setWidth(img.width);
                setHeight(img.height);
            };
            img.src = url;

            setStatus('idle');
            setResizedUrl(null);
        }
    };

    const handleDimensionChange = (type, value) => {
        const val = parseInt(value) || 0;
        if (type === 'width') {
            setWidth(val);
            if (aspectRatio && originalDimensions.w > 0) {
                setHeight(Math.round(val * (originalDimensions.h / originalDimensions.w)));
            }
        } else {
            setHeight(val);
            if (aspectRatio && originalDimensions.h > 0) {
                setWidth(Math.round(val * (originalDimensions.w / originalDimensions.h)));
            }
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

            // High quality resizing
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';

            ctx.drawImage(img, 0, 0, width, height);

            const url = canvas.toDataURL(file.type);
            setResizedUrl(url);
            setStatus('success');
        };
        img.src = preview;
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setResizedUrl(null);
        setStatus('idle');
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Image Resizer</h1>
                <p className="text-zinc-400 text-lg">Resize images to specific dimensions instantly.</p>
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
                        <p className="text-zinc-500 mt-4 text-sm">Supports PNG, JPG, WEBP and more</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                        {/* Image Preview */}
                        <div className="space-y-4">
                            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[300px] overflow-hidden">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={status === 'success' ? resizedUrl : preview} alt="Preview" className="max-w-full max-h-[400px] rounded-lg object-contain" />
                            </div>
                            <div className="flex justify-between text-sm font-medium">
                                <span className="text-zinc-400">Original: <span className="text-white">{originalDimensions.w} x {originalDimensions.h}</span></span>
                                {status === 'success' && (
                                    <span className="text-blue-400">Resized: <span className="text-white">{width} x {height}</span></span>
                                )}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="space-y-8 bg-zinc-800/30 p-8 rounded-2xl border border-white/5">
                            <div className="space-y-4">
                                <label className="flex items-center gap-2 text-zinc-300 font-bold mb-4">
                                    <Maximize size={18} className="text-blue-500" /> Dimensions
                                </label>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Width (px)</label>
                                        <input
                                            type="number"
                                            value={width}
                                            onChange={(e) => handleDimensionChange('width', e.target.value)}
                                            className="w-full p-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 outline-none font-mono"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase">Height (px)</label>
                                        <input
                                            type="number"
                                            value={height}
                                            onChange={(e) => handleDimensionChange('height', e.target.value)}
                                            className="w-full p-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white focus:border-blue-500 outline-none font-mono"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="aspect"
                                        checked={aspectRatio}
                                        onChange={(e) => setAspectRatio(e.target.checked)}
                                        className="w-4 h-4 rounded border-zinc-600 bg-zinc-700 text-blue-600 focus:ring-blue-500"
                                    />
                                    <label htmlFor="aspect" className="text-sm text-zinc-300 cursor-pointer select-none">
                                        Maintain Aspect Ratio
                                    </label>
                                </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-white/10">
                                {status === 'success' ? (
                                    <>
                                        <a
                                            href={resizedUrl}
                                            download={`resized-${file.name}`}
                                            className="bg-blue-500 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-blue-400 flex items-center justify-center gap-2 cursor-pointer transition-all shadow-lg hover:shadow-blue-500/20"
                                        >
                                            <Download size={20} /> Download Resized
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
                                        className="bg-blue-600 text-white w-full py-4 rounded-xl font-bold text-lg hover:bg-blue-500 cursor-pointer transition-all shadow-lg hover:shadow-blue-500/20 flex items-center justify-center gap-2"
                                    >
                                        {status === 'processing' ? 'Resizing...' : 'Resize Image'}
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
