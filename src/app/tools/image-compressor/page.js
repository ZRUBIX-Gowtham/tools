"use client";
import { useState, useRef } from 'react';
import { FileImage, Download, X, Loader2 } from 'lucide-react';

export default function ImageCompressor() {
    const [file, setFile] = useState(null);
    const [quality, setQuality] = useState(80);
    const [status, setStatus] = useState('idle');
    const [compressedUrl, setCompressedUrl] = useState(null);
    const [originalSize, setOriginalSize] = useState(0);
    const [compressedSize, setCompressedSize] = useState(0);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setOriginalSize(selectedFile.size);
            setStatus('idle');
        }
    };

    const compress = () => {
        if (!file) return;
        setStatus('processing');

        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const dataUrl = canvas.toDataURL('image/jpeg', quality / 100);
                setCompressedUrl(dataUrl);

                // Estimate compressed size
                const base64Length = dataUrl.length - 'data:image/jpeg;base64,'.length;
                setCompressedSize(Math.round(base64Length * 0.75));

                setStatus('success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Image Compressor</h1>
                <p className="text-slate-500 text-lg">Reduce image file size while maintaining quality.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                        <div className="w-20 h-20 bg-orange-100 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <FileImage size={32} className="text-orange-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-orange-700 transition-all shadow-xl"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-16 h-16 bg-orange-100 rounded-xl flex items-center justify-center">
                                <FileImage size={24} className="text-orange-600" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-400">Original: {(originalSize / 1024).toFixed(1)} KB</p>
                            </div>
                            <button onClick={() => { setFile(null); setStatus('idle'); }} className="text-slate-400 hover:text-rose-500">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-bold text-slate-700 block">Quality: {quality}%</label>
                            <input
                                type="range"
                                min="10"
                                max="100"
                                value={quality}
                                onChange={(e) => setQuality(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-orange-600"
                            />
                            <div className="flex justify-between text-xs text-slate-400">
                                <span>Smaller file</span>
                                <span>Higher quality</span>
                            </div>
                        </div>

                        {status === 'success' && (
                            <div className="p-4 bg-emerald-50 rounded-xl text-center">
                                <p className="text-emerald-700 font-bold">
                                    Compressed: {(compressedSize / 1024).toFixed(1)} KB
                                    <span className="text-emerald-500 ml-2">({Math.round((1 - compressedSize / originalSize) * 100)}% smaller)</span>
                                </p>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            {status === 'success' ? (
                                <>
                                    <a href={compressedUrl} download="compressed-image.jpg" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 flex items-center gap-3">
                                        <Download size={20} /> Download
                                    </a>
                                    <button onClick={() => setStatus('idle')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold">Adjust</button>
                                </>
                            ) : status === 'processing' ? (
                                <div className="flex items-center gap-3 text-slate-600">
                                    <Loader2 size={24} className="animate-spin" />
                                    <span className="font-bold">Compressing...</span>
                                </div>
                            ) : (
                                <button onClick={compress} className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-orange-600 transition-all shadow-xl">
                                    Compress Image
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
