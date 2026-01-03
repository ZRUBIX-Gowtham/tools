"use client";
import { useState, useEffect, useRef } from 'react';
import { Barcode, Download, Copy, Check, Upload, FileText } from 'lucide-react';

export default function BarcodeGenerator() {
    const [text, setText] = useState('123456789012');
    const [type, setType] = useState('CODE128');
    const [barcodeUrl, setBarcodeUrl] = useState('');
    const fileInputRef = useRef(null);

    const barcodeTypes = [
        { value: 'CODE128', label: 'Code 128' },
        { value: 'CODE39', label: 'Code 39' },
        { value: 'EAN13', label: 'EAN-13' },
        { value: 'EAN8', label: 'EAN-8' },
        { value: 'UPC', label: 'UPC-A' },
    ];

    useEffect(() => {
        const generateBarcode = () => {
            // Using bwip-js would be ideal, for now using placeholder
            const url = `https://barcodeapi.org/api/${type}/${encodeURIComponent(text)}`;
            setBarcodeUrl(url);
        };
        generateBarcode();
    }, [text, type]);

    const downloadBarcode = async () => {
        try {
            const response = await fetch(barcodeUrl);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `barcode-${type}.png`;
            link.click();
            URL.revokeObjectURL(url);
        } catch (err) {
            console.error('Download failed:', err);
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setText(e.target.result.trim());
            };
            reader.readAsText(file);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Barcode Generator</h1>
                <p className="text-zinc-400 text-lg">Generate various types of barcodes.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-zinc-300">Barcode Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none font-bold text-white cursor-pointer"
                            >
                                {barcodeTypes.map((t) => (
                                    <option key={t.value} value={t.value} className="bg-zinc-900">{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold text-zinc-300">Content</label>
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <Upload size={12} /> Import from File
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                    accept=".txt,.csv,.json"
                                />
                            </div>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter barcode content..."
                                className="w-full p-4 rounded-xl bg-white/5 border border-white/10 focus:border-amber-500 outline-none font-mono text-white placeholder-zinc-500 transition-all"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-white/10 w-full min-h-[200px] flex items-center justify-center">
                            {barcodeUrl ? (
                                <>
                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                    <img
                                        src={barcodeUrl}
                                        alt="Barcode"
                                        className="mx-auto max-w-full h-auto"
                                        onError={(e) => e.target.style.display = 'none'}
                                    />
                                </>
                            ) : (
                                <p className="text-slate-400 text-sm">Preview area</p>
                            )}
                        </div>
                        <button
                            onClick={downloadBarcode}
                            className="bg-amber-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg hover:shadow-amber-500/20"
                        >
                            <Download size={18} /> Download Barcode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
