"use client";
import { useState, useEffect } from 'react';
import { Barcode, Download, Copy, Check } from 'lucide-react';

export default function BarcodeGenerator() {
    const [text, setText] = useState('123456789012');
    const [type, setType] = useState('CODE128');
    const [barcodeUrl, setBarcodeUrl] = useState('');

    const barcodeTypes = [
        { value: 'CODE128', label: 'Code 128' },
        { value: 'CODE39', label: 'Code 39' },
        { value: 'EAN13', label: 'EAN-13' },
        { value: 'EAN8', label: 'EAN-8' },
        { value: 'UPC', label: 'UPC-A' },
    ];

    useEffect(() => {
        generateBarcode();
    }, [text, type]);

    const generateBarcode = () => {
        // Using bwip-js would be ideal, for now using placeholder
        const url = `https://barcodeapi.org/api/${type}/${encodeURIComponent(text)}`;
        setBarcodeUrl(url);
    };

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

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">Barcode Generator</h1>
                <p className="text-black text-lg">Generate various types of barcodes.</p>
            </div>

            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 md:p-12 shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Input */}
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black">Barcode Type</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-amber-500 outline-none font-bold text-black cursor-pointer"
                            >
                                {barcodeTypes.map((t) => (
                                    <option key={t.value} value={t.value}>{t.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-black">Content</label>
                            <input
                                type="text"
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="Enter barcode content..."
                                className="w-full p-4 rounded-xl bg-slate-50 border-2 border-transparent focus:border-amber-500 outline-none font-mono text-black"
                            />
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="flex flex-col items-center justify-center space-y-6">
                        <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 w-full">
                            {barcodeUrl && (
                                <img
                                    src={barcodeUrl}
                                    alt="Barcode"
                                    className="mx-auto max-w-full h-auto"
                                    onError={(e) => e.target.style.display = 'none'}
                                />
                            )}
                        </div>
                        <button
                            onClick={downloadBarcode}
                            className="bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-amber-600 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            <Download size={18} /> Download Barcode
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
