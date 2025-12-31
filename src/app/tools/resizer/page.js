"use client";
import { useState, useRef } from 'react';
import { Settings, Maximize, Download, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ImageResizer() {
    const [file, setFile] = useState(null);
    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(600);
    const [aspectRatio, setAspectRatio] = useState(true);
    const [status, setStatus] = useState('idle');
    const [resizedUrl, setResizedUrl] = useState(null);
    const fileInputRef = useRef(null);

    const handleFile = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            const img = new Image();
            img.onload = () => {
                setWidth(img.width);
                setHeight(img.height);
            };
            img.src = URL.createObjectURL(selectedFile);
        }
    };

    const handleWidthChange = (e) => {
        const val = parseInt(e.target.value) || 0;
        setWidth(val);
        if (aspectRatio && file) {
            // Logic for aspect ratio would go here
        }
    };

    const resize = async () => {
        setStatus('processing');
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
            img.onload = () => {
                const canvas = document.createElement('canvas');
                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);

                setResizedUrl(canvas.toDataURL(file.type));
                setStatus('success');
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Image Resizer</h1>
                <p className="text-slate-500 text-lg">Change the dimensions of your images quickly and easily.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-premium">
                {!file ? (
                    <div className="py-20 text-center border-4 border-dashed border-slate-100 rounded-3xl">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl"
                        >
                            Select Image
                        </button>
                        <input type="file" ref={fileInputRef} onChange={handleFile} className="hidden" accept="image/*" />
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl">
                            <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                                <Settings size={24} className="text-blue-600" />
                            </div>
                            <div className="flex-grow">
                                <p className="font-bold text-slate-900">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                            </div>
                            <button onClick={() => setFile(null)} className="text-slate-400 hover:text-rose-500 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 block text-center md:text-left">Target Width (px)</label>
                                <input
                                    type="number"
                                    value={width}
                                    onChange={handleWidthChange}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold text-lg"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-sm font-bold text-slate-700 block text-center md:text-left">Target Height (px)</label>
                                <input
                                    type="number"
                                    value={height}
                                    onChange={(e) => setHeight(parseInt(e.target.value) || 0)}
                                    className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-blue-500 outline-none transition-all font-bold text-lg"
                                />
                            </div>
                        </div>

                        <div className="flex justify-center pt-4">
                            {status === 'success' ? (
                                <div className="flex gap-4">
                                    <a href={resizedUrl} download="resized-image" className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all flex items-center gap-3">
                                        <Download size={20} /> Download Resized
                                    </a>
                                    <button onClick={() => setStatus('idle')} className="bg-slate-100 text-slate-600 px-10 py-4 rounded-2xl font-bold">Adjust Again</button>
                                </div>
                            ) : (
                                <button
                                    onClick={resize}
                                    className="bg-slate-900 text-white px-12 py-5 rounded-2xl font-bold text-xl hover:bg-blue-600 transition-all shadow-xl flex items-center gap-3"
                                >
                                    Resize Image <Maximize size={20} />
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
