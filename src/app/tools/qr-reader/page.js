"use client";
import { useState, useRef, useEffect } from 'react';
import { QrCode, Upload, Copy, Check, Camera, Loader2, AlertCircle, Link } from 'lucide-react';
import jsQR from 'jsqr';

export default function QRReader() {
    const [result, setResult] = useState('');
    const [copied, setCopied] = useState(false);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('idle');
    const [error, setError] = useState(null);
    const fileInputRef = useRef(null);
    const canvasRef = useRef(null);

    const handleFile = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setStatus('processing');
        setError(null);
        setResult('');
        setPreview(URL.createObjectURL(file));

        const img = new Image();
        img.onload = () => {
            try {
                const canvas = document.createElement('canvas');
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);

                const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, {
                    inversionAttempts: "dontInvert",
                });

                if (code) {
                    setResult(code.data);
                    setStatus('success');
                } else {
                    // Try with inverted colors
                    const invertedCode = jsQR(imageData.data, imageData.width, imageData.height, {
                        inversionAttempts: "attemptBoth",
                    });

                    if (invertedCode) {
                        setResult(invertedCode.data);
                        setStatus('success');
                    } else {
                        setError('No QR code found in the image. Please try a clearer image.');
                        setStatus('error');
                    }
                }
            } catch (err) {
                console.error(err);
                setError('Failed to process image.');
                setStatus('error');
            }
        };
        img.onerror = () => {
            setError('Failed to load image.');
            setStatus('error');
        };
        img.src = URL.createObjectURL(file);
    };

    const copyResult = async () => {
        try {
            await navigator.clipboard.writeText(result);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Copy failed:', err);
        }
    };

    const openUrl = () => {
        try {
            const url = new URL(result);
            window.open(url.href, '_blank');
        } catch {
            // Not a valid URL
        }
    };

    const isValidUrl = (str) => {
        try {
            new URL(str);
            return true;
        } catch {
            return false;
        }
    };

    const reset = () => {
        setResult('');
        setPreview(null);
        setStatus('idle');
        setError(null);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">QR Code Reader</h1>
                <p className="text-zinc-400 text-lg">Scan and decode QR codes from images.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!preview ? (
                    <div className="py-16 text-center border-4 border-dashed border-white/10 rounded-3xl mb-8 bg-white/5">
                        <div className="w-20 h-20 bg-amber-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <QrCode size={32} className="text-amber-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-amber-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-amber-700 transition-all shadow-xl cursor-pointer"
                        >
                            Upload QR Code Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Supports PNG, JPG, and other image formats</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Preview */}
                        <div className="rounded-xl overflow-hidden bg-zinc-800 p-4 max-h-[300px] flex items-center justify-center border border-white/10">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={preview} alt="QR Code" className="max-w-full max-h-[280px] rounded-lg" />
                        </div>

                        {status === 'processing' && (
                            <div className="flex items-center justify-center gap-3 text-zinc-400">
                                <Loader2 size={24} className="animate-spin" />
                                <span className="font-bold text-white">Scanning...</span>
                            </div>
                        )}

                        {status === 'error' && (
                            <div className="flex items-center gap-3 p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400">
                                <AlertCircle size={20} />
                                <span className="text-sm font-medium">{error}</span>
                            </div>
                        )}

                        {status === 'success' && result && (
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-white">Decoded Content</label>
                                <div className="flex items-center gap-4 p-4 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                    <p className="flex-grow text-emerald-100 font-mono break-all">{result}</p>
                                    <div className="flex gap-2 flex-shrink-0">
                                        {isValidUrl(result) && (
                                            <button
                                                onClick={openUrl}
                                                className="p-3 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                                                title="Open URL"
                                            >
                                                <Link size={20} className="text-emerald-600" />
                                            </button>
                                        )}
                                        <button
                                            onClick={copyResult}
                                            className="p-3 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
                                        >
                                            {copied ? <Check size={20} className="text-emerald-500" /> : <Copy size={20} className="text-emerald-100" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700 transition-all cursor-pointer"
                            >
                                Scan Another
                            </button>
                            <button
                                onClick={reset}
                                className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-700 transition-all cursor-pointer"
                            >
                                Clear
                            </button>
                        </div>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                    </div>
                )}
            </div>
        </div>
    );
}
