"use client";
import { useState, useRef } from 'react';
import { Upload, X, Loader2, Sparkles } from 'lucide-react';

export default function BackgroundRemover() {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [status, setStatus] = useState('idle'); // idle, processing, success, error
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type.startsWith('image/')) {
            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setStatus('idle');
        }
    };

    const processImage = () => {
        if (!file) return;
        setStatus('processing');
        // Placeholder simulation
        setTimeout(() => {
            setStatus('success');
        }, 2000);
    };

    return (
        <div className="max-w-5xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Background Remover</h1>
                <p className="text-zinc-400 text-lg">Remove image backgrounds automatically.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-white/10 rounded-3xl bg-white/5">
                        <div className="w-20 h-20 bg-purple-500/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                            <Sparkles size={32} className="text-purple-500" />
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-purple-500 transition-all shadow-xl cursor-pointer"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                        <p className="text-zinc-500 mt-4 text-sm">Upload JPG, PNG, WEBP</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[300px]">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src={preview} alt="Original" className="max-w-full max-h-[400px] rounded-lg" />
                            </div>

                            <div className="bg-zinc-800/50 rounded-xl p-4 border border-white/10 flex items-center justify-center min-h-[300px] relative">
                                {status === 'success' ? (
                                    <div className="text-center text-zinc-400">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <div className="relative">
                                            <div className="absolute inset-0 grid-background opacity-20" />
                                            <img src={preview} alt="Processed" className="max-w-full max-h-[400px] rounded-lg relative z-10" />
                                            <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-lg">
                                                <p className="text-white font-bold">Demo Mode Only</p>
                                            </div>
                                        </div>
                                    </div>
                                ) : status === 'processing' ? (
                                    <div className="flex flex-col items-center gap-4 text-purple-400">
                                        <Loader2 size={32} className="animate-spin" />
                                        <span className="font-bold">Removing Background...</span>
                                    </div>
                                ) : (
                                    <div className="text-zinc-500 text-sm">
                                        Processed image will appear here
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex justify-center gap-4">
                            {status === 'success' ? (
                                <button onClick={() => setFile(null)} className="bg-zinc-800 text-white px-8 py-4 rounded-xl font-bold hover:bg-zinc-700 cursor-pointer">
                                    Try Another Image
                                </button>
                            ) : status === 'idle' ? (
                                <button onClick={processImage} className="bg-purple-600 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-purple-500 transition-all shadow-xl flex items-center gap-3 cursor-pointer">
                                    <Sparkles size={20} /> Remove Background
                                </button>
                            ) : null}

                            {status !== 'processing' && (
                                <button onClick={() => setFile(null)} className="bg-zinc-800 text-zinc-400 px-8 py-5 rounded-2xl font-bold cursor-pointer hover:bg-zinc-700 hover:text-white transition">
                                    Cancel
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
