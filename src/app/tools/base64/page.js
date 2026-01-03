"use client";
import { useState, useRef } from 'react';
import { Code, Copy, Check, ArrowRightLeft, Upload, Download } from 'lucide-react';

export default function Base64Encoder() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [mode, setMode] = useState('encode');
    const [copied, setCopied] = useState(false);
    const fileInputRef = useRef(null);

    const process = () => {
        try {
            if (mode === 'encode') {
                setOutput(btoa(input));
            } else {
                setOutput(atob(input));
            }
        } catch (e) {
            setOutput('Error: Invalid input for ' + mode);
        }
    };

    const copyOutput = () => {
        navigator.clipboard.writeText(output);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const swap = () => {
        setInput(output);
        setOutput('');
        setMode(mode === 'encode' ? 'decode' : 'encode');
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                if (mode === 'encode') {
                    // For encoding, we want the base64 part of the data URL
                    const result = e.target.result;
                    // result is like "data:image/png;base64,iVBOR..."
                    // We can just keep the whole thing or strip the prefix. 
                    // Usually users want just the base64 for raw encoding, or the Data URI.
                    // Let's provide just the base64 data to correspond with btoa behavior on text
                    const base64 = result.split(',')[1] || result;
                    setInput(result); // Show full data URI so they can see mime type if they want
                    setOutput(base64);
                } else {
                    // For decoding, we expect a text file containing base64?
                    // Or they upload a file to *be* decoded? A file to be decoded is usually not 'uploaded' as a file, but pasted as text.
                    // If they upload a text file with base64, we read as text.
                    setInput(e.target.result);
                }
            };
            if (mode === 'encode') {
                reader.readAsDataURL(file);
            } else {
                reader.readAsText(file);
            }
        }
    };

    const downloadDecoded = () => {
        try {
            // Convert base64 to blob
            const byteCharacters = atob(input.replace(/^data:.*,/, '').trim()); // handle if input has data uri prefix
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
                byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray]);

            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'decoded-file';
            link.click();
        } catch (e) {
            alert('Failed to download: Invalid Base64');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-20">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Base64 Encoder/Decoder</h1>
                <p className="text-zinc-400 text-lg">Encode or decode Base64 strings instantly.</p>
            </div>

            <div className="bg-zinc-900/50 rounded-[2rem] border border-white/10 p-8 md:p-12 shadow-xl backdrop-blur-xl">
                {/* Mode Toggle */}
                <div className="flex justify-center mb-8">
                    <div className="inline-flex bg-white/5 rounded-xl p-1 border border-white/10">
                        <button
                            onClick={() => { setMode('encode'); setInput(''); setOutput(''); }}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'encode' ? 'bg-violet-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Encode
                        </button>
                        <button
                            onClick={() => { setMode('decode'); setInput(''); setOutput(''); }}
                            className={`px-6 py-3 rounded-lg font-bold transition-all ${mode === 'decode' ? 'bg-violet-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
                        >
                            Decode
                        </button>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold text-zinc-300">
                                {mode === 'encode' ? 'Text or File to Encode' : 'Base64 to Decode'}
                            </label>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 cursor-pointer"
                                >
                                    <Upload size={12} /> {mode === 'encode' ? 'Upload File' : 'Import Text File'}
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                            </div>
                        </div>
                        <textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={mode === 'encode' ? 'Enter text to encode...' : 'Enter Base64 string to decode...'}
                            className="w-full h-32 p-4 rounded-xl bg-white/5 border border-white/10 focus:border-violet-500 outline-none resize-none font-mono text-white placeholder-zinc-500 transition-all"
                        />
                    </div>

                    <div className="flex justify-center gap-4">
                        <button
                            onClick={process}
                            className="bg-white text-zinc-900 px-10 py-4 rounded-xl font-bold hover:bg-violet-500 hover:text-white transition-all shadow-xl"
                        >
                            {mode === 'encode' ? 'Encode' : 'Decode'}
                        </button>
                        {output && (
                            <button
                                onClick={swap}
                                className="bg-white/10 text-white px-6 py-4 rounded-xl font-bold hover:bg-white/20 transition-all flex items-center gap-2 border border-white/5"
                            >
                                <ArrowRightLeft size={18} /> Swap
                            </button>
                        )}
                        {mode === 'decode' && input && (
                            <button
                                onClick={downloadDecoded}
                                className="bg-emerald-600 text-white px-6 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 cursor-pointer shadow-lg"
                            >
                                <Download size={18} /> Download as File
                            </button>
                        )}
                    </div>

                    {output && (
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-bold text-zinc-300">Result</label>
                                <button onClick={copyOutput} className="text-sm text-zinc-400 hover:text-white flex items-center gap-1">
                                    {copied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
                                    {copied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <textarea
                                value={output}
                                readOnly
                                className="w-full h-32 p-4 rounded-xl bg-black/40 text-emerald-400 font-mono text-sm border border-white/10 outline-none resize-none"
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
