"use client";
import { useState, useRef } from 'react';
import { Barcode, Upload, Copy, Check, Loader2, AlertCircle, Link, RefreshCcw } from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/library';
import RelatedTools from '@/components/RelatedTools';

export default function BarcodeReader() {
    const [result, setResult] = useState(null);
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus('processing');
        setError(null);
        setResult(null);

        const imageUrl = URL.createObjectURL(file);
        setPreview(imageUrl);

        try {
            const codeReader = new BrowserMultiFormatReader();
            const result = await codeReader.decodeFromImageUrl(imageUrl);

            if (result) {
                setResult({
                    text: result.getText(),
                    format: result.getBarcodeFormat().toString(),
                    points: result.getResultPoints()
                });
                setStatus('success');
            } else {
                setError('No barcode found in the image. Please try a clearer image.');
                setStatus('error');
            }
        } catch (err) {
            console.error(err);
            setError('Could not find any barcode. Ensure the image is clear and the barcode is well-lit.');
            setStatus('error');
        }
    };

    const copyResult = async () => {
        if (!result) return;
        try {
            await navigator.clipboard.writeText(result.text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const reset = () => {
        setResult(null);
        setPreview(null);
        setStatus('idle');
        setError(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
    };

    const getFormatLabel = (format) => {
        // Map ZXing format numbers/enums to readable names if needed
        // For now, it returns strings like "EAN_13", "QR_CODE", etc.
        return format.replace('_', ' ');
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 flex items-center justify-center gap-4">
                    <Barcode size={40} className="text-amber-500" />
                    Barcode Reader
                </h1>
                <p className="text-zinc-400 text-lg text-balance">Scan and decode variety of barcodes (EAN, UPC, Code 128, etc.) from images with precision.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2.5rem] border border-white/10 p-8 md:p-12 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

                {!preview ? (
                    <div className="group relative">
                        <div className="py-20 text-center border-4 border-dashed border-white/5 rounded-[2rem] transition-all hover:border-amber-500/30 bg-white/[0.02] hover:bg-white/[0.04]">
                            <div className="w-24 h-24 bg-amber-500/10 rounded-3xl mx-auto mb-8 flex items-center justify-center transition-transform group-hover:scale-110 duration-300">
                                <Upload size={40} className="text-amber-500" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Upload Image</h3>
                            <p className="text-zinc-500 mb-8 max-w-xs mx-auto">Click to select or drag and drop your barcode image here</p>
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-gradient-to-r from-amber-500 to-amber-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:from-amber-600 hover:to-amber-700 transition-all shadow-[0_10px_40px_-10px_rgba(245,158,11,0.3)] cursor-pointer active:scale-95"
                            >
                                Select File
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                            <div className="mt-8 flex justify-center gap-6 text-zinc-600 font-medium text-sm">
                                <span>PNG</span>
                                <span>JPG</span>
                                <span>WEBP</span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {/* Preview and Results Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                            {/* Image Preview */}
                            <div className="relative group rounded-3xl overflow-hidden bg-zinc-800/80 border border-white/10 p-2 lg:p-4 aspect-square flex items-center justify-center shadow-inner">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="Barcode" className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl transition-transform duration-500 group-hover:scale-[1.02]" />

                                <button
                                    onClick={reset}
                                    className="absolute top-6 right-6 p-3 bg-black/60 backdrop-blur-md rounded-full text-white hover:bg-rose-500 transition-all opacity-0 group-hover:opacity-100 cursor-pointer shadow-lg"
                                    title="Clear Image"
                                >
                                    <RefreshCcw size={20} />
                                </button>

                                {status === 'processing' && (
                                    <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center rounded-3xl">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="relative">
                                                <div className="absolute inset-0 bg-amber-500/20 rounded-full animate-ping" />
                                                <Loader2 size={48} className="text-amber-500 animate-spin relative" />
                                            </div>
                                            <span className="font-black text-white text-lg tracking-wider">DECODING...</span>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Result Area */}
                            <div className="flex flex-col h-full">
                                {status === 'error' && (
                                    <div className="flex flex-col items-center justify-center flex-grow p-8 bg-rose-500/5 border-2 border-dashed border-rose-500/20 rounded-3xl text-rose-400 text-center animate-in fade-in zoom-in duration-300">
                                        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center mb-4">
                                            <AlertCircle size={32} />
                                        </div>
                                        <h4 className="text-xl font-bold mb-2">Decoding Failed</h4>
                                        <p className="text-sm font-medium opacity-80 leading-relaxed">{error}</p>
                                    </div>
                                )}

                                {status === 'success' && result && (
                                    <div className="flex flex-col flex-grow space-y-6 animate-in slide-in-from-right duration-500">
                                        <div className="p-1 bg-white/[0.02] border border-white/5 rounded-3xl">
                                            <div className="bg-zinc-800/50 p-6 rounded-[1.4rem] border border-white/10 space-y-4">
                                                <div className="flex justify-between items-center">
                                                    <span className="px-3 py-1 bg-amber-500/10 text-amber-500 rounded-lg text-xs font-black tracking-widest uppercase">
                                                        {getFormatLabel(result.format)}
                                                    </span>
                                                    <span className="text-zinc-500 text-xs font-bold flex items-center gap-1">
                                                        <Check size={14} className="text-emerald-500" /> Decoded Successfully
                                                    </span>
                                                </div>

                                                <div className="space-y-2">
                                                    <label className="text-xs font-black text-zinc-500 uppercase tracking-widest">Decoded Content</label>
                                                    <div className="relative group">
                                                        <div className="w-full p-5 bg-black/40 rounded-2xl font-mono text-zinc-100 text-lg break-all border border-white/5 min-h-[120px] shadow-inner selection:bg-amber-500/30">
                                                            {result.text}
                                                        </div>
                                                        <button
                                                            onClick={copyResult}
                                                            className="absolute top-4 right-4 p-3 bg-zinc-800 hover:bg-amber-500 text-white rounded-xl transition-all shadow-xl cursor-pointer active:scale-90"
                                                            title="Copy to clipboard"
                                                        >
                                                            {copied ? <Check size={20} className="text-white" /> : <Copy size={20} />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                onClick={() => fileInputRef.current?.click()}
                                                className="flex-grow bg-white/5 hover:bg-white/10 text-white p-5 rounded-2xl font-bold transition-all border border-white/10 flex items-center justify-center gap-3 cursor-pointer"
                                            >
                                                <Upload size={20} /> New Scan
                                            </button>
                                            <button
                                                onClick={reset}
                                                className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 p-5 rounded-2xl font-bold transition-all flex items-center justify-center gap-3 cursor-pointer"
                                            >
                                                Clear
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {status === 'processing' && (
                                    <div className="flex-grow flex items-center justify-center border-2 border-dashed border-white/5 rounded-3xl italic text-zinc-600">
                                        Analyzing pixels...
                                    </div>
                                )}
                            </div>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                    </div>
                )}
            </div>

            <div className="mt-20">
                <RelatedTools />
            </div>
        </div>
    );
}
